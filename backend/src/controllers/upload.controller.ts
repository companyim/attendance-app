import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

export async function uploadImage(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '이미지 파일을 선택해주세요.' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'dalant-shop',
      transformation: [
        { width: 600, height: 600, crop: 'limit', quality: 'auto' },
      ],
    });

    return res.json({ url: result.secure_url });
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return res.status(500).json({ error: '이미지 업로드 중 오류가 발생했습니다.' });
  }
}

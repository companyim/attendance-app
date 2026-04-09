import { Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../middleware/auth.middleware';
import { uploadImage } from '../controllers/upload.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/image', requireAdmin, upload.single('image'), uploadImage);

export default router;

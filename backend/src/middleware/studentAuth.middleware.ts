import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dalant-shop-secret-key';

export interface StudentPayload {
  studentId: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      student?: StudentPayload;
    }
  }
}

export function generateStudentToken(payload: StudentPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function requireStudent(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as StudentPayload;
    req.student = decoded;
    next();
  } catch {
    return res.status(401).json({ error: '인증이 만료되었습니다. 다시 로그인해주세요.' });
  }
}

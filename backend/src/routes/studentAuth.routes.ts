import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { generateStudentToken, requireStudent } from '../middleware/studentAuth.middleware';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { name, baptismName } = req.body;

    if (!name || !baptismName) {
      return res.status(400).json({ error: '이름과 세례명을 입력해주세요.' });
    }

    const student = await prisma.student.findFirst({
      where: {
        name: name.trim(),
        baptismName: baptismName.trim(),
      },
      include: {
        studentDepartments: { include: { department: true } },
      },
    });

    if (!student) {
      return res.status(404).json({ error: '일치하는 학생 정보를 찾을 수 없습니다.' });
    }

    const token = generateStudentToken({
      studentId: student.id,
      name: student.name,
    });

    const departments = student.studentDepartments.map(sd => sd.department);

    return res.json({
      token,
      student: {
        id: student.id,
        name: student.name,
        baptismName: student.baptismName,
        grade: student.grade,
        talent: student.talent,
        departments,
      },
    });
  } catch (error) {
    console.error('학생 로그인 오류:', error);
    return res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
  }
});

router.get('/me', requireStudent, async (req: Request, res: Response) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.student!.studentId },
      include: {
        studentDepartments: { include: { department: true } },
      },
    });

    if (!student) {
      return res.status(404).json({ error: '학생 정보를 찾을 수 없습니다.' });
    }

    const departments = student.studentDepartments.map(sd => sd.department);

    return res.json({
      id: student.id,
      name: student.name,
      baptismName: student.baptismName,
      grade: student.grade,
      talent: student.talent,
      departments,
    });
  } catch (error) {
    console.error('학생 정보 조회 오류:', error);
    return res.status(500).json({ error: '정보 조회 중 오류가 발생했습니다.' });
  }
});

export default router;

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;

// 데이터베이스 연결 테스트
export async function connectDatabase() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error('DATABASE_URL가 설정되지 않았습니다. Render → Environment에서 추가하세요.');
    return false;
  }
  // 로컬 SQLite (file:./dev.db) 허용
  if (url.startsWith('file:')) {
    // SQLite 로컬 개발용
  } else if (url.includes('postgresql://')) {
    if (url.includes('neon.tech') && !url.includes('sslmode=')) {
      console.error('Neon 사용 시 DATABASE_URL 끝에 ?sslmode=require 를 붙여주세요.');
      return false;
    }
  } else {
    console.error('DATABASE_URL은 file: (SQLite) 또는 postgresql:// (Neon) 형식이어야 합니다.');
    return false;
  }
  try {
    await prisma.$connect();
    console.log('데이터베이스 연결 성공');
    return true;
  } catch (error: any) {
    console.error('데이터베이스 연결 실패:', error?.message || error);
    if (error?.code === 'P1012') {
      console.error('P1012: 연결 문자열을 Neon에서 다시 복사해 붙여넣으세요. 비밀번호에 특수문자 있으면 URL 인코딩 필요.');
    }
    return false;
  }
}

// 데이터베이스 연결 종료
export async function disconnectDatabase() {
  await prisma.$disconnect();
}



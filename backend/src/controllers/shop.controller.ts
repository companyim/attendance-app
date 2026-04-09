import { Request, Response } from 'express';
import prisma from '../config/database';

// ========== 상품 (공개) ==========

export async function getProducts(req: Request, res: Response) {
  try {
    const { category, activeOnly } = req.query;
    const where: any = {};

    if (category) where.category = category;
    if (activeOnly !== 'false') where.isActive = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ products });
  } catch (error) {
    console.error('상품 목록 조회 오류:', error);
    return res.status(500).json({ error: '상품 목록 조회 중 오류가 발생했습니다.' });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }

    return res.json(product);
  } catch (error) {
    console.error('상품 조회 오류:', error);
    return res.status(500).json({ error: '상품 조회 중 오류가 발생했습니다.' });
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    return res.json({ categories: products.map(p => p.category) });
  } catch (error) {
    return res.status(500).json({ error: '카테고리 조회 중 오류가 발생했습니다.' });
  }
}

// ========== 상품 관리 (관리자) ==========

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, imageUrl, talentPrice, category, stock } = req.body;

    if (!name || talentPrice === undefined) {
      return res.status(400).json({ error: '상품명과 달란트 가격은 필수입니다.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        talentPrice: parseInt(talentPrice, 10),
        category: category || '기타',
        stock: parseInt(stock, 10) || 0,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('상품 등록 오류:', error);
    return res.status(500).json({ error: '상품 등록 중 오류가 발생했습니다.' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, talentPrice, category, stock, isActive } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description: description || null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(talentPrice !== undefined && { talentPrice: parseInt(talentPrice, 10) }),
        ...(category !== undefined && { category }),
        ...(stock !== undefined && { stock: parseInt(stock, 10) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return res.json(product);
  } catch (error) {
    console.error('상품 수정 오류:', error);
    return res.status(500).json({ error: '상품 수정 중 오류가 발생했습니다.' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    return res.json({ message: '상품이 삭제되었습니다.' });
  } catch (error) {
    console.error('상품 삭제 오류:', error);
    return res.status(500).json({ error: '상품 삭제 중 오류가 발생했습니다.' });
  }
}

// ========== 주문 (학생) ==========

export async function createOrder(req: Request, res: Response) {
  try {
    const studentId = req.student!.studentId;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: '신청할 상품을 선택해주세요.' });
    }

    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({ error: '일부 상품을 찾을 수 없거나 판매 중지된 상품입니다.' });
    }

    const productMap = new Map(products.map(p => [p.id, p]));
    let totalTalent = 0;
    const orderItems: { productId: string; quantity: number; priceAtOrder: number }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId)!;
      const qty = parseInt(item.quantity, 10) || 1;

      if (product.stock > 0 && product.stock < qty) {
        return res.status(400).json({ error: `'${product.name}'의 재고가 부족합니다. (남은 수량: ${product.stock})` });
      }

      totalTalent += product.talentPrice * qty;
      orderItems.push({
        productId: product.id,
        quantity: qty,
        priceAtOrder: product.talentPrice,
      });
    }

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({ error: '학생 정보를 찾을 수 없습니다.' });
    }

    if (student.talent < totalTalent) {
      return res.status(400).json({
        error: `달란트가 부족합니다. (보유: ${student.talent}개, 필요: ${totalTalent}개)`,
      });
    }

    const order = await prisma.order.create({
      data: {
        studentId,
        totalTalent,
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: true } },
        student: true,
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('주문 생성 오류:', error);
    return res.status(500).json({ error: '신청 중 오류가 발생했습니다.' });
  }
}

export async function getMyOrders(req: Request, res: Response) {
  try {
    const studentId = req.student!.studentId;

    const orders = await prisma.order.findMany({
      where: { studentId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ orders });
  } catch (error) {
    console.error('내 주문 조회 오류:', error);
    return res.status(500).json({ error: '신청 내역 조회 중 오류가 발생했습니다.' });
  }
}

// ========== 주문 관리 (관리자) ==========

export async function getAllOrders(req: Request, res: Response) {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: {
        student: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ orders });
  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    return res.status(500).json({ error: '신청 목록 조회 중 오류가 발생했습니다.' });
  }
}

export async function approveOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { adminMemo } = req.body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, student: true },
    });

    if (!order) return res.status(404).json({ error: '신청을 찾을 수 없습니다.' });
    if (order.status !== 'pending') return res.status(400).json({ error: '이미 처리된 신청입니다.' });

    if (order.student.talent < order.totalTalent) {
      return res.status(400).json({
        error: `학생의 달란트가 부족합니다. (보유: ${order.student.talent}개, 필요: ${order.totalTalent}개)`,
      });
    }

    const itemNames = order.items.map(i => i.product.name).join(', ');

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { status: 'approved', adminMemo: adminMemo || null },
      });

      await tx.student.update({
        where: { id: order.studentId },
        data: { talent: { decrement: order.totalTalent } },
      });

      await tx.talentTransaction.create({
        data: {
          studentId: order.studentId,
          type: 'spend',
          amount: -order.totalTalent,
          reason: `상품 신청: ${itemNames}`,
        },
      });

      for (const item of order.items) {
        if (item.product.stock > 0) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    });

    return res.json({ message: '신청이 승인되었습니다.' });
  } catch (error) {
    console.error('주문 승인 오류:', error);
    return res.status(500).json({ error: '승인 처리 중 오류가 발생했습니다.' });
  }
}

export async function rejectOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { adminMemo } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ error: '신청을 찾을 수 없습니다.' });
    if (order.status !== 'pending') return res.status(400).json({ error: '이미 처리된 신청입니다.' });

    await prisma.order.update({
      where: { id },
      data: { status: 'rejected', adminMemo: adminMemo || null },
    });

    return res.json({ message: '신청이 거절되었습니다.' });
  } catch (error) {
    console.error('주문 거절 오류:', error);
    return res.status(500).json({ error: '거절 처리 중 오류가 발생했습니다.' });
  }
}

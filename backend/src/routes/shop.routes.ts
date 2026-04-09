import { Router } from 'express';
import * as shopController from '../controllers/shop.controller';
import { requireAdmin } from '../middleware/auth.middleware';
import { requireStudent } from '../middleware/studentAuth.middleware';

const router = Router();

router.get('/products', shopController.getProducts);
router.get('/products/categories', shopController.getCategories);
router.get('/products/:id', shopController.getProduct);

router.post('/orders', requireStudent, shopController.createOrder);
router.get('/orders/my', requireStudent, shopController.getMyOrders);

router.post('/products', requireAdmin, shopController.createProduct);
router.put('/products/:id', requireAdmin, shopController.updateProduct);
router.delete('/products/:id', requireAdmin, shopController.deleteProduct);
router.get('/orders', requireAdmin, shopController.getAllOrders);
router.put('/orders/:id/approve', requireAdmin, shopController.approveOrder);
router.put('/orders/:id/reject', requireAdmin, shopController.rejectOrder);

export default router;

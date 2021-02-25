import express from 'express'
const router = express.Router();
import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders } from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'

//this end point is going to be hit in action files
router.post('/', protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
// router.get('/:id', protect, getOrderById);
router.route('/:id').get(protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

export default router;


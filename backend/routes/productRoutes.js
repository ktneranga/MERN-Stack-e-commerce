import express from 'express';
const router = express.Router();
//import controllers
import { getProductById, getProducts, deleteProduct, createProduct, updateProduct } from '../controllers/productController.js'
import { protect, Admin } from '../middleware/authMiddleware.js'

//we don't need to have all the routes function here, we can make it clear using controllers     

router.route('/').get(getProducts);
router.post('/', protect, Admin, createProduct);
router.put('/:id', protect, Admin, updateProduct)
router.route('/:id').get(getProductById);
router.delete('/:id', protect, Admin, deleteProduct);



export default router;

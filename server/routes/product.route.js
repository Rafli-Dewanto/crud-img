import { Router } from 'express'
import { getProducts, getProductById, saveProduct, updateProduct, deleteProduct } from '../controller/product.controller.js';

const router = Router()

router.get('/products', getProducts)
router.get('/products/:id', getProductById)
router.post('/products', saveProduct)
router.patch('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

export default router;
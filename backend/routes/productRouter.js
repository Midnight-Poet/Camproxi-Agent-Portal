import express from 'express';
import { authenticate } from '../middlewares/authMddleware.js';
import { assignProductId } from '../middlewares/generateId.js';
import { productUpload, upload } from '../middlewares/upload.js';
import {
	createProduct,
	deleteImages,
	deleteProduct,
	fetchAllProduct,
	updateProduct,
} from '../controllers/productController.js';

const router = express.Router();

router
	.route('/newProduct')
	.post(
		authenticate,
		assignProductId,
		productUpload.array('images', 5),
		createProduct,
	);
router.route('/allProduct').get(authenticate, fetchAllProduct);
router
	.route('/update')
	.put(
		authenticate,
		productUpload.array('images', 5),
		updateProduct,
		deleteImages,
	);
router.route('/delete').delete(authenticate, deleteProduct)

export default router;

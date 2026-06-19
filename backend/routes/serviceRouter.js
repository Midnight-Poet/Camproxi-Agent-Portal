import express from 'express';
import { authenticate } from '../middlewares/authMddleware.js';
import { assignServiceId } from '../middlewares/generateId.js';
import { serviceUpload } from '../middlewares/upload.js';
import {
	createService,
	deleteImages,
	deleteService,
	fetchAllService,
	updateService,
} from '../controllers/serviceController.js';

const router = express.Router();

router
	.route('/newService')
	.post(
		authenticate,
		assignServiceId,
		serviceUpload.single('images'),
		createService,
	);
router.route('/allService').get(authenticate, fetchAllService);
router
	.route('/update')
	.put(
		authenticate,
		serviceUpload.single('images'),
		updateService,
		deleteImages,
	);
router.route('/delete').delete(authenticate, deleteService);

export default router;

import express from 'express';
import { authenticate } from '../middlewares/authMddleware.js';
import {
	createProperty,
	deleteImages,
	deleteProperty,
	fetchAllProperty,
	updateProperty,
} from '../controllers/propertyController.js';
import { upload } from '../middlewares/upload.js';
import { assignPropertyId } from '../middlewares/generateId.js';

const route = express.Router();
route
	.route('/create')
	.post(
		authenticate,
		assignPropertyId,
		upload.array('images', 6),
		createProperty,
	);
route.route('/getAll').get(authenticate, fetchAllProperty);
route
	.route('/update')
	.put(
		authenticate,
		upload.array('images', 6),
		updateProperty,
		deleteImages
	);
route.route('/delete').delete(authenticate, deleteProperty)
export default route;

import express from 'express';
import { authenticate } from '../middlewares/authMddleware.js';
import {
	createUser,
	getAgent,
	logout,
	updateUser,
	userLogin,
} from '../controllers/userController.js';
import { profileUpload } from '../middlewares/upload.js';


const router = express.Router();

router.route('/register').post(createUser);
router.route('/').post(userLogin);
router.route('/update').put(authenticate, profileUpload.single('profileImage'), updateUser);
router.route('/logout').post(logout);
router.route('/fetch/:id').get(authenticate, getAgent)

export default router;

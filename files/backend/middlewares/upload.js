import cloudinary from '../config/cloudinary.js';
import CloudinaryStorage from 'multer-storage-cloudinary';
import multer from 'multer';
import 'dotenv/config'; 
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: (req, file, cb) => {
		const fileName = file.originalname
			.split('.')[0]
			.replace(/[^\w\-]+/g, '');
		cb(null, {
			folder: `uploads/agent/${req.agent._id}/property/${req.propertyId || req.body.propertyId}/`,
			public_id: `${req.params.file || fileName + Date.now()}`,
		});
	},
});
const productStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: (req, file, cb) => {
		const fileName = file.originalname
			.split('.')[0]
			.replace(/[^\w\-]+/g, '');
		cb(null, {
			folder: `uploads/agent/${req.agent._id}/products/${req.productId || req.body.productId}/`,
			public_id: `${req.params.file || fileName + Date.now()}`,
		});
	},
});

const profileStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: (req, file, cb) => {
		const fileName = file.fieldname
		cb(null, {
			folder: `uploads/agent/${req.agent._id}/profile/`,
			public_id: `${req.params.file || fileName}`,
		});
	},
});

const serviceStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: (req, file, cb) => {
		const fileName = file.originalname
			.split('.')[0]
			.replace(/[^\w\-]+/g, '');
		cb(null, {
			folder: `uploads/agent/${req.agent._id}/services/${req.serviceId || req.body.serviceId}`,
			public_id: `${req.params.file || fileName + Date.now()}`,
		});
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			new Error(
				'Invalid file type. Only JPEG, PNG, and WebP are allowed!',
			),
			false,
		);
	}
};

export const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 10, // 5MB limit
	},
});

export const productUpload = multer({
	storage: productStorage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 10, // 5MB limit
	},
});

export const profileUpload = multer({
	storage: profileStorage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 10, // 5MB limit
	},
});

export const serviceUpload = multer({
	storage: serviceStorage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 10, // 5MB limit
	},
});

import Product from '../model/product.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import generateToken from '../utils/token.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import {
	rollbackCloudinaryUpload,
	rollbackCloudinaryUploadImage,
} from '../utils/cloudinaryRollback.js';

const createProduct = asyncHandler(async (req, res) => {
	const {
		name,
		price,
		description,
		isAvailable,
		category,
		businessCategory,
		deliveryOption,
		deliveryPrice,
		deliveryDuration,
		coverImage,
	} = req.body;
	const data = {
		productId: req.productId,
		name,
		price,
		description,
		isAvailable,
		category,
		businessCategory,
		images: [],
		delivery: {
			option: deliveryOption,
			price: deliveryPrice || 0,
			duration: deliveryDuration || 0,
		},
		agent: req.agent._id,
	};
	req.files
		? req.files.forEach((file) => {
				data.images = [
					...data.images,
					{
						url: file.url,
						public_id: file.public_id,
						isCover: file.public_id.includes(coverImage),
					},
				];
			})
		: null;
	try {
		const product = new Product(data);
		await product.save();
		res.json(product);
	} catch (err) {
		await rollbackCloudinaryUpload(
			`uploads/agent/${req.agent._id}/products/${req.productId || req.body.productId}`,
		);
		throw new Error(err);
	}
});

const updateProduct = asyncHandler(async (req, res, next) => {
	const product = await Product.findById(req.body.id);
	const {
		name,
		price,
		description,
		isAvailable,
		category,
		businessCategory,
		deliveryOption,
		deliveryPrice,
		deliveryDuration,
		coverImage,
	} = req.body;
	const data = {
		name,
		price,
		description,
		isAvailable,
		category,
		businessCategory,
		images: [...product.images],
		delivery: {
			option: deliveryOption,
			price: deliveryPrice || product.delivery.price,
			duration: deliveryDuration || product.delivery.duration,
		},
	};
	req.files
		? req.files.forEach((file) => {
				data.images = [
					...data.images,
					{
						url: file.url,
						public_id: file.public_id,
						isCover: file.public_id.includes(coverImage),
					},
				];
			})
		: null;
	let publicIds = [];
	data.images.forEach((item) => (publicIds = [...publicIds, item.public_id]));
	Object.assign(product, data);
	try {
		await product.save();
		next();
	} catch (err) {
		throw new Error(err);
		await rollbackCloudinaryUploadImage(publicIds);
	}
});

const fetchAllProduct = asyncHandler(async (req, res) => {
	try {
		const data = await Product.find({ agent: req.agent._id });
		res.json(data);
	} catch (error) {
		console.error(error);
	}
});

const deleteImages = asyncHandler(async (req, res) => {
	const { publicIds } = req.body;
	const product = Product.findById(req.body.id);

	if (!JSON.parse(publicIds) || JSON.parse(publicIds).length === 0) {
		// next();
		return res.send({'message': 'completed'})
	} else {
		try {
			const result = await cloudinary.v2.api.delete_resources(
				JSON.parse(publicIds),
				{
					resource_type: 'image',
					invalidate: true, // 👈 Important: Clears the CDN cache
				},
			);
			await Product.findByIdAndUpdate(req.body.id, {
				$pull: {
					images: { public_id: { $in: JSON.parse(publicIds) } },
				},
			});
			console.log('Successfully deleted from Cloudinary', result.deleted);
			// next();
			res.json({ message: 'okay' });
		} catch (error) {
			console.error('Cloudinary Delete Error:', error);
			res.status(500).json({ message: 'Failed to delete images', error });
		}
	}
});

const deleteProduct = asyncHandler(async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.body.id);
		await rollbackCloudinaryUpload(
			`uploads/agent/${req.agent._id}/product/${req.productId || req.body.productId}`,
		);
		res.send(product)
	} catch (err) {
		throw new Error(err);
	}
});

export { createProduct, fetchAllProduct, updateProduct, deleteImages,deleteProduct };

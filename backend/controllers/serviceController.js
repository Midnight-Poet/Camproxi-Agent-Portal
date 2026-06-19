import Service from '../model/service.js';
import cloudinary from '../config/cloudinary.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import generateToken from '../utils/token.js';
import bcrypt from 'bcryptjs';
import { rollbackCloudinaryUpload } from '../utils/cloudinaryRollback.js';

const createService = asyncHandler(async (req, res) => {
	const {
		name,
		address,
		serviceCategory,
		availableDays,
		description,
		price,
		perUnit,
		// lng,
		// lat,
		startTime,
		endTime,
	} = req.body;

	const data = {
		serviceId: req.serviceId,
		name,
		address,
		serviceCategory,
		availableDays: JSON.parse(availableDays),
		description,
		time: { startTime, endTime },
		price: Number(price),
		perUnit,
		// location: { lat: Number(lat), lng: Number(lng) },
		agent: req.agent._id,
		images: [],
	};
	req.file
		? (data.images = [
				...data.images,
				{ url: req.file.url, public_id: req.file.public_id },
			])
		: null;
	try {
		// console.log(data)
		const service = new Service(data);
		await service.save();
		res.json(service);
	} catch (err) {
		await rollbackCloudinaryUpload(
			`uploads/agent/${req.agent._id}/service/${req.serviceId || req.body.serviceId}`,
		);
		throw new Error(err);
	}
});

const updateService = asyncHandler(async (req, res, next) => {
	const service = await Service.findById(req.body.id);
	const {
		name,
		address,
		serviceCategory,
		availableDays,
		description,
		price,
		perUnit,
		// lng,
		// lat,
		startTime,
		endTime,
	} = req.body;
	const data = {
		name,
		address,
		serviceCategory,
		availableDays: JSON.parse(availableDays),
		description,
		time: { startTime, endTime },
		price: Number(price),
		perUnit,
		// location: { lat: Number(lat), lng: Number(lng) },
		agent: req.agent._id,
		images: [...service.images],
	};

	req.file
		? (data.images = [
				...data.images,
				{ url: req.file.url, public_id: req.file.public_id },
			])
		: null;

	try {
		// console.log(req.body)
		// console.log(data)
		// console.log(service)
		Object.assign(service, data);
		await service.save();
		next();
	} catch (err) {
		throw new Error(err);
	}
});

const deleteImages = asyncHandler(async (req, res) => {
	const { publicIds } = req.body;

	const service = Service.findById(req.body.id);

	if (!JSON.parse(publicIds) || JSON.parse(publicIds).length === 0) {
		// next();
		return res.json({ message: 'Deleted' });
	} else {
		try {
			const result = await cloudinary.v2.api.delete_resources(
				JSON.parse(publicIds),
				{
					resource_type: 'image',
					invalidate: true, // 👈 Important: Clears the CDN cache
				},
			);
			await Service.findByIdAndUpdate(req.body.id, {
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

const fetchAllService = asyncHandler(async (req, res) => {
	try {
		const data = await Service.find({ agent: req.agent._id });
		res.json(data);
	} catch (error) {
		console.error(error);
	}
});

const deleteService = asyncHandler(async (req, res) => {
	try {
		const service = await Service.findByIdAndDelete(req.body.id);
		await rollbackCloudinaryUpload(
			`uploads/agent/${req.agent._id}/service/${req.serviceId || req.body.serviceId}`,
		);
		res.send(service);
	} catch (err) {
		throw new Error(err);
	}
});

export {
	createService,
	fetchAllService,
	updateService,
	deleteImages,
	deleteService,
};

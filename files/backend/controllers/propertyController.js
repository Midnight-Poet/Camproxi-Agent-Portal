import Property from '../model/property.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import generateToken from '../utils/token.js';
import bcrypt from 'bcryptjs';
import { rollbackCloudinaryUpload } from '../utils/cloudinaryRollback.js';
import cloudinary from '../config/cloudinary.js';

const createProperty = asyncHandler(async (req, res) => {
	const {
		name,
		address,
		roomType,
		amenities,
		description,
		price,
		unitQuantity,
		lng,
		lat,
	} = req.body;

	const data = {
		propertyId: req.propertyId,
		name,
		address,
		roomType,
		amenities: JSON.parse(amenities),
		description,
		price: Number(price),
		unitQuantity: Number(unitQuantity),
		location: { lat: Number(lat), lng: Number(lng) },
		agent: req.agent._id,
		images: [],
	};
	req.files?.forEach((element) => {
		data.images = [
			...data.images,
			{ url: element.url, public_id: element.public_id },
		];
	});
	try {
		const property = new Property(data);
		await property.save();
		res.json(property);
	} catch (err) {
		await rollbackCloudinaryUpload(
			`uploads/agent/${req.agent._id}/property/${req.propertyId || req.body.propertyId}`,
		);
		throw new Error(err);
		console.log(err);
		console.log(data);
	}
});

const fetchAllProperty = asyncHandler(async (req, res) => {
	try {
		const data = await Property.find({ agent: req.agent._id });
		res.json(data);
	} catch (error) {
		console.error(error);
	}
});

const updateProperty = asyncHandler(async (req, res, next) => {
	const property = await Property.findById(req.body.id);
	const {
		name,
		address,
		roomType,
		amenities,
		description,
		price,
		unitQuantity,
		lng,
		lat,
	} = req.body;

	const data = {
		name,
		address,
		roomType,
		amenities: JSON.parse(amenities),
		description,
		price: Number(price),
		unitQuantity: Number(unitQuantity),
		location: { lat: Number(lat), lng: Number(lng) },
		agent: req.agent._id,
		images: [...property.images],
	};
	req.files?.forEach((element) => {
		data.images = [
			...data.images,
			{ url: element.url, public_id: element.public_id },
		];
	});
	Object.assign(property, data);
	try {
		await property.save();
		next();
	} catch (err) {
		throw new Error(err);
	}
});

const deleteProperty = asyncHandler(async (req, res) => {
	try {
		const property = await Property.findByIdAndDelete(req.body.id);
		await rollbackCloudinaryUpload(
			`uploads/agent/${req.agent._id}/property/${req.propertyId || req.body.propertyId}`,
		);
		res.send(property)
	} catch (err) {
		throw new Error(err);
	}
});

const deleteImages = asyncHandler(async (req, res) => {
	const { publicIds } = req.body;

	const property = Property.findById(req.body.id);

	if (!JSON.parse(publicIds) || JSON.parse(publicIds).length === 0) {
		// next();
		return res.send({ message: 'completed' });
	} else {
		try {
			const result = await cloudinary.v2.api.delete_resources(
				JSON.parse(publicIds),
				{
					resource_type: 'image',
					invalidate: true, // 👈 Important: Clears the CDN cache
				},
			);
			await Property.findByIdAndUpdate(req.body.id, {
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

export { createProperty, fetchAllProperty, updateProperty, deleteImages, deleteProperty };

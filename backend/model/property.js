import mongoose, { trusted } from 'mongoose';
import { timestamp } from 'rxjs';

const propertySchema = mongoose.Schema({
	name: { type: String, required: true },
	address: { type: String, required: true },
	roomType: { type: String, required: true },
	amenities: [{ type: String, required: true }],
	description: { type: String, required: true },
	price: { type: Number, required: true },
	unitQuantity: { type: Number, required: true },
	location: {
		lat: { type: Number, required: true },
		lng: { type: Number, required: true },
	},
	images: [{ url: String, public_id: String, isCover: Boolean }],
	agent: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Agent',
	},
	isVacant: { type: Boolean, required: true, default: true },
	propertyId: { type: String, required: true },
    status: {type: String, required: true, default: 'pending'}
});

const Property = mongoose.model('Property', propertySchema);

export default Property;

import mongoose, { trusted } from 'mongoose';
import { timestamp } from 'rxjs';

const serviceSchema = mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    serviceCategory: { type: String, required: true },
    availableDays: [{ type: String, required: true }],
    description: { type: String, required: true },
    price: { type: Number, required: true },
    perUnit: { type: String, required: true },
    // location: {
    //     lat: { type: Number, required: true },
    //     lng: { type: Number, required: true },
    // },
    time: {
        startTime: {type: String, required: true},
        endTime: {type: String, required: true},
    },
    images: [{ url: String, public_id: String, isCover: Boolean }],
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Agent',
    },
    isAvailable: { type: Boolean, required: true, default: true },
    serviceId: { type: String, required: true },
    status: {type: String, required: true, default: 'pending'}
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;

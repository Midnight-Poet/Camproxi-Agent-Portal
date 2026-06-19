import mongoose, { trusted } from 'mongoose';
import { timestamp } from 'rxjs';

const productSchema = mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    businessCategory: { type: String, required: true },
	delivery: {
		option: String,
		price: Number,
		duration: {
			type: Number,
		},
	},
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ url: String, public_id: String, isCover: Boolean }],
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Agent',
    },
    isAvailable: { type: Boolean, required: true, default: true },
    status: {type: String, required: true, default: 'pending'}
});

const Product = mongoose.model('Product', productSchema);

export default Product;

import mongoose, { trusted } from 'mongoose';
import { timestamp } from 'rxjs';

const agentSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		companyName: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		phone: {
			type: Number,
			required: true,
		},

		whatsapp: {
			type: Number,
		},
		profileImage: {
			url: String,
			public_id: String,
		},
		address: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
			default: '',
		},
		socialLinks: {
			facebook: {
				type: String,
				default: '',
			},
			twitter: {
				type: String,
				default: '',
			},
			instagram: {
				type: String,
				default: '',
			},
		},
	},
	{ timestamps: true },
);

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;

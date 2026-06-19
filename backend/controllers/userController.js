import Agent from '../model/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import generateToken from '../utils/token.js';
import bcrypt from 'bcryptjs';

const createUser = asyncHandler(async (req, res) => {
	const {
		firstName,
		lastName,
		username,
		email,
		password,
		address,
		phone,
		whatsapp,
		companyName,
		category,
	} = req.body;
	if (
		!firstName ||
		!lastName ||
		!username ||
		!email ||
		!password ||
		!phone ||
		!companyName ||
		!category
	) {
		throw new Error('Missing certain values');
	}
	const existingUser = await Agent.findOne({ email });
	if (existingUser) {
		throw new Error('User Already Exists');
	}
	const salt = await bcrypt.genSalt(15);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newAgent = new Agent({
		firstName,
		lastName,
		username,
		email,
		password: hashedPassword,
		address,
		phone: Number(phone),
		whastapp: Number(whatsapp),
		companyName,
		category,
	});

	try {
		await newAgent.save();
		generateToken(res, newAgent._id);
		res.status(201).send({
			_id: newAgent._id,
			username: newAgent.username,
			email: newAgent.email,
			firstName: newAgent.firstName,
			lastName: newAgent.lastName,
			phoneNumber: newAgent.phoneNumber,
			companyName: newAgent.companyName,
			category: newAgent.category,
		});
	} catch (err) {
		throw new Error(`Error creating User: ${err}`);
	}
});

const updateUser = asyncHandler(async (req, res) => {
	const agent = await Agent.findById(req.agent._id);
	if (!agent) {
		throw new Error('Agent does not exist');
	}
	try {
		const {
			firstName,
			lastName,
			username,
			email,
			address,
			phone,
			whatsapp,
			companyName,
			bio,
			facebook,
			instagram,
			twitter,
		} = req.body;


		const profileImage = req.file
			? { url: req.file.url, public_id: req.file.public_id }
			: agent.profileImage;

		const data = {
			firstName,
			lastName,
			username,
			email,
			address,
			phone: Number(phone),
			whatsapp: Number(whatsapp),
			companyName,
			bio,
			socialLinks: {
				facebook,
				twitter,
				instagram,
			},
			profileImage
		};
		Object.assign(agent, data);

		const updatedUser = await agent.save();
		res.status(201).send({
			_id: agent._id,
			username: agent.username,
			email: agent.email,
			firstName: agent.firstName,
			lastName: agent.lastName,
			phoneNumber: agent.phoneNumber,
			companyName: agent.companyName,
			category: agent.category,
			businessCategory: agent.businessCategory,
			profileImage: agent.profileImage,
		});
	} catch (err) {
		throw new Error(err);
	}
});

const userLogin = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new Error('Invalid Entry');
	}
	const ExistingUser = await Agent.findOne({ email });
	try {
		if (ExistingUser) {
			const isPasswordValid = await bcrypt.compare(
				password,
				ExistingUser.password,
			);
			if (isPasswordValid) {
				generateToken(res, ExistingUser._id);
				res.status(201).send({
					_id: ExistingUser._id,
					username: ExistingUser.username,
					email: ExistingUser.email,
					firstName: ExistingUser.firstName,
					lastName: ExistingUser.lastName,
					phoneNumber: ExistingUser.phoneNumber,
					companyName: ExistingUser.companyName,
					category: ExistingUser.category,
					businessCategory: ExistingUser.businessCategory,
					profileImage: ExistingUser.profileImage,
				});
			} else {
				res.status(400).json({
					message: 'Incorrect Password',
				});
			}
		} else {
			res.status(404).json({
				message: 'Account Does Not Exist',
			});
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
});

const logout = asyncHandler(async (req, res) => {
	res.cookie('jwt', '', {
		httpOnly: true,
		expires: new Date(0),
	});
	res.status(200).json({ messge: 'Logged out!' });
});

const getAgent = asyncHandler(async (req, res) => {
	const users = await Agent.findById(req.params.id, '-password');
	try {
		if (users) {
			res.json(users);
		} else {
			res.status(404).json({ message: 'User Not Found' });
		}
	} catch (error) {
		console.error(error);
	}
});

export { createUser, updateUser, userLogin, logout, getAgent };

import jwt from 'jsonwebtoken';
import Agent from '../model/userModel.js';
import asyncHandler from './asyncHandler.js';

const authenticate = asyncHandler(async (req, res, next) => {
	let token = req.cookies.jwt;

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_TOKEN);
			req.agent = await Agent.findById(decoded.userId).select('-password');
			next();
		} catch (error) {
			res.status(401);
			throw new Error('Not authorized, token failed');
            
		}
	} else {
		res.status(401).send('Not authorized, no token');
	}
});

const authorized = (req, res, next) => {
    if(req.agent && req.agent.isAdmin) {
        next()
    } else {
        res.status(401).send('Not authorized as admin');
    }
}

export {authenticate, authorized};

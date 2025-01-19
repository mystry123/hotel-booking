import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : '';

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id); // Assuming the token contains the user ID as 'id'

            console.log('user', user);
            if (!user) {
                throw new Error('User not found');
            }

            req.user = user;
        } catch (e) {
            console.error('Invalid token:', e);
        }
    }
    next();
};

export { authenticate };
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Authentication token is required'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token || !token.trim()) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Authentication token is required'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
    } catch (err) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Invalid or expired authentication token'
      });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Invalid token payload'
      });
    }

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'The user belonging to this token no longer exists'
      });
    }

    // Attach minimal safe identity using the current database role
    req.user = {
      id: currentUser._id.toString(),
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

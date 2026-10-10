import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/user.model.js';

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: config.jwtExpiresIn
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (
      name === undefined ||
      name === null ||
      typeof name !== 'string' ||
      name.trim().length < 2 ||
      name.trim().length > 100
    ) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Name is required and must be between 2 and 100 characters'
      });
    }

    if (
      email === undefined ||
      email === null ||
      typeof email !== 'string' ||
      email.trim().length > 255 ||
      !EMAIL_REGEX.test(email.trim())
    ) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Please provide a valid email address'
      });
    }

    if (
      password === undefined ||
      password === null ||
      typeof password !== 'string' ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Password is required and must be between 8 and 128 characters'
      });
    }

    if (Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Password must not exceed 72 UTF-8 bytes'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Email address is already registered'
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'user' // Hardcoded role for public registration
    });

    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt
        }
      }
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Email address is already registered'
      });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      email === undefined ||
      email === null ||
      typeof email !== 'string' ||
      !email.trim() ||
      password === undefined ||
      password === null ||
      typeof password !== 'string' ||
      !password ||
      Buffer.byteLength(password, 'utf8') > 72
    ) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};

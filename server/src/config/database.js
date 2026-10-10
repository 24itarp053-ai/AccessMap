import mongoose from 'mongoose';
import config from './env.js';

const sanitizeError = (err) => {
  if (!err || !err.message) return 'Unknown database error';
  return err.message.replace(/\/\/[^@]+@/, '//***:***@');
};

export const connectDatabase = async () => {
  if (!config.mongodbUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error [${error.name || 'Error'}]: ${sanitizeError(error)}`);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    } catch (error) {
      console.error(`Error closing MongoDB connection [${error.name || 'Error'}]: ${sanitizeError(error)}`);
      throw error;
    }
  }
};

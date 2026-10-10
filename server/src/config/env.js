import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PLACEHOLDER_SECRET = 'your_secure_random_jwt_secret_at_least_32_chars_long';
const STRICT_DURATION_REGEX = /^[1-9]\d*(ms|[smhd])$/i;

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

export const validateConfig = () => {
  if (!config.mongodbUri || config.mongodbUri.trim() === '') {
    throw new Error('MONGODB_URI environment variable is required');
  }

  const trimmedSecret = config.jwtSecret.trim();
  if (!trimmedSecret || trimmedSecret.length < 32 || trimmedSecret === PLACEHOLDER_SECRET) {
    throw new Error(
      'JWT_SECRET environment variable is required, must be at least 32 characters long, and must not be the example placeholder value'
    );
  }

  const trimmedExpiresIn = config.jwtExpiresIn.trim();
  if (!trimmedExpiresIn || !STRICT_DURATION_REGEX.test(trimmedExpiresIn)) {
    throw new Error('JWT_EXPIRES_IN environment variable must be a positive integer duration with a unit (e.g. 7d, 24h, 3600s, 500ms)');
  }
};

export default config;

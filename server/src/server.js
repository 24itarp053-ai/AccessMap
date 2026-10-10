import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import config, { validateConfig } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

let server = null;
let isShuttingDown = false;

const sanitizeError = (err) => {
  if (!err || !err.message) return 'Unknown error';
  return err.message.replace(/\/\/[^@]+@/, '//***:***@');
};

export const startServer = async () => {
  try {
    validateConfig();
    await connectDatabase();

    server = app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
    return server;
  } catch (error) {
    console.error(`Failed to start server [${error.name || 'Error'}]: ${sanitizeError(error)}`);
    process.exit(1);
  }
};

export const handleShutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`Received ${signal}. Starting graceful shutdown...`);
  let hasError = false;

  if (server) {
    await new Promise((resolve) => {
      server.close((err) => {
        if (err) {
          console.error(`Error closing HTTP server: ${err.message}`);
          hasError = true;
        } else {
          console.log('HTTP server closed.');
        }
        resolve();
      });
    });
  }

  try {
    await disconnectDatabase();
  } catch (err) {
    hasError = true;
  }

  if (hasError) {
    console.error('Graceful shutdown completed with errors.');
    process.exit(1);
  } else {
    console.log('Graceful shutdown completed successfully.');
    process.exit(0);
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

const __filename = fileURLToPath(import.meta.url);
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

if (isMain) {
  startServer();
}

export default app;

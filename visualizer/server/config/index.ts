import dotenv from 'dotenv';

// Load base .env file from visualizer directory (one level up from server)
dotenv.config({path: `${__dirname}/../.env`});

const envpath = process.env.NODE_ENV === 'development' ? `${__dirname}/../.env.development` : `${__dirname}/../.env.production`;

// Load environment-specific .env file
dotenv.config({ path: envpath });

export const config = {
  jwtSecret: process.env.JWT_SECRET || 'infra0-jwt-secret-1945',
  mongoDbUri: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/visualizer',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
};

// Validate required environment variables
if (!config.anthropicApiKey) {
  console.warn('WARNING: ANTHROPIC_API_KEY environment variable is not set. Please set it in your .env file.');
}
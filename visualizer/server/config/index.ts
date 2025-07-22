import dotenv from 'dotenv';
dotenv.config();

const envpath = process.env.NODE_ENV === 'development' ? '../.env.development' : '../.env.production';
dotenv.config({ path: envpath });

export const config = {
  jwtSecret: process.env.JWT_SECRET || 'logwise-jwt-secret-1945',
  mongoDbUri: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/visualizer',
};

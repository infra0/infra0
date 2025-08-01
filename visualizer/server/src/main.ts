import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from '../config';
import authRoutes from './routes/auth.route'
import conversationRoutes from './routes/conversation.route'
import { AppError } from './errors/app-error';
import httpStatus from 'http-status';
import globalErrorHandler from './errors/global-app-error';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import seedRoutes from './routes/seed.route';

const app = express();

async function connectWithRetry(retries = 5, delay = 1000) {
    try {
        await mongoose.connect(config.mongoDbUri);
        console.log('Database connected successfully!');
    } catch (err) {
        if (retries > 0) {
            console.log(`Database connection failed! Retrying in ${delay / 1000}s... (${retries} retries left)`, err);
            setTimeout(() => connectWithRetry(retries - 1, delay * 2), delay);
        } else {
            console.error('Database connection failed after multiple attempts.', err);
            throw err;
        }
    }
}

connectWithRetry();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());

if(config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

if(config.nodeEnv === 'production') {
    const limiter = rateLimit({
        max: 300,
        windowMs: 60 * 60 * 1000,
        message: 'Too many requests from this IP, please try again in an hour!'
    });
    app.use('/api/v1/', limiter);
}
const port = process.env.PORT || 4000;

app.get('/health', (req, res) => {
    res.send('OK');
});

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/chat', conversationRoutes);

app.use('/api/v1/seed', seedRoutes);

app.use(express.static(path.join(__dirname, 'visualizer-ui-build')));

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, httpStatus.NOT_FOUND));
});
  
app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
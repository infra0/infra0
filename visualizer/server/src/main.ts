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

const app = express();

mongoose.connect(config.mongoDbUri).then(() => {
    console.log('Database connected successfully!')
}).catch(err => {
    console.log('Database connection failed!', err)
})

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());

if(config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api/v1/', limiter);

const port = process.env.PORT || 4000;

app.get('/health', (req, res) => {
    res.send('OK');
});

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/chat', conversationRoutes);

app.use(express.static(path.join(__dirname, 'visualizer-ui-build')));

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, httpStatus.NOT_FOUND));
});
  
app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
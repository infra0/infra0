import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { config } from '../config';
import authRoutes from './routes/auth.route'
import conversationRoutes from './routes/conversation.route'

// Check if required packages are available
try {
    require('ai');
} catch (error) {
    console.error('ai package is NOT available - run: npm install ai');
}

try {
    require('@ai-sdk/anthropic');
} catch (error) {
    console.error('@ai-sdk/anthropic package is NOT available - run: npm install @ai-sdk/anthropic');
}

const app = express();

mongoose.connect(config.mongoDbUri).then(() => {
    console.log('Database connected successfully!')
}).catch(err => {
    console.log('Database connection failed!', err)
})

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 4000;

app.get('/health', (req, res) => {
    res.send('OK');
});

app.use('/v1/api/auth', authRoutes);

app.use('/v1/api/conversation', conversationRoutes);

// Serve the UI build
app.use(express.static(path.join(__dirname, 'visualizer-ui-build')));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('UNHANDLED ERROR:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Request URL:', req.url);
    console.error('Request method:', req.method);
    
    if (!res.headersSent) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: err.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
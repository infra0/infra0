import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { config } from '../config';
import authRoutes from './routes/auth.route'

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

// Serve the UI build
app.use(express.static(path.join(__dirname, 'visualizer-ui-build')));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
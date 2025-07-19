import express from 'express';
import path from 'path';

const app = express();

// Serve the UI build
app.use(express.static(path.join(__dirname, 'visualizer-ui-build')));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
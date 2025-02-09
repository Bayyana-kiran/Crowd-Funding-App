import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

// Enable CORS with specific options
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: err.message
    });
});

const PORT = process.env.PORT || 5987;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
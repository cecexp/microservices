import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import routes from './src/routes/routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(bodyParser.json());
app.use(morgan('dev'));

// CORS configuration (simple setup for development)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/api', routes);

// --- ERROR HANDLING MIDDLEWARE ---
// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ 
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Microservice running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
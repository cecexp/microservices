import { Router } from "express";
import { isValidApiKey } from "../utils/apiKeyValidator.js";
import { createToken, authenticateToken, refreshToken } from "../authentication/auth.js";

const router = Router();

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'authentication-service',
        version: '1.0.0'
    });
});

// Public route to generate a new token using an API key
router.post('/token', (req, res) => {
    const { apiKey } = req.body;

    // Input validation
    if (!apiKey) {
        return res.status(400).json({ message: 'API key is required in request body.' });
    }

    if (typeof apiKey !== 'string') {
        return res.status(400).json({ message: 'API key must be a string.' });
    }

    if (!isValidApiKey(apiKey)) {
        return res.status(401).json({ message: 'Invalid API key.' });
    }

    try {
        const token = createToken(apiKey);
        res.json({ token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/token/verify', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Token is valid.',
        user: req.user
    });
});

// Protected route to refresh an existing token
router.post('/token/refresh', authenticateToken, (req, res) => {
    const oldToken = req.headers['authorization'].split(' ')[1];

    try {
        const newToken = refreshToken(oldToken);
        res.json({ token: newToken, user: req.user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const profileRouter = require('./profileRoutes');

const app = express();
const PORT = 3000;

// --- CONFIGURATION ---
// *** IMPORTANT: In a real app, this key would be loaded securely from environment variables. ***
const JWT_SECRET = 'your_super_secret_key_12345';

// --- MIDDLEWARE ---
app.use(bodyParser.json());

// Authentication Middleware: Checks and validates the Bearer token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Expected format: 'Bearer <TOKEN>'
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Access denied. Token is required.' });
    }

    // Verify the token signature using the secret key
    console.log("Verifying token:", token);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Token is invalid (expired, wrong signature, etc.)
            console.error("JWT Verification Error:", err.message);
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }

        req.user = user;

        next();
    });
};

// --- PUBLIC ROUTES ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'Profile Microservice' });
});

// --- PROTECTED ROUTES ---
// All routes in profileRouter will now use the authenticateToken middleware first.
app.use('/api/v1/profile', authenticateToken, profileRouter);

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Microservice running on port ${PORT}`);
});

// To test JWT generation:
// Function to generate a dummy token for local testing (NOT production code)
function generateTestToken(id) {
    return jwt.sign({ id: id, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
}
console.log("\n--- TESTING TOKEN ---");
console.log("Use this token in your Authorization header:");
console.log(generateTestToken('test-user-456'));
console.log("---------------------\n");
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_12345';

const createToken = (apiKey) => {

    if (!apiKey) {
        throw new Error('API key is required to create a token.');
    }

    return jwt.sign({ apiKey }, JWT_SECRET, { expiresIn: '1h' });
};

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

const refreshToken = (oldToken) => {
    try {
        const decoded = jwt.verify(oldToken, JWT_SECRET, { ignoreExpiration: false });
        const apiKey = decoded.apiKey;

        return jwt.sign({ apiKey }, JWT_SECRET, { expiresIn: '1h' });
    } catch (err) {
        throw new Error('Invalid token. Cannot refresh.');
    }
};

export { authenticateToken, createToken, refreshToken };
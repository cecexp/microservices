const express = require('express');
const router = express.Router();

// Dummy in-memory data store (Simulates a database)
const userProfiles = {};

// --- ROUTES ---

// POST /api/v1/profile (Update/Create Profile)
// This route is already protected by the middleware in index.js
router.post('/', (req, res) => {
    // Get user ID from the VALIDATED token payload
    const userId = req.user.id;
    const { displayName, preferences } = req.body;

    if (!displayName) {
        return res.status(400).json({ message: 'Display name is required.' });
    }

    // Store or update the data associated with the validated user ID
    userProfiles[userId] = {
        userId,
        displayName,
        preferences: preferences || {},
        lastUpdated: new Date().toISOString()
    };

    res.status(200).json({
        message: 'Profile updated successfully.',
        data: userProfiles[userId]
    });
});

// GET /api/v1/profile/:id (Retrieve Profile)
router.get('/:id', (req, res) => {
    const requestedId = req.params.id;

    // Check if the authenticated user is allowed to view this profile (e.g., is it their own?)
    if (requestedId !== req.user.id) {
        // In a real app, you'd check roles (e.g., admin) here.
        return res.status(403).json({ message: "Forbidden: You can only view your own profile." });
    }

    const profile = userProfiles[requestedId];

    if (!profile) {
        return res.status(404).json({ message: "Profile not found." });
    }

    res.status(200).json(profile);
});

module.exports = router;
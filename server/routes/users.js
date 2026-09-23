const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
};

const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email').trim().isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidation, checkValidation, async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = generateToken({ id: user._id, role: user.role });
        res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });
    } catch (err) {
        next(err);
    }
});

router.post('/login', loginValidation, checkValidation, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const token = generateToken({ id: user._id, role: user.role });
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role, profilePhoto: user.profilePhoto } });
    } catch (err) {
        next(err);
    }
});

router.get('/profile', authenticate, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        next(err);
    }
});

router.put('/profile', authenticate, body('name').trim().notEmpty().withMessage('Name is required'), checkValidation, async (req, res, next) => {
    try {
        const updates = { name: req.body.name };
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
        res.json(user);
    } catch (err) {
        next(err);
    }
});

router.put('/profile/photo', authenticate, upload.single('photo'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }
        const photoPath = `/uploads/profiles/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(req.user.id, { profilePhoto: photoPath }, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        next(err);
    }
});

router.get('/', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

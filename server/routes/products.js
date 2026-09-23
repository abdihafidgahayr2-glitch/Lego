const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const productValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be zero or a positive whole number')
];

const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
};

router.get('/', async (req, res, next) => {
    try {
        let query = {};
        if (req.query.category) query.category = req.query.category;
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        let sort = { createdAt: -1 };
        if (req.query.sort) {
            const sortField = req.query.sort.replace('-', '');
            sort = { [sortField]: req.query.sort.startsWith('-') ? -1 : 1 };
        }

        const products = await Product.find(query).sort(sort);
        res.json(products);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
});

router.post('/', authenticate, authorizeAdmin, productValidation, checkValidation, async (req, res, next) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', authenticate, authorizeAdmin, productValidation, checkValidation, async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
});

router.patch('/:id/stock', authenticate, authorizeAdmin, body('stock').isInt({ min: 0 }).withMessage('Stock must be zero or a positive whole number'), checkValidation, async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { stock: req.body.stock }, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

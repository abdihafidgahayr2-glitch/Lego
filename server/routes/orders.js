const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { authenticate, optionalAuthenticate, authorizeAdmin } = require('../middleware/auth');

const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
};

const orderValidation = [
    body('items').isArray({ min: 1 }).withMessage('Cart cannot be empty'),
    body('totalAmount').isFloat({ min: 0.01 }).withMessage('Order total must be greater than zero')
];

router.post('/', optionalAuthenticate, orderValidation, checkValidation, async (req, res, next) => {
    try {
        const orderData = req.body;

        if (req.user) {
            orderData.user = req.user.id;
        } else if (!orderData.guestInfo || !orderData.guestInfo.email) {
            return res.status(400).json({ message: 'Guest name and email are required to check out without an account' });
        }

        const order = new Order(orderData);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
});

router.get('/my-orders', authenticate, async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('items.product').sort('-createdAt');
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

router.put('/:id/return', authenticate, async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.status === 'returned') return res.status(400).json({ message: 'Already returned' });
        order.status = 'returned';
        await order.save();
        res.json(order);
    } catch (err) {
        next(err);
    }
});

router.get('/', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const orders = await Order.find().populate('items.product').sort('-createdAt');
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

router.get('/user/:userId', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).populate('items.product').sort('-createdAt');
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

module.exports = router;

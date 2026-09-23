const fs = require('fs');
const jwt = require('jsonwebtoken');

const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8');

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_PRIVATE_KEY, { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_PRIVATE_KEY, { algorithms: ['HS256'] });
    } catch (err) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
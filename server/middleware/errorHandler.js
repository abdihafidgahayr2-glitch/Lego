const notFoundHandler = (req, res, next) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err.message);

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: messages.join(', ') });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(400).json({ message: `This ${field} is already in use` });
    }

    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Image must be smaller than 5MB' });
        }
        return res.status(400).json({ message: err.message });
    }

    if (err.message && err.message.includes('Only image files are allowed')) {
        return res.status(400).json({ message: err.message });
    }

    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
};

module.exports = { notFoundHandler, errorHandler };

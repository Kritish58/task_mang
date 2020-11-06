const jwt = require('jsonwebtoken');
const User = require('../components/user/User');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const verify = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ success: false, message: 'token is empty' });
        }
        const payload = jwt.verify(token, JWT_SECRET_KEY);
        const user = await User.findById(payload._id).select('_id email');
        if (!user) {
            return res.status(401).json({ success: false, message: 'forbidden request' });
        }
        req.auth_payload = payload;
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ success: false, error: true, message: err.message });
    }
};

module.exports = verify;

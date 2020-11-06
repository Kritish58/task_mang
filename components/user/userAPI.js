const multer = require('multer');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret';

const User = require('./User');

router.post('/register', multer().none(), async (req, res) => {
    const { email, password } = req.body;
    const user = await new User({ email, password });
    await user.save();
    return res.status(201).json({ success: true, message: 'user created' });
});

router.post('/login', multer().none(), async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: 'user not found' });
    }
    const passwordMatches = bcrypt.compareSync(password, user.password);
    if (!passwordMatches) {
        return res.status(401).json({ success: false, message: 'password does not match' });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
    return res.status(200).json({ success: true, token });
});

module.exports = router;

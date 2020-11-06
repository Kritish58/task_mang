const mongoose = require('mongoose');
const isemail = require('isemail');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const User = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: [3, 'email should be at least 3 characters long'],
        maxlength: [50, 'email cannot be longer than 50 characters'],
    },
    password: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: [3, 'password should be at least 3 characters long'],
        maxlength: [20, 'password cannot be longer than 50 characters'],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

User.pre('save', function (next) {
    // console.log(this.email);
    // console.log(this);
    const isValid = isemail.validate(this.email);
    if (!isValid) {
        next(err);
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(this.password, salt);
        this.password = hashedPassword;
        next();
    }
});

module.exports = mongoose.model('users', User);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const Profile = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        minlength: [3, 'username should be at least 3 characters long'],
        maxlength: [30, 'username cannot be longer than 30 characters'],
    },
    picture: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'picture length should be at least 3 characters long'],
        maxlength: [500, 'picture length cannot be longer than 500 characters'],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('profiles', Profile);

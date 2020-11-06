const mongoose = require('mongoose');
const { Schema } = mongoose;

const Task = new Schema({
    title: {
        type: String,
        required: true,
        minlength: [3, 'title must be at least 3 characters long'],
        maxlength: [100, 'title cannot be longer than 100 characters'],
        unique: true,
    },
    body: {
        type: String,
        required: true,
        minlength: [1, 'body must be at least 1 characters long'],
        maxlength: [20000, 'body cannot be longer than 20k characters'],
    },
    slug: {
        type: String,
        required: true,
        minlength: [3, 'slug must be at least 3 characters long'],
        maxlength: [200, 'slug cannot be longer than 200 characters'],
        unique: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('tasks', Task);

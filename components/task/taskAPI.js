const router = require('express').Router();
const multer = require('multer');

const upload = multer();

const Task = require('./Task');
const verify = require('../../middlewares/jwtVerify');

router.post('/create-new', verify, upload.none(), async (req, res) => {
    try {
        const { auth_payload } = req;
        const { title, body, slug } = req.body;
        const task = new Task({
            title,
            body,
            slug,
            user_id: auth_payload._id,
        });
        await task.save();
        return res.status(201).json({ success: true, message: 'task created' });
    } catch (err) {
        return res.status(500).json({ success: false, error: true, message: err.message });
    }
});

router.post('/update-task/:task_id', verify, upload.none(), async (req, res) => {
    try {
        const { auth_payload } = req;
        const { task_id } = req.params;
        const { title, body, slug } = req.body;
        if ((title && !slug) || (!title && slug)) {
            return res.status(400).json({ success: false, message: 'title or slug is not recieved' });
        }
        const task = await Task.findById(task_id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'task not found' });
        }
        if (task.user_id != auth_payload._id) {
            return res.status(401).json({ success: false, message: 'forbidden request' });
        }
        task.title = title ? title : task.title;
        task.body = body ? body : task.body;
        task.slug = slug ? slug : task.slug;
        await task.save();

        return res.status(200).json({ success: true, message: 'task updated' });
    } catch (err) {
        return res.status(500).json({ success: false, error: true, message: err.message });
    }
});

router.get('/read-user-tasks', verify, async (req, res) => {
    try {
        const { auth_payload } = req;
        const { skip, limit } = req.query;

        const tasks = await Task.find({ user_id: auth_payload._id }).skip(skip).limit(limit);
        return res.status(200).json({ success: true, tasks });
    } catch (err) {
        return res.status(500).json({ success: false, error: true, message: err.message });
    }
});

router.delete('/delete-task/:task_id', verify, async (req, res) => {
    try {
        const { auth_payload } = req;
        const { task_id } = req.params;
        const task = await Task.findById(task_id).select('user_id');
        if (task.user_id != auth_payload._id) {
            return res.status(401).json({ success: false, message: 'forbidden request' });
        }
        await Task.deleteOne({ _id: task_id });
        return res.status(200).json({ success: true, message: 'task deleted' });
    } catch (err) {
        return res.status(500).json({ success: false, error: true, message: err.message });
    }
});

module.exports = router;

const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');
const path = require('path');

const User = require('../user/User');
const Profile = require('./Profile');
const verify = require('../../middlewares/jwtVerify');
const upload = require('./fileUpload');
const { profileUploadDir } = require('../../config/fileUploadDir');
const { Error } = require('mongoose');

router.post('/add-new-profile', verify, async (req, res) => {
    upload(req, res, async (err) => {
        try {
            if (err) {
                throw new Error(err);
            }

            const { auth_payload, file } = req;
            const { username } = req.body;
            if (!file) {
                return res.status(400).json({ success: false, message: 'file not supplied' });
            }

            const user = await User.findOne({ _id: auth_payload._id });
            if (!user) {
                return res.status(404).json({ success: false, message: 'user not found' });
            }
            const profile = await Profile.findOne({ user_id: auth_payload._id });
            if (profile) {
                return res.status(200).json({ success: false, message: 'profile already created' });
            }
            const filePath = path.join(profileUploadDir, uuid() + '_' + file.originalname);
            await await sharp(file.path).resize().jpeg({ quality: 50 }).toFile(filePath);
            fs.unlinkSync(file.path);

            const newProfile = new Profile({ username, picture: filePath, user_id: auth_payload._id });
            await newProfile.save();
            return res.status(201).json({ success: true, message: 'profile created' });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, error: true, message: err.message });
        }
    });
});

router.post('/update-profile/:profile_id', verify, async (req, res) => {
    upload(req, res, async (err) => {
        try {
            if (err) {
                return res.status(500).json({ success: false, error: true, code: err.code, message: err.message });
            }

            const { profile_id } = req.params;
            const { username } = req.body;
            const { file } = req;

            const profile = await Profile.findOne({ _id: profile_id });
            if (!profile) {
                return res.status(404).json({ success: false, message: 'profile not found' });
            }
            if (profile.user_id != auth_payload._id) {
                return res.status(401).json({ success: false, message: 'forbidden request' });
            }

            const filePath = path.join(profileUploadDir, uuid() + '_' + file.originalname);
            await sharp(file.path).resize().jpeg({ quality: 50 }).toFile(filePath);
            fs.unlinkSync(file.path);
            fs.unlinkSync(profile.picture);
            profile.picture = filePath;
            profile.username = username ? username : profile.username;
            await profile.save();
            return res.status(200).json({ success: true, message: 'profile updated' });
        } catch (err) {
            return res.status(500).json({ success: false, error: true, code: err.code, message: err.message });
        }
    });
});

router.get('/fetch-profile/:profile_id', verify, async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.profile_id);
        return res.status(200).json({ success: true, profile });
    } catch (err) {
        return res.status(500).json({ success: false, error: true, code: err.code, message: err.message });
    }
});

router.delete('/delete-profile/:profile_id', verify, async (req, res) => {
    try {
        const { auth_payload } = req;
        const { profile_id } = req.params;
        const profile = await Profile.findById(profile_id).select('user_id picture');
        if (!profile) {
            return res.status(404).json({ success: false, message: 'profile not found' });
        }
        if (profile.user_id != auth_payload._id) {
            return res.status(401).json({ success: false, message: 'forbidden request' });
        }
        fs.unlinkSync(profile.picture);
        await Profile.deleteOne({ _id: profile_id });
        return res.status(200).json({ success: true, message: 'profile deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: true, code: err.code, message: err.message });
    }
});

module.exports = router;

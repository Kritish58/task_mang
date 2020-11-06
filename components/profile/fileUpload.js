const multer = require('multer');
const { v4: uuid } = require('uuid');

const { profileUploadDir } = require('../../config/fileUploadDir');

const storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, profileUploadDir);
    },
    filename: (req, file, done) => {
        done(null, uuid() + '_' + file.originalname);
    },
});

const limits = {
    fileSize: 5 * 1024 * 1024,
};

const fileFilter = (req, file, done) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        done(null, true);
    } else {
        done(new Error('file type not supported'), false);
    }
};

const upload = multer({ storage, limits, fileFilter }).single('picture');

module.exports = upload;

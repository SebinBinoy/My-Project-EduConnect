const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadClass, getTeacherClasses, deleteClass } = require('../Controllers/classController');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});


const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: fileFilter
});

// Routes
router.post('/upload-class', upload.single('video'), uploadClass);
router.get('/classes/:teacherId', getTeacherClasses);
router.delete('/class/:type/:id', deleteClass);

module.exports = router;  // Export the router directly
const express = require('express');
const router = express.Router();
const { createTeacherProfile, getTeacherProfile } = require('../Controllers/teacherController');

router.post('/profile', createTeacherProfile);
router.get('/profile/:id', getTeacherProfile);

// Add this new route to your existing router
router.get('/profile/check/:userId', async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ user: req.params.userId });
        
        if (teacher) {
            res.json({
                exists: true,
                teacherId: teacher._id
            });
        } else {
            res.json({
                exists: false,
                teacherId: null
            });
        }
    } catch (error) {
        console.error('Error checking teacher profile:', error);
        res.status(500).json({
            exists: false,
            error: 'Server error checking profile'
        });
    }
});

module.exports = { teacherRouter: router };
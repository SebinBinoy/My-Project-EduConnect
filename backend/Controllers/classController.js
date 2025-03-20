const DemoClass = require('../Models/demoClass');
const ActualClass = require('../Models/actualClass');
const fs = require('fs');

const uploadClass = async (req, res) => {
    try {
        const { classType, subject, topic, description, teacherId, price, duration } = req.body;
        
        // Validate required fields
        if (!classType || !subject || !topic || !teacherId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate class type
        if (!['demo', 'actual'].includes(classType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid class type'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No video file uploaded'
            });
        }

        let savedClass;
        if (classType === 'demo') {
            const demoClass = new DemoClass({
                teacherId,
                subject,
                topic,
                description: description || '',
                videoPath: req.file.path
            });
            savedClass = await demoClass.save();
        } else if (classType === 'actual') {
            if (!price || !duration) {
                // Clean up uploaded file if validation fails
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: 'Price and duration are required for actual classes'
                });
            }

            // Validate price and duration
            if (parseFloat(price) <= 0 || parseInt(duration) <= 0) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: 'Price and duration must be greater than 0'
                });
            }

            const actualClass = new ActualClass({
                teacherId,
                subject,
                topic,
                description: description || '',
                videoPath: req.file.path,
                price: parseFloat(price),
                duration: parseInt(duration)
            });
            savedClass = await actualClass.save();
        }

        res.status(201).json({
            success: true,
            message: `${classType} class uploaded successfully`,
            classId: savedClass._id,
            data: savedClass
        });

    } catch (error) {
        // Clean up uploaded file on error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error uploading class:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading class'
        });
    }
};

// Get classes by teacher ID
const getTeacherClasses = async (req, res) => {
    try {
        const demoClasses = await DemoClass.find({ teacherId: req.params.teacherId })
                                         .sort({ uploadDate: -1 });
        const actualClasses = await ActualClass.find({ teacherId: req.params.teacherId })
                                             .sort({ uploadDate: -1 });

        res.json({
            success: true,
            data: {
                demoClasses,
                actualClasses
            }
        });
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching classes'
        });
    }
};

// Delete class
const deleteClass = async (req, res) => {
    try {
        const { type, id } = req.params;
        const Model = type === 'demo' ? DemoClass : ActualClass;
        
        const deletedClass = await Model.findByIdAndDelete(id);
        if (!deletedClass) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        if (fs.existsSync(deletedClass.videoPath)) {
            fs.unlinkSync(deletedClass.videoPath);
        }

        res.json({
            success: true,
            message: 'Class deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting class'
        });
    }
};

module.exports = {
    uploadClass,
    getTeacherClasses,
    deleteClass
};
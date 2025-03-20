const mongoose = require('mongoose');

const demoClassSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: [true, 'Teacher ID is required']
    },
    subject: {
        type: String,
        enum: {
            values: ['mathematics', 'physics', 'chemistry'],
            message: '{VALUE} is not a supported subject'
        },
        required: [true, 'Subject is required']
    },
    topic: {
        type: String,
        required: [true, 'Topic is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    videoPath: {
        type: String,
        required: [true, 'Video path is required']
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DemoClass', demoClassSchema);
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    currentWork: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    workExperience: [{
        institution: String,
        years: Number
    }],
    subjectExperience: {
        mathematics: Number,
        physics: Number,
        chemistry: Number
    },
    profilePicture: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Teacher', teacherSchema);
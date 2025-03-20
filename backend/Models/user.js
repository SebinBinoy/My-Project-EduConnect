const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userFullName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true // Ensures no duplicate emails
    },
    userPassword: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true,
        enum: ["student", "teacher"] // Restricts values to only "student" or "teacher"
    },
   
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;

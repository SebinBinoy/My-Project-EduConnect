const mongoose = require("mongoose");
const Teacher = require("../Models/teacher");

const createTeacherProfile = async (req, res) => {
    try {
        const { fullName, qualification, currentWork, phone, workExperience, subjectExperience } = req.body;

        // Validate required fields
        if (!fullName || !qualification || !currentWork || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: "Please fill all required fields!" 
            });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit phone number!"
            });
        }

         // Check if teacher profile already exists with same phone
         const existingTeacher = await Teacher.findOne({ phone });
         if (existingTeacher) {
             return res.status(400).json({
                 success: false,
                 message: "A profile with this phone number already exists!"
             });
         }

        // Create new teacher profile
        const teacherProfile = new Teacher({
            fullName,
            qualification,
            currentWork,
            phone,
            workExperience,
            subjectExperience,
            profilePicture: req.body.profilePicture || "",
             
        });

        const savedTeacher = await teacherProfile.save();

        return res.status(201).json({
            success: true,
            message: "Teacher profile created successfully!",
            teacherId: savedTeacher._id,
            data: savedTeacher
        });

    } catch (error) {
        console.error("Error in createTeacherProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
};

const getTeacherProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher profile not found!"
            });
        }

        return res.status(200).json({
            success: true,
            data: teacher
        });

    } catch (error) {
        console.error("Error in getTeacherProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
};

module.exports = { createTeacherProfile, getTeacherProfile };
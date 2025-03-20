const mongoose = require("mongoose");
const userModel = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { userFullName, userEmail, userPassword, userRole, userExperience, userSubject } = req.body;

        if (!userFullName || !userEmail || !userPassword || !userRole) {
            return res.status(400).json({ error: "Please fill all required fields!" });
        }

        const existingUser = await userModel.findOne({ userEmail });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered!" });
        }

        const hashedPassword = await bcrypt.hash(userPassword, 10);

        const newUser = new userModel({
            userFullName,
            userEmail,
            userPassword: hashedPassword,
            userRole,
            
        });

        await newUser.save();

        return res.status(201).json({ message: "User registered successfully!" });

    } catch (err) {
        console.error("Error in registerUser:", err);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};

const loginUser = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    
    console.log("Received Login Request:");
    console.log("Email:", userEmail);
    console.log("Password:", userPassword);

    try {
        const user = await userModel.findOne({ userEmail : userEmail });

        if (!user) {
            console.log("User not found in DB.");
            return res.status(404).json({ message: "User not registered!" });
        }

        if (!user.userPassword) {
            console.log("Error: User record is missing a password.");
            return res.status(500).json({ message: "User record is missing a password." });
        }

        // Compare hashed password
        const loggedIn = await bcrypt.compare(userPassword, user.userPassword);

        if (!loggedIn) {
            console.log("Incorrect password.");
            return res.status(401).json({ message: "Username/Password Incorrect" });
        }

        console.log("Password matched. Generating token...");

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });

        console.log("Login successful.");
        return res.status(200).json({ token, userID: user._id, userRole: user.userRole });

    } catch (error) {
        console.error("Login Error:", error.message);
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
};

module.exports = { registerUser, loginUser };

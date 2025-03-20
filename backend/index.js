const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('Uploads directory created successfully at:', uploadsDir);
    } else {
        console.log('Uploads directory already exists at:', uploadsDir);
    }
    
    fs.accessSync(uploadsDir, fs.constants.W_OK);
    console.log('Uploads directory is writable');
} catch (err) {
    console.error('Error with uploads directory:', err);
    process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(uploadsDir));

// Import routers
const userRouter = require('./Routes/userRouter');
const teacherRouter = require('./Routes/teacherRouter');
const classRouter = require('./Routes/classRouter');

// Use routers
app.use('/api/user', userRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/class', classRouter);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
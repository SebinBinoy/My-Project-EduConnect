const express = require('express');
const { registerUser, loginUser } = require('../Controllers/userController');

const router = express.Router();

router.post('/register-user',registerUser);
router.post('/login-user',loginUser);


module.exports={userRouter:router}
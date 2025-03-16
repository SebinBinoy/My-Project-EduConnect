const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {userRouter} = require('./Routes/userRouter');
 
const dotenv = require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/user',userRouter);


const PORT  = 3000 || process.env.PORT;

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('connected to Mongo DB'))
.catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log("server started at PORT : " + PORT);
  });
  
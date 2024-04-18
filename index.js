const express = require("express");
const connect = require("./config/database")
const fileupload = require("express-fileupload")
require("dotenv").config();

const PORT =  process.env.PORT;
const app = express();

// midlleware
app.use(express.json());
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
})) // used to upload data in our server

// connect to db
connect.connect();

// connect to cloudinary
const cloudinary=require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// api route mount 
const upload = require("./routes/FIleUpload");
app.use('/api/v1/upload',upload);


app.listen(PORT,() => {
    console.log(`Server Started at Port ${PORT}`);
})

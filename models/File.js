const mongoose = require("mongoose")
const nodemailer = require("nodemailer")

require("dotenv").config();

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String
    },
    tags:{
        type:String
    },
    email:{
        type:String
    }
});

// post middlware
fileSchema.post("save",async function(doc){
    try{
        console.log("DOC:",doc);

        // creating transpoter
        // TODO:Shift these to config folder
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
        });

        // send mail
        let info = await transporter.sendMail({
            from:`Rana`,
            to:doc.email,
            subject:"New file Upload on Cloundinary",
            html:`<h2>Hello Jee <p>File Uploaded</p> </h2>
            view here: <a href={doc.imageUrl}>${doc.imageUrl}</a>`
        })

        console.log("INFO:",info);
    }catch(err){
        console.error(err)
    }
})

const File = mongoose.model("File",fileSchema);

module.exports = File
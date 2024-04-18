const File = require("../models/File")
const cloudinary = require("cloudinary").v2

// localfileupload -> handler function
exports.localFileUpload = async(req,res) => {
    try{
        // fetch file from the client side
        const file = req.files.file;
        console.log("FILE:",file);
        // define the path on which we want to store the path 
        let path = __dirname + '/files' + Date.now() + `.${file.name.split('.')[1]}` ;
        console.log("PATH:",path);
        file.mv(path,(err) => {
            console.log(err);
        });
        res.json({
            success:true,
            message:"Local file uploaded successfully"
        })
    } catch(err){
        console.log(err);
    }
}


function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder,quality){
    const options = {folder}

    if(quality){
        options.quality = quality;
    }

    options.resource_type = "auto"
    console.log("TEMP FILE PATH",file.tempFilePath);
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}

// image upload handler
exports.imageUpload = async(req,res) => {
    try{
        const {name,tags,email} = req.body
        console.log(name,tags,email);
        const file = req.files.imageFile
        console.log(file);
        
        // validation
        const supportedTypes = ["jpg","jpeg","png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("FILE TYPE:",fileType);
        // if file type supported then upload it into the cloudinary
        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File format not Supported"
            })
        }

        // file format supported
        console.log("Upload to cloudinary");
        const response = await uploadFileToCloudinary(file,"CloudinaryPractice");
        console.log(response);
        // save entry into the Database
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url
        })

        res.json({
            success:true,
            image:response.secure_url,
            message:"Image Uploaded Successfully"
        })

    }catch(err){
        console.error(err);
        res.status(500).json({
            success:true,
            message:"Something went Wrong"
        })
    }
}

// video upload handler
exports.videoUpload = async (req,res) => {
    try{
        // fetch data 
        const {name,tags,email} = req.body
        console.log(name,tags,email );
        const file = req.files.videoFile;

        // validation
        const supportedFile = ["mp4","mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:",fileType);

        // todo:add a upper limit of 5MB only
        if(!isFileTypeSupported(fileType,supportedFile)){
            return res.status(400).json({
                success:false,
                message:"File Format Not Supported"
            })
        }

        // supported file format
        console.log("Upload to Cloudinary")
        const response = await uploadFileToCloudinary(file,"CloudinaryPractice")
        console.log(response);

        // create entry into the DB
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url, 
        })

        res.json({
            success:true,
            videoUrl:response.secure_url,
            message:"Video Uploaded Successfully",
        })

    }catch(err){
        console.error(err)
        res.status(500).json({
            success:false,
            message:"Something Went Wrong"
        })
    }
}


// image size reducer handler

exports.imageSizeReducer = async (req,res) => {
   try{
     // fetch data from the body
     const {name,tags,email} = req.body
     console.log(name,tags,email);
     const file = req.files.imageSizeReducer
 
     // validation
     const supportedTypes = ["jpeg","jpg","png"];
     const fileType = file.name.split('.')[1].toLowerCase();
     console.log("FILE TYPE",fileType);
 
     if(!isFileTypeSupported(fileType,supportedTypes)){
         return res.status(400).json({
             success:false,
             message:"File Type Not Supported"
         })
     }
 
     // upload to cloudinary 
     console.log("Upload to cloudinary");
     const response = await uploadFileToCloudinary(file,"CloudinaryPractice",30)
     console.log(response);
 
     // create entry into the DB
     const fileData = await File.create({
         name,
         tags,
         email,
         imageUrl:response.secure_url,
     });
 
     res.json({
         success:true,
         imageUrl:response.secure_url,
         message:"Image Reduced and Upload Successfully"
     })
   }catch(err){
    console.error(err)
        res.status(500).json({
            success:false,
            message:"Something Went Wrong"
        })
   }
}




// TODO : put limit data upload on video , reduce size of image by croping, pre and post middleware
// Forezan stmp article , AWS sqs,sns
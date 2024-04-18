const mongoose = require("mongoose")
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(console.log("DB Connected Successfull"))
    .catch((err) => {
        console.log("DB Connection Issue")
        console.error(err);
        process.exit(1)
    })
}
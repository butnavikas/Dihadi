const mongoose = require("mongoose");
//  this is for connection with mongodb
const connectDB = async()=>{
    await mongoose.connect(process.env.CONNECTION_STRING)
    .then(()=>console.log("mongodb connected..."));
}
module.exports = connectDB;
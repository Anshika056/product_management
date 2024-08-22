const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userModel = require("../models/user.model");
dotenv.config();
const { hashValue } = require("../helpers/hash.helper");

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}


const connectDB = async () => {
    try {
      await mongoose.connect(mongoUri, {}).then(async()=>{
        let existingAdmin = await userModel.findOne({role:"admin"});
        if (existingAdmin) {
          return
        }
        const hashedPassword = await hashValue(process.env.ADMIN_PASSWORD);
        const newUser = new userModel({
          username:process.env.ADMIN_USERNAME,
          email:process.env.ADMIN_EMAIL,
          password: hashedPassword,
          role:"admin",
        });
    
        await newUser.save();
    
      });
      console.log('MongoDB connected');
    } catch (err) {
      console.error(err);
      process.exit(1); // Exit process with failure
    }
  };
  
  module.exports = connectDB;  
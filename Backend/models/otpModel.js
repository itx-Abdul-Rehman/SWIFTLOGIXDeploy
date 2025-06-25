import mongoose from "mongoose";

const OTPSchema=new mongoose.Schema({
    userId:{type:String,required:true},
    otp:{type:String,required:true},
    createdAt:{type:Date,required:true},
    expireAt:{type:Date,required:true}
});

export const UserOTP=mongoose.model('UserOTP',OTPSchema);
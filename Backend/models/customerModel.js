import mongoose from "mongoose";

const CustomerSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    mobileno:{type:String,required:true},
    password:{type:String,required:true},
    verified:{type:Boolean,required:true},
    cnic:{type:String,required:false},
    address:{type:String,required:false}
});

export const Customer=mongoose.model('Customer',CustomerSchema);

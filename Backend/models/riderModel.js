import mongoose from "mongoose";

const RiderSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    cnic:{type:String,required:true},
    mobileno:{type:String,required:true},
    password:{type:String,required:true},
    city:{type:String,required:true},
    address:{type:String,required:true},
    dateofbirth:{type:String,required:true},
    picture:{type:String,required:true},
    vehicleType:{type:String,required:true},
    vehicleMake:{type:String,required:true},
    vehicleModel:{type:String,required:true},
    vehicleNumberPlate:{type:String,required:true},
    drivingLicenseFront:{type:String,required:true},
    drivingLicenseBack:{type:String,required:true},
    vehicleCardFront:{type:String,required:true},
    vehicleCardBack:{type:String,required:true},
    cnicFront:{type:String,required:true},
    cnicBack:{type:String,required:true},
    verified:{type:Boolean,required:true},
    active:{type:String,required:true},
    datetime:{type:String,required:true},
    stars:{type:Number,required:true}
});

export const Rider=mongoose.model('Riders',RiderSchema);
import mongoose from "mongoose";

const RiderWalletSchema=new mongoose.Schema({
    riderid:{type:String,required:true},
    points:{type:String,required:true}
});

export const RiderWallet=mongoose.model('RiderWallet',RiderWalletSchema);
import mongoose from "mongoose";

const CustomerWalletSchema=new mongoose.Schema({
    customerid:{type:String,required:true},
    points:{type:String,required:true}
});

export const Wallet=mongoose.model('CustomerWallet',CustomerWalletSchema);
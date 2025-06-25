import mongoose from "mongoose";

const RiderWalletTransactionsSchema=new mongoose.Schema({
    riderid:{type:String,required:true},
    transactionAmount:{type:String,required:true},
    transactionType:{type:String,required:true},
    datetime:{type:String,required:true},
    paid:{type:Boolean,required:false}
});

export const RiderWalletTransactions=mongoose.model(
    'RiderWalletTransactions',
    RiderWalletTransactionsSchema
);
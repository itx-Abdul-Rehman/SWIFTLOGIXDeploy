import mongoose from "mongoose";

const CustomerWalletTransactionsSchema=new mongoose.Schema({
    customerid:{type:String,required:true},
    transactionAmount:{type:String,required:true},
    transactionType:{type:String,required:true},
    datetime:{type:String,required:true}
});

export const CustomerWalletTransactions=mongoose.model(
    'CustomerWalletTransactions',
    CustomerWalletTransactionsSchema
);
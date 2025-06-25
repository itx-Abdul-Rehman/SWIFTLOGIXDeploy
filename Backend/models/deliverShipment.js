import mongoose, { model } from "mongoose";

const DeliverShipmentSchema=new mongoose.Schema({
    trackingid:{type:String,required:true},
    riderid:{type:String,required:true},
    shipmentid:{type:String,required:true},
    originCity:{type:String,required:true},
    destinationCity:{type:String,required:true},
    weight:{type:String,required:true},
    pieces:{type:String,required:true},
    deliveryDate:{type:String,required:true},
    price:{type:String,required:true},
    deliveryStatus:{type:String,required:true},
    createdAt:{type:Date,required:true}
})

export const DeliverShipment=mongoose.model('DeliverShipment',DeliverShipmentSchema);
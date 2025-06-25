import mongoose from "mongoose";

const RouteSchema=new mongoose.Schema({
    trackingid:{type: String, required: true, unique: true},
    coordinates:{type:[Number],required:true},
    datetime:{type:String,required:true}
});

export const Route=mongoose.model('Route',RouteSchema);
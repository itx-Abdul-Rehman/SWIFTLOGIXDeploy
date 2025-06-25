import mongoose from 'mongoose'

const EmployeeSchema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    city:{type:String,required:true},
});

export const Employee=mongoose.model('Employees',EmployeeSchema);
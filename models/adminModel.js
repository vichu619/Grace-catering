const mongoose=require("mongoose")

const adminSchema=mongoose.Schema({
     name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:false
    },
    mobileNum:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:false
    },
    adminEmail:{
        type:String,
        required:false
    },
    adminPassword:{
        type:String,
        required:false
    },
    status:{
        type:Boolean,
        default:true
    }

})

module.exports=mongoose.model('Admin',adminSchema)
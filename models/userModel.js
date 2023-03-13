const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobileNum:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
})

module.exports=mongoose.model('User',userSchema)
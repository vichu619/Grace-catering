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
    }

})

module.exports=mongoose.model('Admin',adminSchema)
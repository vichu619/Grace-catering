const { ObjectId } = require("mongodb")
const mongoose=require("mongoose")

const productSchema=mongoose.Schema({
    SKU:{
        type:String,
        required:true
    },
    productName:{
        type:String,
        required:true
    },
    category:{
        type:ObjectId,
        required:true,
        ref:"Category"
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

})

module.exports=mongoose.model('Product',productSchema)
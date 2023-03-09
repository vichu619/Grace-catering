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
    MRP:{
        type:Number,
        required:true

    },
    salePrice:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:ObjectId,
        required:true,
        ref:"Category"
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:Array
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

})

module.exports=mongoose.model('Product',productSchema)
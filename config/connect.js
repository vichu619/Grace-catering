require("dotenv").config();
const mongoose=require("mongoose");
mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGODB_CONNECTION )
.then(()=>{
console.log("DB connected");
})
.catch((err)=>console.log(err))

module.exports={mongoose};
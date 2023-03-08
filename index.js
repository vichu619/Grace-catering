const mongoose=require('./config/connect')
const express=require("express");
const app=express();
const session=require('express-session')


require("dotenv").config();
app.use(session({secret:process.env.SECRET_KEY}))
app.use(
    session({
      secret: "sessionkey",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 6000000 },
    })
  );


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

const adminRoute=require('./routes/adminRoute');
app.use('/admin',adminRoute)

const userRoute=require('./routes/userRoute');
app.use('/',userRoute);

app.use(express.static('public'))

app.listen(3003,()=>{
    console.log("Server is Running...")
})
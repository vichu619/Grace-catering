const express = require("express");
const user_route=express();
const userController=require("../controllers/userController")

user_route.set('views', './views/user')

const auth = require('../middleware/userAuth')

//User Login
user_route.get('/home',userController.loadHome)
user_route.get('/',userController.loadHome)
user_route.get('/login',auth.isLogout,userController.loadLogin);
user_route.get('/logout',userController.logOut);
user_route.post('/login',userController.verifyLogin);

//User Register
user_route.get('/register',auth.isLogout,userController.loadRegister);
user_route.post('/register',userController.insertUser);

//User Products
user_route.get('/shop',userController.loadCatalog)
user_route.get('/product',userController.loadProduct)

//User Carts
user_route.get('/cart',userController.loadCart)
user_route.post('/changeQuantity',userController.changeQuantity)
user_route.get('/addCart',userController.insertCart)
user_route.get('/deleteCart',userController.deleteCart)



user_route.get('/wishlist',userController.loadWishlist)



module.exports=user_route;

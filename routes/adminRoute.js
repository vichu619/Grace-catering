const express = require("express");
const admin_route=express();
const adminController=require("../controllers/adminController")
const session=require('express-session')
const multerConfig=require('../config/multer')
const upload=multerConfig.upload;



admin_route.set('views', './views/admin')

// Login 
admin_route.get('/login',adminController.loadLogin)
admin_route.get('/logout',adminController.logOut)
admin_route.post('/login',adminController.verifyLogin)

//Register
admin_route.get('/register',adminController.loadRegister)
admin_route.post('/register',adminController.insertAdmin)


//Dashboard
admin_route.get('/home',adminController.loadDashoard)


//User Details
admin_route.get('/users',adminController.loadUserDetails)
admin_route.get('/updateStatus',adminController.updateUserStatus)
admin_route.get('/deleteUser',adminController.deleteUser)

//Category Details
admin_route.get('/categories',adminController.loadCategories);
admin_route.get('/addCategory',adminController.loadAddCategory);
admin_route.get('/editCategory',adminController.loadEditCategory);
admin_route.get('/deleteCategory',adminController.deleteCategory);
admin_route.post('/editCategory',adminController.editCategory);
admin_route.post('/addCategory',adminController.addCategory);


//Product Details
admin_route.get('/products',adminController.loadProducts);
admin_route.get('/addProduct',adminController.loadAddProduct);
admin_route.get('/editProduct',adminController.loadEditProduct);
admin_route.post('/addProduct',upload.array('image',3),adminController.addProduct);
admin_route.post('/editProduct',upload.array('image',3),adminController.updateProduct);
admin_route.get('/deleteProduct',adminController.deleteProduct)


//Order


//Common Route
admin_route.get('*',(req,res)=>{res.redirect('/admin/login')});


module.exports=admin_route;
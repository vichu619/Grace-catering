const User = require('../models/userModel')
const bcrypt = require("bcrypt")
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const Cart = require('../models/cartModel')
require("dotenv").config();
const mongoose=require("mongoose");


const loadLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}
const loadRegister = async (req, res) => {
    try {
        res.render('register')
    } catch (error) {
        console.log(error.message);
    }
}
const loadHome = async (req, res) => {
    try {
        if (req.session.userId) {
            const userData = await User.findOne({ _id: req.session.userId })
            res.render('home', { userData })
        } else {
            res.render('home')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const logOut = async (req, res) => {
    try {
        res.redirect('/login')
    } catch (error) {
        console.log(error.message);
    }
}


// Register/Insert User
const insertUser = async (req, res) => {
    try {
        const { name, email, password, repassword } = req.body;
        if (name.trim() == "" || email.trim() == "" || password.trim() == "" || repassword.trim() == "") {
            res.render('register', { errMsg: "Input is empty or contains only white space" })
        } else {
            const emailData = await User.findOne({ email: email })
            if (emailData) {
                res.render('register', { errMsg: "Email is already Registered" })
            } else {
                const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;;
                if (password.match(regex)) {
                    if (password != repassword) {
                        res.render('register', { errMsg: "Confirm password is not same" })
                    } else {
                        const sPassword = await bcrypt.hash(password, 10)
                        const user = new User({
                            name: name,
                            email: email,
                            password: sPassword
                        })
                        const userData = await user.save()
                        if (userData) {
                            res.redirect('/home')
                        } else {
                            res.render('register', { errMsg: "Something went wrong" })
                        }
                    }
                } else {
                    res.render('register', { errMsg: "Password must contain atleast 8 alphanumeric character" })
                }
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}


const verifyLogin = async (req, res) => {
    try {
        const { emailMobile, password } = req.body;
        const userData = await User.findOne({ $or: [{ email: emailMobile }, { mobile: emailMobile }] })
            if(userData){
                if (userData.status == true) {
                    const passwordMatch = await bcrypt.compare(password, userData.password);
                    if (passwordMatch) {
                        req.session.userId = userData._id;
                        res.redirect('/home');
                    } else {
                        res.render('login', { errMsg: "Password is Incorrect" })
                    }
                } else {
                    res.render('login', { errMsg: "Your Account is blocked by Admin" })
                }
        } else {
            res.render('login', { errMsg: "Email Or Phone Number is not Registered" })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadCatalog = async (req, res) => {
    try {
        const productData = await Product.find({ isDeleted: false })
        res.render('shopCategory', { productData })
    } catch (error) {
        console.log(error.message);
    }
}
const loadProduct = async (req, res) => {
    try {
        const productData = await Product.findOne({ _id: req.query.id }).populate('category')
        const offerPercentage = ((productData.MRP - productData.salePrice) / productData.MRP) * 100;
        res.render('singleProduct', { product: productData, offerPercentage })
    } catch (error) {
        console.log(error.message);
    }
}

const loadWishlist = async (req, res) => {
    try {
        if (req.session.userId) {
            res.render('cart')
        } else {
            res.render('loginRequest');
        }
    } catch (error) {
        console.log(error.message);
    }
}
const loadCart = async (req, res) => {
    try {
        console.log("in cart");
        if (req.session.userId) {
            console.log("inside cart if");
            const userData = await User.findOne({ _id: req.session.userId })
            const userCart = await Cart.findOne({ userId: userData._id }).populate('products.productId')
            console.log(userData);
            console.log(userCart);
            if (userCart) {
                console.log("inside usercart if");
                const productsArray = userCart.products;
                const products = productsArray.map((product) => ({
                    id: product._id,
                    productId: product.productId._id,
                    productName: product.productId.productName,
                    salePrice: product.productId.salePrice,
                    quantity: product.quantity,
                    image: product.productId.image,
                    totalPrice: product.productId.salePrice * product.quantity
                }))
                if (userCart.products.length == 0) {
                    res.render('emptyCart')
                } else {
                    res.render('cart', { products, userCart })
                }
            }

        } else {
            res.render('loginRequest');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const insertCart = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.session.userId })
        const userId = await Cart.findOne({ userId: userData._id })
        let productData = {
            productId: req.query.id,
            quantity: 1
        }
        if (userId) {
            const productExist = userId.products.findIndex(product => product.productId == req.query.id)
            if (productExist != -1) {
                await Cart.updateOne({ userId: userData._id, 'products.productId': req.query.id }, {
                    $inc: { 'products.$.quantity': 1 }
                })
                res.redirect('/cart')
            } else {
                await Cart.updateOne({ userId: userData._id }, { $push: { products: productData } })
                res.redirect('/cart')
            }
        } else {
            const cart = new Cart({
                userId: userData._id,
                products: productData
            })
            await cart.save()
            res.redirect('/cart')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const changeQuantity = async (req, res) => {
    try {
        const { userData, productId, quantity, id } = req.body;
        const cartData = await Cart.findOneAndUpdate({ userId: userData, 'products.productId': productId }, {
        })
        const product = cartData.products.find(item => item.productId == productId)
        const afterQuantity = product.quantity + Number(quantity);
        if (afterQuantity != 0) {
            if (quantity == 1) {
                await Cart.findOneAndUpdate({ userId: userData, 'products.productId': productId }, {
                    $inc: { 'products.$.quantity': quantity }
                })
                res.json({ success: true })
            } else {
                await Cart.findOneAndUpdate({ userId: userData, 'products.productId': productId }, {
                    $inc: { 'products.$.quantity': quantity }
                })
                res.json({ success: false })
            }
        } else {
            const productDelete = await Cart.updateOne(
                { userId: req.session.loggedId },
                { $pull: { products: { productId: productId } } }
            )
            res.redirect('/cart')
        }
        console.log(cartData);
    } catch (error) {
        console.log(error.message);
    }
}
const deleteCart = async (req, res) => {
    try {
        const id = req.query.id;
        await Cart.updateOne(
            { userId: req.session.userId },
            { $pull: { products: { productId: id } } }
        )
        res.redirect('/cart')
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    loadLogin,
    loadRegister,
    insertUser,
    verifyLogin,
    loadHome,
    loadCatalog,
    loadProduct,
    logOut,
    loadWishlist,
    loadCart,
    insertCart,
    changeQuantity,
    deleteCart
}


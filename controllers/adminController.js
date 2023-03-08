const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const bcrypt = require("bcrypt")
const { findByIdAndUpdate } = require('../models/userModel')




// Load loginPage
const loadLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}

// Verify adminLogin
const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminData = await Admin.findOne({ email: email })
        if (adminData) {
            const passwordMatch = await bcrypt.compare(password, adminData.password);
            if (passwordMatch) {
                res.redirect('/admin')
            } else {
                res.render('login', { errMsg: "Email Or Password Is incorrect" })
            }
        } else {
            res.render('login', { errMsg: "Email Or Password Is incorrect" })
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Load adminDashboard
const loadDashoard = async (req, res) => {
    try {
        res.render('dashboard')
    } catch (error) {
        console.log(error.message)
    }
}

//userDetails and its operations
const loadUserDetails = async (req, res) => {
    try {
        const userData = await User.find({})
        if (userData) {
            res.render('userDetails', { userData })
        } else {
            res.render('userDetails')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const logOut = async (req, res) => {
    try {
        res.redirect('/admin/login')
    } catch (error) {
        console.log(error.message)
    }
}
const deleteUser = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.query.id });
        res.redirect('/admin/users')
    } catch (error) {
        console.log(error.message)
    }
}
const updateUserStatus = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.query.id });
        if (userData.status == true) {
            await User.findOneAndUpdate({ _id: req.query.id }, { $set: { status: false } });
        } else {
            await User.findOneAndUpdate({ _id: req.query.id }, { $set: { status: true } });
        }
        res.redirect('/admin/users')
    } catch (error) {
        console.log(error.message)
    }
}

//categories
const loadCategories = async (req, res) => {
    try {
        const categoryData = await Category.find({})
        res.render('categories', { categoryData })
    } catch (error) {
        console.log(error.message)
    }
}
const loadAddCategory = async (req, res) => {
    try {

        res.render('addCategory')
    } catch (error) {
        console.log(error.message)
    }
}
const loadEditCategory = async (req, res) => {
    try {
        const categoryData = await Category.findOne({ _id: req.query.id })
        res.render('editCategory', { category: categoryData })
    } catch (error) {
        console.log(error.message)
    }
}
const deleteCategory = async (req, res) => {
    try {
        await Category.deleteOne({ _id: req.query.id })
        res.redirect('/admin/categories');
    } catch (error) {
        console.log(error.message)
    }
}
const addCategory = async (req, res) => {
    try {
        const categoryName = req.body.categoryName;
        const categoryInc = await Category.findOne({ categoryName: categoryName })
        if (categoryInc) {
            res.render("addCategory", { errMsg: "Category is Already exist" })
        } else {
            if (!categoryName.trim() == "") {
                const category = new Category({
                    categoryName: categoryName
                })
                const categoryData = category.save();
                if (categoryData) {
                    res.redirect('/admin/Categories')
                } else {
                    res.render("addCategory", { errMsg: "Something went wrong" })
                }
            } else {
                res.render("addCategory", { errMsg: "Input is empty or contains only white space" })
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}
const editCategory = async (req, res) => {
    try {
        
        const { id, categoryName } = req.body;
        const categoryInc = await Category.findOne({ categoryName: categoryName })
        console.log(categoryInc);
        const categoryData = await Category.findOne({ _id: id })
        if (categoryInc) {
            res.render("editCategory", { errMsg: "Category is Already exist", category: categoryData })
        } else {
            if (!categoryName.trim() == "") {
                await Category.findByIdAndUpdate({ _id: id }, { $set: { categoryName: categoryName } })
                res.redirect('/admin/categories')
            } else {
                res.render("addCategory", { errMsg: "Input is empty or contains only white space", category: categoryData })
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}


// ------- Products -------
const loadProducts = async (req, res) => {
    try {
        const productData = await Product.find({isDeleted:false}).populate('category');
        res.render('productDetails', { productData });
    } catch (error) {
        console.log(error.message)
    }
}
const loadAddProduct = async (req, res) => {
    try {
        async function generateUniqueSKU() {
            let sku = '';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let isUnique = false;
            sku = letters.charAt(Math.floor(Math.random() * letters.length)).toUpperCase();
            while (!isUnique) {
                for (let i = 0; i < 7; i++) {
                    sku += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                const existingProduct = await Product.findOne({ SKU: sku });
                if (!existingProduct) {
                    isUnique = true;
                }
            }
            return sku;
        }
        const uniqueSKU = await generateUniqueSKU();
        const categoryData = await Category.find({})
        res.render('addProduct', { SKU: uniqueSKU, categoryData })
        console.log("product added");
    } catch (error) {
        console.log(error.message);
    }
}
const addProduct = async (req, res) => {
    try {
        let { SKU, productName, MRP, salePrice, category, stock, description } = req.body
        if (!productName.trim() || !MRP.trim() || !salePrice.trim() || !stock.trim() || !description.trim()) {
            const categoryData = await Category.find({})
            res.render('addProduct', { categoryData, SKU, errMsg: "Input is empty or contains only white space" })
        } else {
            console.log(req.files);
            const imageUpload = [];
            for (let i = 0; i < req.files.length; i++) {
                imageUpload[i] = req.files[i].filename;
            }
            const products = new Product({
                SKU: SKU,
                productName: productName,
                MRP: MRP,
                salePrice: salePrice,
                stock: stock,
                category: category,
                description: description,
                image: imageUpload
            })
            const productData = await products.save();
            if (productData) {
                res.redirect('/admin/products')
            } else {
                const categoryData = await Category.find({})
                res.render('addProduct', { categoryData, SKU, errMsg: "Something went wrong. Please Retry Again" })
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}
const loadEditProduct = async (req, res) => {
    try {
        req.session.productId=req.query.id;
        const categoryData = await Category.find({})
        const productData = await Product.findOne({ _id: req.query.id }).populate('category')
        res.render('editProduct', { productData, categoryData })
    } catch (error) {
        console.log(error.message);
    }
}
const updateProduct = async (req, res) => {
    try {
        let { id, SKU, productName, MRP, salePrice, category, stock, description } = req.body;
        const productData = await Product.findOne({ _id: id }).populate('category')
        const categoryData = await Category.find({})
        
        if (!productName.trim() || !MRP.trim() || !salePrice.trim() || !stock.trim() || !description.trim()) {
            res.render("editProduct", {categoryData, errMsg: "Input is empty or contains only white space", productData })
        } else {
            for (let i = 0; i < req.files.length; i++) {
                const imageUpload = req.files[i].filename;
                await Product.updateOne({_id:req.body.id},{$push:{image: imageUpload}})
            }
            await Product.findByIdAndUpdate({ _id: id }, {
                $set: {
                    SKU: SKU,
                    productName: productName,
                    MRP: MRP,
                    salePrice: salePrice,
                    stock: stock,
                    category: category,
                    description: description
                }
            })
            res.redirect('/admin/products');
        }

    } catch (error) {
        console.log(error.message)
    }
}
const imageDelete = async (req, res) => {
    try {
        const img=req.query.img;
        const imageData= await Product.updateOne({$pull:{image : { $in:[img]}}})
        if(imageData){
            res.redirect('/admin/editProduct?id='+req.session.productId);
        }
    } catch (error) {
        console.log(error.message);
    }
}
const deleteProduct = async (req, res) => {
    try {
        await Product.updateOne({_id:req.query.id},{isDeleted:true})
        res.redirect('/admin/products')
    } catch (error) {
        console.log(error.message);
    }
}





module.exports = {
    loadLogin,
    verifyLogin,
    loadDashoard,
    loadUserDetails,
    logOut,
    deleteUser,
    updateUserStatus,
    loadCategories,
    loadAddCategory,
    addCategory,
    loadEditCategory,
    deleteCategory,
    editCategory,
    loadProducts,
    loadAddProduct,
    addProduct,
    loadEditProduct,
    updateProduct,
    imageDelete,
    deleteProduct,
}
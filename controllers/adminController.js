const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const bcrypt = require("bcrypt")
const { findByIdAndUpdate } = require('../models/userModel')
const { objectid, ObjectId } = require("mongoose");





// Load loginPage
const loadLogin = (req, res) => {
    try {
        if (req.session.adminlogged) {
            req.session.adminlogerror = false;
            res.render("dashboard");
        } else {
            req.session.adminlogin = true;
            console.log("Admin login page reached");
            res.render("login", { message: req.session.adminlogerror });
        }
        //res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}

const adminemail = "admin@gmail.com";
const adminpassword = 12345;

// Verify adminLogin
const verifyLogin = (req, res) => {
    try {
        // const { email, password } = req.body;
        // const adminData = await Admin.findOne({ email: email })  console.log(req.body);
        let email = req.body.email;
        let password = req.body.password;
        let data = {
            email: email,
            password: password,
        };
        if ((adminemail == data.email && adminpassword == data.password) ||
            req.session.adminlogged) {
            //const passwordMatch = await bcrypt.compare(password, adminData.password);
            // if (passwordMatch) {
            //     res.redirect('/admin')
            // } else {
            //     res.render('login', { errMsg: "Email Or Password Is incorrect" })
            // }
            console.log("admin home reached");
            req.session.adminlogged = true;
            req.session.adminlogerror = false;
            res.redirect("/admin");
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
        if (req.session.adminlogged) {
            res.render('dashboard')
        } else {
            res.render('login')
        }
    } catch (error) {
        console.log(error.message)
    }
}

//userDetails and its operations
const loadUserDetails = async (req, res) => {
    try {
        if (req.session.adminlogged) {
            const userData = await User.find({})
            if (userData) {
                res.render('userDetails', { userData })
            } else {
                res.render('userDetails')
            }
        } else {
            res.render('login')
        }
        const userData = await User.find({})
    } catch (error) {
        console.log(error.message);
    }
}
const logOut = async (req, res) => {
    try {
        req.session.adminlogged = false;
        res.redirect('/admin/login')
    } catch (error) {
        console.log(error.message)
    }
}
const deleteUser = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.query.id });
        if (req.session.adminlogged) {
            res.redirect('/admin/users')
        }
        else {
            res.render('login')
        }
    } catch (error) {
        console.log(error.message)
    }
}
const updateUserStatus = async (req, res) => {
    try {
        if (req.session.adminlogged) {
            const userData = await User.findOne({ _id: req.query.id });
            if (userData.status == true) {
                await User.findOneAndUpdate({ _id: req.query.id }, { $set: { status: false } });
            } else {
                await User.findOneAndUpdate({ _id: req.query.id }, { $set: { status: true } });
            }
            res.redirect('/admin/users')
        } else {
            res.render('login')
        }
    } catch (error) {
        console.log(error.message)
    }
}

//categories
const loadCategories = async (req, res) => {
    try {
        if (req.session.adminlogged) {
            const categoryData = await Category.find({})
            res.render('categories', { categoryData })
        } else {
            res.render('login')
        }
    }
    catch (error) {
        console.log(error.message)
    }
}
const loadAddCategory = async (req, res) => {
    try {
        if (req.session.adminlogged) {
            res.render('addCategory')
        } else {
            res.render('login')
        }
    } catch (error) {
        console.log(error.message)
    }
}
const loadEditCategory = async (req, res) => {
    try {
        if (req.session.adminlogged) {
            const categoryData = await Category.findOne({ _id: req.query.id })
            res.render('editCategory', { category: categoryData })
        } else {
            res.render('login')
        }
    }
    catch (error) {
        console.log(error.message)
    }
}
const deleteCategory = async (req, res) => {
    try {
        if (req.session.adminlogged) {
            await Category.deleteOne({ _id: req.query.id })
            res.redirect('/admin/categories');
        } else {
            res.render('login')
        }
    } catch (error) {
        console.log(error.message)
    }
}
const addCategory = async (req, res) => {
    try {
        if (req.session.adminlogged) {
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
        } else {
            res.render('login')
        }
    } catch (error) {
        console.log(error.message)
    }
}
const editCategory = async (req, res) => {
    try {
        if (req.session.adminlogged) {

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
        } else {
            res.render("login")
        }
    } catch (error) {
        console.log(error.message)
    }
}


// ------- Products -------
const loadProducts = async (req, res) => {
    try {
        if (req.session.adminlogged) {

            const productData = await Product.find({ isDeleted: false }).populate('category');
            res.render('productDetails', { productData });
        } else {
            res.render('login')
        }
    }
    catch (error) {
        console.log(error.message)
    }
}
const loadAddProduct = async (req, res) => {
    try {
        if (req.session.adminlogged) {

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
        } else {
            res.render('login')
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
const addProduct = async (req, res) => {
    try {
        if (req.session.adminlogged) {
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
        } else {
            res.render('login')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const loadEditProduct = async (req, res) => {
    try {
        if (req.session.adminlogged) {
            req.session.productId = req.query.id;
            const categoryData = await Category.find({})
            const productData = await Product.findOne({ _id: req.query.id }).populate('category')
            res.render('editProduct', { productData, categoryData })
        } else {
            res.render('login')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const updateProduct = async (req, res) => {
    try {
        if (req.session.adminlogged) {

            let { id, SKU, productName, MRP, salePrice, category, stock, description } = req.body;
            const productData = await Product.findOne({ _id: id }).populate('category')
            const categoryData = await Category.find({})

            if (!productName.trim() || !MRP.trim() || !salePrice.trim() || !stock.trim() || !description.trim()) {
                res.render("editProduct", { categoryData, errMsg: "Input is empty or contains only white space", productData })
            } else {
                for (let i = 0; i < req.files.length; i++) {
                    const imageUpload = req.files[i].filename;
                    await Product.updateOne({ _id: req.body.id }, { $push: { image: imageUpload } })
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

        } else {
            res.render('login')
        }
    } catch (error) {
        console.log(error.message)
    }
}
const imageDelete = async (req, res) => {
    try {
        if (req.session.adminlogged) {
            const img = req.query.img;
            const imageData = await Product.updateOne({ $pull: { image: { $in: [img] } } })
            if (imageData) {
                res.redirect('/admin/editProduct?id=' + req.session.productId);
            }
        } else {
            res.render('login')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const deleteProduct = async (req, res) => {
    try {
        if (req.session.adminlogged) {
            await Product.updateOne({ _id: req.query.id }, { isDeleted: true })
            res.redirect('/admin/products')
        } else {
            res.render('login')
        }
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
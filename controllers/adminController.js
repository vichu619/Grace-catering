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

//Verify adminLogin
const verifyLogin = async (req, res) => {
    try {
        console.log("in login");
        const { adminEmail, adminPassword } = req.body
        //console.log(req.body);
        let email = req.body.email;
        let password = req.body.password;
        // let data = {
        //     adminemail: email,
        //     adminpassword: password,
        // };
        const adminData = Admin.findOne({ adminEmail: email })
        console.log("checking email in server");
        if (adminemail==email) {
            console.log("in email set in db");
            //const passwordMatch = await bcrypt.compare(password, data.password);
            console.log("checking password");
            if (password ==adminpassword) {
                console.log("password matched");
                req.session.adminlogged = true;
                req.session.adminlogerror = false;
                console.log("Main admin home reached");
                console.log("adminlogged set to true")
                res.render('dashboard')   
                
            } else {
                console.log("password match failed");
                res.render('login', { errMsg: "Email Or Password Is incorrect" })
            }
        }
        else if (adminData) {
            console.log("inside admin data to compare password");
            //const passwordMatch =await bcrypt.compare(req.body.password, adminPassword)

            console.log("comparing bcrpt password to login");
            if (password===adminPassword) {
                console.log("task success and logined into admin panel");
                req.session.adminlogged = true;
                req.session.adminlogerror = false;
                res.render('dashboard')
            } else {
                console.log("password error");
                res.render('login', { errMsg: "Email Or Password Is incorrect" })
            }
        }
        else {
            res.render('login', { errMsg: "Email Or Password Is incorrect" })
        }
    } catch (error) {
        console.log(error.message);
    }
}

// const verifyLogin = async (req, res) => {
//     try {
//         const email = req.body.email;
//         const password = req.body.password;
//         const data = {
//             email: email,
//             password: password,
//         };
//         const { adminEmail, adminPassword } = req.body;
//         const adminData = await Admin.findOne({ adminEmail: email })
//         console.log("inside verify login");
//         if (adminData || (email == data.email && password == data.password) ){
//             console.log("inside admin data ");
//             if (data.email || adminEmail && adminPassword || email == data.email && password == data.password) {
//                 console.log("checking emails ");
//                 const passwordMatch = await bcrypt.compare(password, adminData.adminpassword || adminData.adminPassword);
//                 console.log("password checked");
//                 if (passwordMatch) {
//                     console.log("task successful and admin logged in");
//                     req.session.adminlogged = true;
//                     req.session.adminlogerror = false;
//                     res.render('dashboard');
//                 } else {
//                     res.render('login', { errMsg: "Password is Incorrect" })
//                 }
//             } else {
//                 res.render('login', { errMsg: "Your Account is blocked by Admin" })
//             }
//         } else {
//             console.log("verification failed");
//             res.render('login', { errMsg: "Email Or Phone Number is not Registered" })
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }




//load Register Page
const loadRegister = async (req, res) => {
    try {
        if (req.session.adminlogged) {
            res.render('register')
        }
        else {
            res.render('login')
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

//Registering Admin
const insertAdmin = async (req, res) => {
    try {
        console.log("insert admin");
        const { name, email, password, repassword } = req.body;
        if (name.trim() == "" || email.trim() == "" || password.trim() == "" || repassword.trim() == "") {
            res.render('register', { errMsg: "Input is empty or contains only white space" })
        } else {
            console.log("first else");
            const emailData = await Admin.findOne({ adminEmail: email })
            if (emailData) {
                console.log("checking if email exist");
                res.render('register', { errMsg: "Email is already Registered" })
            } else {
                console.log("Email doesnt exist");
                const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;;
                if (password.match(regex)) {
                    console.log("checking password is same or not");
                    if (password != repassword) {
                        console.log("passwrd is not same");
                        res.render('register', { errMsg: "Confirm password is not same" })
                    } else {
                        console.log("password is same");
                        const sPassword = await bcrypt.hash(password, 10)
                        console.log("encrypting password");
                        const admin = new Admin({
                            name: name,
                            adminEmail: email,
                            adminPassword: sPassword
                        })
                        console.log("password encrption completed");
                        const adminData = await admin.save()
                        console.log("saving to db");
                        if (adminData) {
                            console.log("task completed and account created");
                            res.redirect('/login')
                        } else {
                            console.log("task failed successfully");
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
            let { SKU, productName, category} = req.body
            if (!productName.trim() ) {
                const categoryData = await Category.find({})
                res.render('addProduct', { categoryData, SKU, errMsg: "Input is empty or contains only white space" })
            } else {
                const productNameCheck = await Product.findOne({ productName: productName })
                console.log("product name check");
                if (productNameCheck) {
                    console.log("if worked");
                    res.redirect('../admin/addProduct?errMsg=Same Product name already exists..')
                    console.log("no error");
                } else {
                    console.log("else worked");
                    console.log(req.files);
                    const products = new Product({
                        SKU: SKU,
                        productName: productName,
                        category: category,
                    })
                    const productData = await products.save();
                    if (productData) {
                        res.redirect('/admin/products')
                    } else {
                        const categoryData = await Category.find({})
                        res.render('addProduct', { categoryData, SKU, errMsg: "Something went wrong. Please Retry Again" })
                    }
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

            let { id, SKU, category,productName } = req.body;
            const productData = await Product.findOne({ _id: id }).populate('category')
            const categoryData = await Category.find({})

            if (!productName.trim()) {
                res.render("editProduct", { categoryData, errMsg: "Input is empty or contains only white space", productData })
            } else {
                await Product.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        SKU: SKU,
                        category: category,
                        productName:productName
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
// const imageDelete = async (req, res) => {
//     try {
//         if (req.session.adminlogged) {
//             const img = req.query.img;
//             const imageData = await Product.updateOne({ $pull: { image: { $in: [img] } } })
//             if (imageData) {
//                 res.redirect('/admin/editProduct?id=' + req.session.productId);
//             }
//         } else {
//             res.render('login')
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }
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
    loadRegister,
    insertAdmin,
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
   // imageDelete,
    deleteProduct,
}
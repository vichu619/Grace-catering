const multer=require('multer')
const path=require('path')


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,'../public/productImage'))
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname 
      cb(null, name)
    }
})

let upload = multer({ storage: storage })
module.exports={upload}
const isLogin=async(req,res,next)=>{
    try {
        if(req.session.user_id || req.session.mobile){
            next();
        }
    else{
        res.redirect('/login');
    }
    
    } catch (error) {
        console.log(error.message);
    }
}
const isLogout=async(req,res,next)=>{
    try {
        if(req.session.user_id || req.session.mobile){
            res.redirect('/home')
        }else{
            next();
        }
    
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    isLogin,
    isLogout
}
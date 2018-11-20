//檢查必須登入，不登入就跳到登入頁
exports.mustLogin = function (req,res,next) {
    if(req.session.user){
        next();
    }else {
        req.flash('error','你尚未登入,請登入');
        res.redirect('/users/login');
    }
};

//檢查必須未登入，已登入的話跳到首頁
exports.mustNotLogin = function(req,res,next){
    if(req.session.user){
        req.flash('error','你已經登入');
        res.redirect('/');
    }else{
        next();
    }
}

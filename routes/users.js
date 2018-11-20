var express = require('express');
var router = express.Router();
var auth = require('../auth');
// router.use(function (req,res,next) {
//     console.log('user use');
//     next();
// });
/* GET users listing. */

router.get('/reg',auth.mustNotLogin, function(req, res, next) {
    res.render("user/reg",{title:'用戶註冊'});
});

router.post('/reg',auth.mustNotLogin, function(req, res, next) {
    var user = req.body;
    if(user.password != user.repassword){
        req.flash('error','密碼和確認密碼不一致');
        //req.session.error = '註冊用戶失敗';
        return res.redirect('back');//回退到上一個頁面
    }
    delete user.repassword;
    console.log(user.password);
    user.password = blogUtil.md5(user.password);
    user.avatar = "https://secure.gravatar.com/avatar/"+blogUtil.md5(user.email)+"?s=48";
    new Model('User')(user).save(function(err,doc){
        if(err){
            req.flash('error','註冊用戶失敗');
            //req.session.error = '註冊用戶失敗';
            return res.redirect('back');//回退到上一個頁面
        }else{
            req.session.user = doc;
            //req.session.success = '註冊成功';
            req.flash('success','註冊成功');
            req.flash('success','歡迎光臨');
            console.log('註冊成功');
            res.redirect('/');
        }
    });
});

router.get('/login',auth.mustNotLogin, function(req, res, next) {
    res.render("user/login",{title:'用戶登入'});
});

router.post('/login',auth.mustNotLogin, function(req, res, next) {
    if(req.body){
        var user = req.body;
        user.password = blogUtil.md5(user.password);
        Model('User').findOne(user,function(err,doc){
            if(err){
                req.flash('error','登錄查詢失敗');
                return res.redirect('back');//回退到上一個頁面
            }else{
                console.log(doc);
                req.session.user = doc;
                req.flash('success','登錄成功');
                req.flash('success','歡迎光臨');
                res.redirect('/');
            }
        });
    }else{
        req.flash('error','填寫資訊不完整');
        return res.redirect('back');//回退到上一個頁面
    }
});


router.get('/logout',auth.mustLogin, function(req, res, next) {
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;

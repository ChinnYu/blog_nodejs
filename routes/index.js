var express = require('express');
//返回一個路由的實例
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    Model('Article').find({}).populate('user').exec(function (err,articles) {//populate像是join到另一張表取值出來
        //article.content = markdown.toHTML(article.content);
        //res.render('index', { title : 'welcome mywebsite' ,articles : articles});
        res.redirect('/articles/list/1/2');
    });

});

module.exports = router;

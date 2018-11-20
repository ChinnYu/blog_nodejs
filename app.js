var createError = require('http-errors');
var express = require('express');
var path = require('path');//處理路徑
var cookieParser = require('cookie-parser');//處理cookie req.cookie req.cookies
var logger = require('morgan');//處理日誌
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var indexRouter = require('./routes/index');//根路由
var usersRouter = require('./routes/users');//用戶路由
var articlesRouter = require('./routes/articles');//用戶路由
require('./util');
require('./db');//查找文件夾下index
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));//設置模板的存放路徑
app.set('view engine', 'html');//設置模板引擎
app.engine('html',require('ejs').__express);//設置對html檔的渲染方式

app.use(logger('dev'));//指定日誌輸出的格式
app.use(express.json());//處理JSON 通過 Content-Type來判斷是否由自己來處理
app.use(express.urlencoded({ extended: false }));//處理form-urlencoded
app.use(cookieParser());//處理cookie 把請求頭中的cookie轉成物件，加入一個cookie函數的屬性


var settings = require('./settings');
app.use(session({
    resave : true,
    secret : 'blog',
    saveUninitialized : true,
    store : new MongoStore({url:settings.dbUrl})
}));

//再載入flash中介軟體，它依賴session
app.use(flash());

//範本變數處理中介軟體它依賴flash
app.use(function(req,res,next){
    res.locals.user = req.session.user || {};
    //console.log(req.session.user);
    res.locals.title =  "cylstorm";
    //res.locals.avatar =  "";
   // console.log(res.locals.user,req.session.user);
    res.locals.keyword =  req.session.keyword;
    res.locals.success =  req.flash('success').toString() ;
    res.locals.error =  req.flash('error').toString() ;
    console.log(res.locals.success);
    next();
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// 捕獲404錯誤並且轉發到錯誤處理中介軟體
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:'error'});
});

module.exports = app;

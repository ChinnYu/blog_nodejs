var settings = require('../settings');
var mongoose = require('mongoose');
mongoose.connect(settings.dbUrl);
var db = mongoose.connection;
var ObjectId = mongoose.Schema.Types.ObjectId;


db.model('User',new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    avatar:{type:String,required:true},
}));

db.model('Article',new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    createAt:{type:Date,default:Date.now},
    img:{type:String},
    user:{type:ObjectId,ref:'User'}//引用哪個文檔
}));

global.Model = function(type){
    return mongoose.model(type);
}
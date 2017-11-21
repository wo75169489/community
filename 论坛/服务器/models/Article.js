const db = require('./db')
const mongoose = require('mongoose')
const shortid = require('shortid');

const ArticleSchema = mongoose.Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    //文章的标题
    title:{
        type:String,
        require:true
    },
    //文章的内容
    content:{
        type:String,
        require:true
    },
    //创建时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //修改时间
    update_time:{
        type:Date,
        default:Date.now
    },
    //标签
    tags:{
        type:Array,
    },
    //点击量
    click_num:{
        type:Number,
        default:0,
    },
    //回复量
    comment_num:{
        type:Number,
        default:0,
    },
    comment:{
     type:[String],
     ref:'Reply'
    },

    //关注量
    follow_num:{
        type:Number,
        default:0,
    },
    //作者,它应该一个user表中的数据
    author:{
        type:String,
        ref:'User' //文章的作者
    },
    //最后回复的时间
    last_reply_time:{
        type:Date,
        default:Date.now
    },
    //最后回复的那个人
    last_reply_author:{
        type:String,
        ref:'User'
    },
    //增加删除功能
    deleted:{
        type:Boolean,
        default:false
    }
})
 ArticleSchema.statics = {
     getArticlesSortComment_num:function(callback){
         Article.find().sort({'comment_num':-1}).exec(callback)
     },
     getArticleById:function(id,callback){
         Article.findOne({'_id':id},callback)
     },
     getArticlesSortCreate_time:function(callback){
         Article.find().sort({'create_time':-1}).exec(callback)
     },
     getArticleByAuthor:function(author,callback){
         Article.find({'author':author}).populate('author').exec(callback)
     },
 }

var Article = mongoose.model('Article',ArticleSchema)
module.exports = Article


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');


const CommentSchema = new Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    //对应的一级回复的ID
    reply_id:{
        type:String,
        ref:'Reply'
    },
    //二级留言的人
    author_id:{
        type:String,
        ref:'User'
    },
    //二级回复的对象,默认应该是留言的作者，但是也有可能是其他二级回复的人
    reply_author_id:{
        type:String,
        ref:'User'
    },
    article_id:{
        type:String,
        ref:'Article'
    },
    //二级回复的内容
    content:{
        type:String
    },
    //二级回复的时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //同时也可以给二级留言进行点赞
    likes:{
        type:[String],
        ref:'User'
    },
    // 书籍
    books:{
        type:String,
        ref:'Book'
    },
    // 书籍评分
    score:{
        type:Number,
    }
})

CommentSchema.statics={
    getCommentByReplyId:function(id,callback){
        Comment.find({'reply_id':id}).populate('author_id').exec(callback)
    },
    getCommentByAuthorId:function(id,callback){
        Comment.find({'author_id':id}).populate('reply_id , author_id , books').exec(callback)
    },
    getCommentByBooks:function(id,callback){
        Comment.find({'books':id}).populate('author_id').exec(callback)
    }
}
const Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment;
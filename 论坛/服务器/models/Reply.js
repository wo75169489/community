const db = require('./db')
const mongoose = require('mongoose')
const shortid = require('shortid');
const moment = require('moment');

const ReplySchema = mongoose.Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    //回答的内容
    content:{
        type:String,
        require:true,
        default:'请输入回答的内容...'
    },
    //回答的时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //回答的修改时间
    update_time:{
        type:Date,
        default:Date.now
    },
    //回答的那个人
    author:{
        type:String,
        ref:'User' //关联用户表
    },
    //二级回复的时候设置它,回复的ID
    reply_id:{
        type:[String],
        ref:'Comment'
    },
    //回答的对应文章
    article_id:{
        type:String,
        ref:'Article'
    },
    //删除功能
    deleted:{
        type:Boolean,
        default:false
    },
    //赞同数量
    angree:{
        type:Number,
        default:0,
    },
    //二级回复的数量
    comment_num:{
        type:Number,
        default:0,
    }
})
ReplySchema.statics = {
   getReplyByArticleId:(id,callback)=>{
       Reply.find({'article_id':id,deleted:false}).populate('author').exec(callback)
   },
   getReplyById:(id,callback)=>{
       Reply.findOne({'_id':id,deleted:false}).populate('author , article_id').exec(callback)
   },
   getAllReplySort:(id,req,callback)=>{
       let ot = {sort:'-'+req.s,limit:Number(req.l)}
       let od = id?{'article_id':id,deleted:false}:{deleted:false}
       Reply.find(od,{},ot).populate('article_id , author').exec(callback)
   }, 
   getReplyByAuthor:(author,callback)=>{
       Reply.find({'author':author,deleted:false}).populate('article_id , author').exec(callback)
   },
}
ReplySchema.methods.create_time_ago = function(){
    let time = moment(this.create_time).fromNow();
    return time;
}
const Reply = mongoose.model('Reply',ReplySchema);
module.exports = Reply
const db = require('./db')
const mongoose = require('mongoose')
const shortid = require('shortid');

const MessageSchema = mongoose.Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    // 关注类型 follow (包括 被关注) target_id与author_id存在
    // 关注的人回复问题 follow_reply comment_id 不存在
    // 文章被回复类型 reply  comment_id不存在
    // 回复被评论 comment article_id 不存在
    type: { type: String },
    //消息发给谁
    target_id: { type: String,ref:'User'},
    //谁发送的信息
    author_id: { type: String,ref:'User'},
    //文章的ID
    article_id: { type: String,ref:'Article'},
    //回复的ID
    reply_id: { type: String,ref:'Reply'},
    // 评论的ID 只有comment类型中会存在
    comment_id: { type: String,ref:'Comment'},
    has_read: { type: Boolean, default: false },
    cancelled:{ type: Boolean, default: false },
    create_time: { type: Date, default: Date.now },
})
MessageSchema.statics={
    getMessageIsCancelled:(data,callback)=>{
        Message.findOne(data).exec(callback)
    },
    getMessageById:(id,callback)=>{
        Message.findById(id).exec(callback)
    },
    getMessageByTargetIdUp:(id,callback)=>{
        Message.find({'target_id':id}).exec(callback)
    },
    getMessageByTargetIdAndNoHas:(id,callback)=>{
        Message.find({'target_id':id,'has_read':false}).populate(' author_id , article_id , reply_id , comment_id').exec(callback)
    },
    getMessageByTargetIdAndIsHas:(id,callback)=>{
        Message.find({'target_id':id,'has_read':true}).populate(' author_id , article_id , reply_id , comment_id').exec(callback)
    }
}
var Message = mongoose.model("message",MessageSchema);
module.exports = Message;
/**
 * Created by hama on 2017/5/10.
 */
//保存登录用户的信息
const db = require('./db')
const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    //用户的ID 
    _id: {
        type: String,
        default: shortid.generate,
        unique: true //id经常会被查询，所以，把ID作为索引
    },
    img: {
        type: String,
        default: 'moren.jpg'
    },
    name: {
        type: String,
        default: '网友' + new Date().getTime()
    },
    //用户名
    uname: {
        type: String,
        require: true
    },
    //密码
    password: {
        type: String,
        require: true
    },
    //邮箱
    email: {
        type: String
    },
    //个人简介
    motto: {
        type: String,
        default: '这家伙很懒,什么都没有留下..'
    },
    //创建时间
    create_time: {
        type: Date,
        default: Date.now
    },
    isguan: {
        type: Boolean,
    },
    // 我的提问
    my_question: {
        type: [String],
        ref: 'Article'
    },
    // 我的赞同(回答)
    my_angree: {
        type: [String],
        ref: 'Reply'
    },
    // 我的评论
    my_comment: {
        type: [String],
        ref: 'Comment'
    },
    // 我的回答
    my_answer: {
        type: [String],
        ref: 'Reply'
    },
    // 我的收藏
    my_collect: {
        type: [String],
        ref: 'Article'
    },
    // 我的书籍(包括已购买和免费收藏)
    my_books: [{ type: String, ref: "Book" }],
    // 我的关注(用户)
    my_follow: {
        type: [String],
        ref: 'User'
    },
    // 我的关注(回答)
    my_follow_reply: {
        type: [String],
        ref: 'Reply'
    },
    // 我的被关注(用户)
    my_befollow: {
        type: [String],
        ref: 'User'
    },
    // 我的购物车
    shopCart: { type: Array },
    // 我的介绍
    my_present: {
        type: String,
        default:''
    },
    // 我的钱包
    my_wallet: {
        type: Number,
        default:1,
    },
    // 我的付费问题
    my_pay_question: [{
        type: Schema.Types.String,
        ref: 'Question'
    }],
    // 向我提问的问题
    question_to_me: [{
        type: Schema.Types.String,
        ref: 'Question'
    }],
    // 我的付费回答
    my_pay_answer: [{
        type: Schema.Types.String,
        ref: 'Answer'
    }], 
    // 我的提问费用
    my_pay_answer_value:{
        type:Number,
        default:10
    }
})
UserSchema.statics = {
    getUserByUname: (uname, callback) => {
        User.findOne({ 'uname': uname }, callback);
    },
    getUserById: (id, callback) => {
        User.findOne({ '_id': id }).populate('my_pay_question , my_pay_answer').exec(callback);
    },
    getUserByIdAndUpdate: (id, req, callback) => {
        User.findByIdAndUpdate(id, { $set: req }).exec(callback)
    },
    getUserByIdBook: (id, callback) => {
        User.findOne({ '_id': id }).populate('my_books').exec(callback)
    }
}

const User = mongoose.model('User', UserSchema);
module.exports = User;

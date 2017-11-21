var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Reply = require('../models/Reply');
const Comments = require('../models/Comment');
const Book = require('../models/Book');
const validator = require('validator');
const Article = require('../models/Article');
const setting = require('../setting')

router.post('/create', function (req, res) {
    let title = req.body.title.trim()
    console.log(req.body)
    let tags = req.body.tags
    let alltags = setting.tags.map(function (tag) {
        return tag
    })
    let article = req.body
    let error
    if (!validator.isLength(title, { min: 3, max: 50 })) {
        error = '问题标题长度不能小于3个字或者多于50个字'
    }
    if (!tags) {
        error = '必须选择一个分类';
    }
    if (error) {
        return res.json({ error: 1, message: error })
    }
    article.author = req.session.userId;
    let newcreate = new Article(article)
    newcreate.save().then((article) => {
        User.getUserById(req.session.userId, (err, user) => {
            user.my_question.push(article._id)
            user.save()
            res.json({ error: 0, message: '发布提问成功', data: article._id })
        })
    }).catch(err => {
        req.json({ error: 1, message: err })
    })
})
router.get('/showre', function (req, res) {
    Article.getArticlesSortComment_num((err, articles) => {
        if (err) {
            return res.json({ error: 1, message: err })
        }
        res.json({ error: 0, message: 'ok', data: articles })
    })
})
router.get('/showxin', function (req, res) {
    Article.getArticlesSortCreate_time((err, articles) => {
        if (err) {
            return res.json({ error: 1, message: err })
        }
        res.json({ error: 0, message: 'ok', data: articles })
    })
})

router.get('/in', function (req, res) {
    Article.getArticleById(req.query.id, (err, article) => {
        if (err) {
            return res.json({ error: 1, message: err })
        }
        Reply.getReplyByArticleId(req.query.id, (err, reply) => {
            if(err){
                return res.json({ error: 1, message: err })
            }
            let aa=[]
             reply.forEach((item,index)=>{
                 aa.push(item.create_time_ago())
             })
              console.log(aa)
             res.json({ error: 0, message: 'ok', data: article,replys:reply,time:aa })
        })
    })
})

router.get('/ffff', function (req, res) {
    User.find().exec((err, user) => {
        user.forEach((item) => {
            item.save()
        })
    })
    Article.find().exec((err, article) => {
        article.forEach((item) => {
            item.save()
        })
    })
    Reply.find().exec((err, reply) => {
        reply.forEach((item) => {
            item.save()
        })
    })
    Comments.find().exec((err, comment) => {
        comment.forEach((item) => {
            item.save()
        })
    })
    Book.find().exec((err, books) => {
        books.forEach((item) => {
            item.save()
        })
    })
    res.json({ message: 'OK' })
})




module.exports = router;
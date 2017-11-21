var express = require('express');
var router = express.Router();
const User = require('../models/User');
const validator = require('validator');
const Article = require('../models/Article');
const Message = require('../models/Message');
const Reply = require('../models/Reply');
const Comments = require('../models/Comment');
const setting = require('../setting')

router.post('/create', function (req, res) {
    let content = req.body.content
    let author = req.body.author
    let article_id = req.body.article_id
    let error
    if (!content.trim()) {
        return error = '请填写回答内容'
    }
    if (!author) {
        return error = '未登录,不可评论'
    }
    if (!article_id) {
        return error = '未找到问题'
    }
    if (error) {
        return res.json({ error: 1, message: error })
    }


    let newReply = new Reply(req.body)
    newReply.save().then((reply) => {
        if (reply) {
            User.getUserById(author, (err, user) => {
                if (err) {
                    return error = err
                }
                if (error) {
                    return res.json({ error: 1, message: error })
                }
                user.my_anwser.push(reply._id)
                user.my_befollow.forEach((item)=>{
                    var data1 = {
                        type: 'follow_reply',
                        article_id:article_id,
                        target_id:item,
                        author_id:author,
                        reply_id:reply._id
                    }
                    var meg = new Message(data1)
                    meg.save()
                })
                user.save()
                Article.getArticleById(article_id, (err, article) => {
                    if (err) {
                        return error = err
                    }
                    if (error) {
                        return res.json({ error: 1, message: error })
                    }
                    article.comment_num += 1
                    article.comment.push(reply._id)
                    let data1 = {
                        type: 'reply',
                        article_id: article_id,
                        target_id:article.author,
                        author_id:author,
                        reply_id:reply._id
                    }
                    let message = new Message(data1)
                    message.save()
                    article.save()
                    Reply.getReplyById(reply._id, (err, re) => {
                        res.json({ error: 0, message: '保存成功', data: re, time: re.create_time_ago(), })
                    })
                })
            })
        }
    }).then((reply) => {

    })

})


router.get('/in', function (req, res) {
    if (req.query) {
        Reply.getReplyById(req.query.id, (err, reply) => {
            if (err) {
                res.json({ error: 1, message: err })
            }
            res.json({ error: 0, data: reply })
        })
    }
})

router.get('/getcomment', function (req, res) {
    let id = req.query.id
    Comments.getCommentByReplyId(id, (err, comment) => {
        if (err) {
            res.json({ error: 1, message: err })
        }
        console.log(comment)
        res.json({ error: 0, data: comment })
    })
})

router.get('/angree', function (req, res) {
    let id = req.query.id
    let iszan = req.query.iszan
    let iscang = req.query.iscang
    let isguan = req.query.isguan
    User.getUserById(req.session.userId, (err, user) => {
        if (err) {
            return res.json({ error: 1, message: err })
        }
        if (iszan) {
            if (iszan == 'true') {
                user.my_angree.push(id)
            } else {
                user.my_angree.splice(user.my_angree.indexOf(id), 1)
            }
            Reply.getReplyById(id, (err, reply) => {
                if (err) {
                    return res.json({ error: 1, message: err })
                }
                if (iszan == 'true') {
                    reply.angree += 1
                    console.log(reply)
                } else {
                    reply.angree -= 1
                }
                reply.save()
            })
        }
        if (iscang) {
            if (iscang == 'true') {
                user.my_collect.push(id)
            } else {
                user.my_collect.splice(user.my_angree.indexOf(id), 1)
            }
        }
        if (isguan) {
            if (isguan == 'true') {
                user.my_follow_reply.push(id)
            } else {
                user.my_follow_reply.splice(user.my_angree.indexOf(id), 1)
            }
        }
        user.save().then((user) => {
            res.json({ error: 0, data: user })
        })
    })
})


router.post('/commentcreate', function (req, res) {
    let content = req.body.content
    let reply_id = req.body.reply_id
    let author_id = req.body.author_id
    let article_id = req.body.article_id
    if (content.trim().length = 0) {
        return res.json({ error: 1, message: '内容过短' })
    }
    var com = new Comments(req.body)
    com.save().then((comment) => {
        Reply.getReplyById(reply_id, (err, reply) => {
            reply.comment_num += 1
            reply.reply_id.push(comment._id)
            reply.save()
        })
        return comment
    }).then((comment) => {
        User.getUserById(author_id, (err, user) => {
            user.my_comment.push(comment._id)
            user.save()
        })
        return comment
    }).then((comment) => {
        let data1 = {
            type: 'comment',
            target_id: req.body.reply_author_id,
            author_id: req.session.userId,
            reply_id:reply_id,
            comment_id:comment._id

            
        }
        let message = new Message(data1)
        message.save()
        res.json({ error: 0, data: comment })
    })
})


router.get('/reall', function (req, res) {
    let sort = req.query.sort || 'create_time'
    let limit = req.query.limit || ''
    let skip = req.query.skip
    let id = req.query.id
    Reply.getAllReplySort(id, {s:sort,l:limit}, (err, reply) => {
        if (err) {
          return  res.json({ error: 1, message: err })
        }
        res.json({ error: 0, data: reply })
    })
})

router.get('/remove',function(req,res){
    let id = req.query.id
    Reply.findByIdAndUpdate(id,{$set:{deleted:true}}).then((data)=>{
        res.json({error:0})
    })
})





module.exports = router;
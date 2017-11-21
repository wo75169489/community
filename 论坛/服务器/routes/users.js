var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');
const Message = require('../models/Message');
const Reply = require('../models/Reply');
const Book = require('../models/Book');
const Comments = require('../models/Comment');
const setting = require('../setting')

var multer = require("multer");

var picture = [];
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    var suffix = file.mimetype.split("/")[1];
    var fileName = file.fieldname + '-' + Date.now() + "." + suffix;
    picture.push(fileName);
    cb(null, fileName);
  }
})
var upload = multer({ storage: storage })







router.get('/session', function (req, res) {
  if (req.cookies.user) {
    req.session.userId = req.cookies.user
    User.getUserById(req.session.userId, (err, user) => {
      if (user) {
        res.json({ error: 0, data: user })
      }
    })
  } else {
    res.json({ error: 1, data: '未登陆' })
  }

})
router.post('/regist', function (req, res) {
  User.getUserByUname(req.body.uname, (err, user) => {
    if (user) {
      return res.json({ error: 1, message: '账号已存在' })
    }
    var user = new User(req.body)
    user.save((err, user1) => {
      if (err) {
        res.json({ error: 1, message: err })
      }
      res.json({ error: 0, message: '注册成功,三秒后跳转登陆' })
    })
  })
})
router.post('/login', function (req, res) {

  User.getUserByUname(req.body.uname, (err, user) => {
    if (!user) {
      return res.json({ error: 1, message: '账号不存在' })
    }
    if (req.body.password != user.password) {
      return res.json({ error: 1, message: '账号/密码不正确' })
    }
    user.password = null
    res.cookie('user', user._id, { path: '/', maxAge: 1000 * 60 * 60 * 24 })

    res.json({ error: 0, data: user, message: '登陆成功' })
  })
})
router.get('/remove', function (req, res) {
  req.session.userId = null;
  res.cookie('user', 1, { path: '/', maxAge: -1 })
  console.log(req.cookies)
  
  res.json({ error: 0, message: '退出成功' })
})
router.get('/search', function (req, res) {
  var tags = []
  setting.tags.forEach((item) => {
    if (req.query.tags == item) {
      tags.push(item)
    }
  })
  if (req.query.tags.length) {
    for (i = 0; i < req.query.tags.length; i++) {
      setting.tags.forEach((item) => {
        if (item.indexOf(req.query.tags.charAt(i)) > -1) {
          if (tags.indexOf(item) == -1) {
            tags.push(item)
          }
        }
      })
    }
  }
  res.json({ error: 0, data: tags })
})
router.get('/my_all', function (req, res) {
  let my_articles = []
  let my_replys = []
  let my_comments = []
  Article.getArticleByAuthor(req.query.id, (err, article) => {
    my_articles = article
    Reply.getReplyByAuthor(req.query.id, (err, reply) => {
      my_replys = reply
      Comments.getCommentByAuthorId(req.query.id, (err, comment) => {
        my_comments = comment
        res.json({ error: 0, article: my_articles, reply: my_replys, comment: my_comments })
      })
    })
  })
})
router.post("/update", upload.array("img"), function (req, res) {
  if (picture.length) {
    req.body.img = picture;
  }
  picture = []
  User.getUserByIdAndUpdate(req.body._id, req.body, (err, data) => {
    res.json({ error: 0, message: 'OK', data: data })
  })

});
 
router.get('/guanzhu', function (req, res) {
  let id = req.query.id
  let isg = req.query.isg
  let data = {
    type: 'follow',
    target_id: id,
    author_id: req.session.userId,
  }
  User.getUserById(id, (err, user) => {
    if (user.my_befollow.indexOf(req.session.userId) == -1) {
      user.my_befollow.push(req.session.userId)
      user.save()
    } else {
      if (isg == 'is') {
       return res.json({ error: 1, message: '已关注' })
      } else {
        user.my_befollow.splice(user.my_befollow.indexOf(req.session.userId), 1)
        user.save()
      }
    }
    User.getUserById(req.session.userId, (err, author) => {
      if (author.my_follow.indexOf(id) == -1) {
        author.my_follow.push(id)
        author.save()
      } else {
        if (isg == 'is') {
         return res.json({ error: 1, message: '已关注' })
        } else {
          author.my_follow.splice(author.my_follow.indexOf(id), 1)
          author.save()
        }
      }
    })
  })

  Message.getMessageIsCancelled(data, (err, message) => {
    if (!message) {
      let message = new Message(data)
      message.save().then(() => {
        res.json({ error: 0 })
      })
    } else {
      if (isg == 'is') {
        message.cancelled = false
        message.save().then(() => {
          res.json({ error: 0, message: 'OK' })
        })
      } else {
        message.cancelled = true
        message.save().then(() => {
          res.json({ error: 0, message: 'OK' })
        })
      }
    }
  })
})

router.get('/userbook',function(req,res){
    let id = req.query.id
    User.getUserByIdBook(id,(err,user)=>{
       if(!err){
         res.json({error:0,data:user})
       }
    })
})

router.get('/shopremove',function(req,res){
   let id = req.query.id
   User.findById(req.session.userId).then((user)=>{
         if(user){
            user.shopCart.splice(user.shopCart.indexOf(id),1)
            user.save().then((users)=>{
              res.json({error:0})
            })
         }
   })
})

router.post('/presentp',function(req,res){
    let pay = req.body.my_pay_answer_value
    let present = req.body.my_present
    if(typeof(Number(pay)) != 'number'){
      return res.json({error:1,message:'价格必须为数字'})
    }
    User.findByIdAndUpdate(req.body._id,req.body).then((user)=>{
      console.log(user)
          res.json({error:0,data:user})
    })
})
router.get('/payall',function(req,res){
    User.find().sort('-my_wallet').then((user)=>{
       res.json({error:0,data:user})
    })
})
router.get('/inanswer',function(req,res){
    let id = req.query.id
    User.findById(id).then((user)=>{
      res.json({error:0,data:user})
    })
})

module.exports = router;

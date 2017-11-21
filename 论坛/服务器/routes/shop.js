var express = require('express');
var router = express.Router();
const User = require('../models/User');
const validator = require('validator');
const Article = require('../models/Article');
const Message = require('../models/Message');
const Book = require('../models/Book');
const Reply = require('../models/Reply');
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
        var fileName = file.fieldname + '-' + Date.now() + "_book" + "." + suffix;
        picture.push(fileName);
        cb(null, fileName);
    }
})
var upload = multer({ storage: storage })

router.post('/add', upload.array("img"), function (req, res) {
    if (picture.length) {
        req.body.img = picture;
    }
    picture = []
    var book = new Book(req.body)
    book.save().then((book) => {
        res.json({ error: 0, data: book })
    })
})
router.get('/getall', function (req, res) {
    let data1 = {
        sort: '-price',
        limit: 7,
    }
    let data2 = {
        sort: '-angree',
        limit: 7,
    }
    let data3 = {
        sort: '-create_time',
        limit: 7,
    }

    Book.getBookLmit({}, data1, (err, book1) => {
        Book.getBookLmit({}, data2, (err, book2) => {
            Book.getBookLmit({ price: 0 }, data3, (err, book3) => {
                Book.getBookLmit({}, data3, (err, book4) => {
                    res.json({ error: 0, jingbook: book1, rebook: book2, mianbook: book3, xinbook: book4 })
                })
            })
        })
    })
})

router.get('/book', function (req, res) {
    let id = req.query.id
    Book.getBookById(id, (err, book) => {
        if (!err) {
            Comments.getCommentByBooks(id, (err, comment) => {
                if (!err) {
                    res.json({ error: 0, data: book, comment: comment })
                }
            })
        }
    })
})
router.get('/zan', function (req, res) {
    let id = req.query.id
    let isz = req.query.zan
    Book.getBookById(id, (err, book) => {
        let aa = book.angree.indexOf(req.session.userId)
        if (isz == 'true') {
            if (aa < 0) {
                book.angree.push(req.session.userId)
            }
        } else {
            if (aa > -1) {
                book.angree.splice(aa, 1)
            }
        }
        book.save().then((book) => {
            res.json({ error: 0, book: book })
        })
    })
})
router.post('/bookreply', function (req, res) {
    if (req.body) {
        let com = new Comments(req.body)
        com.save().then((comment) => {
            Book.findById(req.body.books, (err, book) => {
                if (!err) {
                    book.score.push(req.body.score)
                    book.comments.push(comment._id)
                    book.save().then(() => {
                        res.json({ error: 0, book: book })
                    })
                }
            })
        })
    }
})
router.get('/collect', function (req, res) {
    let id = req.query.id
    User.getUserById(req.session.userId, (err, user) => {
        if (user.my_books.indexOf(id) < 0) {
            user.my_books.push(id)
            user.save().then((data) => {
                Book.getBookById(id, (err, book) => {
                    book.read += 1
                    book.save().then((book) => {
                        res.json({ error: 0, book: book })
                    })
                })
            })
        }
    })
})
router.get('/remove', function (req, res) {
    let id = req.query.id
    User.getUserById(req.session.userId, (err, user) => {
        if (user.my_books.indexOf(id) > -1) {
            user.my_books.splice(user.my_books.indexOf(id), 1)
            user.save().then((data) => {
                Book.getBookById(id, (err, book) => {
                    book.read -= 1
                    book.save().then((book) => {
                        res.json({ error: 0, book: book })
                    })
                })
            })
        }
    })
})
router.get('/all_book', function (req, res) {
    Book.getAllBook((err, book) => {
        if (!err) {
            res.json({ error: 0, book: book })
        }
    })
})
router.get('/addshop', function (req, res) {
    let id = req.query.id
    Book.findById(id).then((book) => {
        User.getUserById(req.session.userId, (err, user) => {
            if (!err) {
                let isc = false
                user.shopCart.forEach((item) => {
                    if (item.id == id) {
                        item.num += 1
                        return isc = true
                    }
                })
                if (!isc) {
                    let shop = {
                        num: 1,
                        id: id,
                        name: book.name,
                        img: book.img,
                        price: book.price
                    }
                   user.shopCart.push(shop)
                }
                user.save().then((user)=>{
                    res.json({error:0,data:user})
                })
            }
        })
    })
})
router.post('/shoping', function (req, res) {
    let sbook = []
    req.body.forEach((item) => {
        sbook.push(item.id)
    })
    let nbook = []
    User.findById(req.session.userId).then((user) => {
        user.my_books = user.my_books.concat(sbook)
        user.shopCart.forEach((item) => {
            if (sbook.indexOf(item.id)<0) {
                nbook.push(item)
            }
        })
        user.shopCart = nbook
        user.save().then((data) => {
            res.json({ error: 0 })
        })
    })
})
router.get('/zj',function(req,res){
    let id = req.query.id
    let num = Number(req.query.num)
    User.getUserById(req.session.userId,(err,user)=>{
        user.shopCart.forEach((item)=>{
            if(item.id == id){
               item.num += num
            }
        })
        let us = new User(user)
        us.save().then((data)=>{
            res.json({error:0,data:data})
        }).catch((err)=>{
            console.log(err)
        })
    })
})
router.get('/addread',function(req,res){
    let id = req.query.id
    Book.getBookById(id,(err,book)=>{
        book.read +=1
        book.save().then((data)=>{
            res.json({error:0})
        })
    })
})

router.get('/sbook',function(req,res){
    let val = req.query.val
    Book.find({name:{$regex:val}}).then((book)=>{
        res.json({error:0,data:book})
    })
})



module.exports = router;
var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Reply = require('../models/Reply');
const Comments = require('../models/Comment');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Book = require('../models/Book');
const validator = require('validator');
const Article = require('../models/Article');
const setting = require('../setting')

router.post('/question',function(req,res){
     let que = new Question(req.body)
     que.save().then((question)=>{
         let aId = question.Answer_author
         let  id = question._id
          User.findById(question.author).then((user)=>{
              user.my_pay_question.push(question._id)
              user.save().then((user)=>{
                  User.findById(aId).then((auser)=>{
                      auser.question_to_me.push(id)
                      auser.save().then(()=>{
                         res.json({error:0})
                      })
                  })
              })
          }) 
     })
})
router.get('/getall',function(req,res){
    Question.getQuestionByAuthor(req.query.id,(question)=>{
        Answer.getAnswerByAuthor(req.query.id,(answer)=>{
            Question.getQuestionByAnswer_author(req.query.id,(Aquestion)=>{
                res.json({error:0,question:question,answer:answer,Aquestion:Aquestion})
            })
        })
    })
})
router.get('/getquestion',function(req,res){
    let id = req.query.id
    Question.findById(id).populate('author').then((question)=>{
        res.json({error:0,data:question})
    })
})
router.post('/anscreate',function(req,res){
    
})




module.exports = router
var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');
const Message = require('../models/Message');
const Reply = require('../models/Reply');
const Comments = require('../models/Comment');

router.get('/megno',function(req,res){
    let id = req.session.userId
    Message.getMessageByTargetIdAndNoHas(id,(err,message)=>{
        res.json({error:0,data:message})
    })
})
router.get('/yidu',function(req,res){
    let id = req.query.id
    Message.getMessageById(id,(err,message)=>{
        if(message){
            message.has_read = true
            message.save().then((message)=>{
                res.json({error:0,message:'OK'})
            })
        }
    })
})
router.get('/alldu',function(req,res){
    let id = req.session.userId
    Message.getMessageByTargetIdUp(id,(err,message)=>{
        if(!err){
            message.forEach((item)=>{
                item.has_read = true
                item.save()
            })
            res.json({error:0})
        }
    })
})

router.get('/megis',function(req,res){
    let id = req.session.userId
    Message.getMessageByTargetIdAndIsHas(id,(err,message)=>{
        res.json({error:0,data:message})
    })
})




module.exports = router;

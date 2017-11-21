const db = require('./db')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const shortid = require('shortid');

const QuestionSchema = mongoose.Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },  
    content:{
        type:String,
        require:true
    },
    create_time:{
        type:Date,
        default:Date.now
    },
    author:{
        type:String,
        ref:'User' 
    },
    Answer_author:{
        type:String,
        ref:'User'
    },
    Answer:{
        type:String,
        ref:'Answer'
    },
    isA:{
        type:Boolean,
        default:false
    },
    value:{
        type:Number,
    }
})
 QuestionSchema.statics ={
  getQuestionByAuthor:(id,callback)=>{
      Question.find({'author':id}).populate('author , Answer_author ,Answer').then(callback)
  },
  getQuestionByAnswer_author:(id,callback)=>{
      Question.find({'Answer_author':id,'isA':false}).populate('author , Answer_author').then(callback)
  }
}

var Question = mongoose.model('Question',QuestionSchema)
module.exports = Question

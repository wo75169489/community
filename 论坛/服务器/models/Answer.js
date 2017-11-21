const db = require('./db')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const shortid = require('shortid');

const AnswerSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate,
        unique: true
    },
    content: {
        type: String,
        require: true
    },
    create_time: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
        ref: 'User'
    },
    question_author: {
        type: String,
        rdf: 'User'
    },
    question: {
        type: String,
        ref: 'Question'
    },
    angree:[{
        type: Schema.Types.String,
        ref: 'User'
    }],
    read_power: [{
        type: Schema.Types.String,
        ref: 'User'
    }]
})

AnswerSchema.statics ={
  getAnswerByAuthor:(id,callback)=>{
      Answer.find({'author':id}).populate('question_author,question').then(callback)
  }
}




var Answer = mongoose.model('Answer', AnswerSchema)
module.exports = Answer

const db = require('./db')
const mongoose = require('mongoose')
const shortid = require('shortid');

const BookSchema = mongoose.Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    img:{
        type:String,
    },
    name:{
        type:String,
    },
    author:{
        type:String,
    },
    summary:{
        type:String,
    },
    price:{
        type:Number,
    },
    angree:{
        type:[String],
    },
    comments:{
        type:[String],
    },
    score:{
        type:Array,
    },
    create_time:{
        type:Date,
        default:Date.now
    },
    read:{
        type:Number,
        default:0
    },
})
  BookSchema.statics = {
      getBookLmit:(qt,ot,callback)=>{
          Book.find(qt,{},ot).exec(callback)
      },
      getBookById:(id,callback)=>{
          Book.findById(id).exec(callback)
      },
      getAllBook:(callback)=>{
         Book.find().exec(callback)
      }
 }

const Book = mongoose.model('Book',BookSchema);
module.exports = Book;


const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/zhihu')

var  db = mongoose.connection

db.once('open',function(){
    console.log('连接成功')
})

module.exports = db
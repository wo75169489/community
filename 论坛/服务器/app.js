const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose')



const index = require('./routes/index');
const users = require('./routes/users');
const article = require('./routes/question');
const reply = require('./routes/reply');
const message = require('./routes/message');
const shop = require('./routes/shop');
const payaq = require('./routes/payaq');




const MongoStore = require('connect-mongo')(session)

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:'751694',
    store:new MongoStore({
        url:'mongodb://localhost'
    }),
    saveUninitialized:true,
    resave:false,
    name:'DK',
}))


app.use('/', index);
app.use('/users', users);
app.use('/article', article);
app.use('/reply', reply);
app.use('/message', message);
app.use('/shop', shop);
app.use('/payaq', payaq);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

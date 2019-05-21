var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//add new
const history = require('connect-history-api-fallback');
const cors = require('cors');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 개발모드 일때만 활성화, 미들웨어 cors 처리
// 웹서버(웹프로젝트)는 8080에 떠있지만 실제로 요청을 받는 API 서버는 3000 포트에서 받고 있기 때문이다. 
// development 일때 cors가 설정되어 있기 때문에 frontend yarn serve로 8080포트로 서버 포트와 달라도 api 가져올 수 있다.

// app.get('env') === 'development' && app.use(cors()); 
if (process.env.NODE_ENV !== 'production') app.use(cors());

/**
 * 1. /api , /(root) 이외에 경로들은 모두 Error로 내보낸다.
 * 2. createError 하게되면 error handler로 들어온다. 
 */

// api 경로 수행
app.use('/api', require('./routes/api'));

// 존재하지 않는 경로일때 서버에서의 처리를 view 단의 페이지에서 처리할 수 있도록 위임한다.
app.use(history());


app.use(express.static(path.join(__dirname, './../', 'frontend', 'dist')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(req)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error'); // express render가 아닌 vue에서 render 한다.
  res.send({ msg: err.message });
});

const mongoose = require('mongoose');
const User = require('./models/users');

console.log(process.env.NODE_ENV + 'started!!!'); // NODE_ENV는 입력해야 하는 값 (backend에서 NODE_ENV=xxx node ./bin/www)

const config = require('../config');
console.log(config);

// mongoose.connect('mongodb://localhost:27017/emv_db', { useNewUrlParser: true }, (err) => {
mongoose.connect(config.dbUrl, { useNewUrlParser: true }, (err) => {
  if (err) return console.error(err);
  console.log('mongoose connected!');

  // User.create({
  //   name: '테스트유저'
  // }).then(res => {
  //   console.log(res);
  // }).catch(err => {
  //   console.error(err);
  // });

  // User.find().then(res => console.log(res))
  //   .catch(err => console.error(err));

  // User.updateOne({ _id: '5cd3fe808fa8866f6128a3bd' }, { $set: { age: 13 } })
  //   .then(res => {
  //     console.log(res);
  //     console.log('updated');
  //     return User.find(); //promise return
  //   }).then(res => {
  //     console.log(res);
  //   }).catch(err => {
  //     console.error(err);
  //   });

  // User.deleteOne({ name: '테스트유저' })
  //   .then(res => {
  //     console.log(res);
  //   }).catch(err => {
  //     console.log(err);
  //   });

  // User.deleteMany()
  //   .then(res => {
  //     console.log(res);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })
});

module.exports = app;

// var jwt = require('jsonwebtoken');
// const key = 'key';
// var token = jwt.sign({ id: 'tony', email: 'kis420404@gmail.com' }, key);
// console.log('token => ', token);

// var decoded = jwt.verify(token, key);
// console.log(new Date(decoded.iat * 1000)) // 토큰 발행 시간
// console.log('decoded token => ', decoded);
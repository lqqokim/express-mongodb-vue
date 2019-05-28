var express = require('express');
var createError = require('http-errors');
var router = express.Router();

//User, Page관리 접근은 관리자만 가능
router.all('*', (req, res, next) => {
  if(req.user.level > 0) return res.send({ success:false, msg: '권한이 없습니다.'});
  next();
})

router.use('/user', require('./user'))
router.use('/page', require('./page'))
router.use('/site', require('./site'))
router.use('/board', require('./board'))

router.all('*', function(req, res, next) {
  next(createError(404, '그런 api 없어'));
});

module.exports = router;
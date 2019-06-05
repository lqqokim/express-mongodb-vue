var express = require('express');
var createError = require('http-errors');
var router = express.Router();

//User, Page관리 접근은 관리자만 가능
router.all('*', (req, res, next) => {
  // if(req.user.level > 0) throw createError(403, '권한이 없습니다.');
  if(req.user.level > 0) return next(reateError(403, '권한이 없습니다.'));
  next();
})

router.use('/user', require('./user'))
router.use('/page', require('./page'))
router.use('/site', require('./site'))
router.use('/board', require('./board'))

module.exports = router;
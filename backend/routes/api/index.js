var express = require('express');
var createError = require('http-errors');
var router = express.Router();

/* GET /api */
// router.get('/', function (req, res, next) {
//     res.send({ msg: 'hello', a: 1 });
// });

// Middleware 토큰처리의 경우 next로 서버내에서 처리하고 api는 vue처리 하는 방식으로 라우팅 작업
router.all('*', function(req, res, next) {
    console.log(req.headers);
    console.log(req.path);
    if(req.path === '/xxx') return res.send({ status: 'OK' });

    next();
});

router.use('/test', require('./test'));
router.use('/user', require('./user'));

router.all('*', function(req, res, next) {
    next(createError(404, '존재하지 않는 api 입니다.'));
});

module.exports = router;

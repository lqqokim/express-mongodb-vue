var express = require('express');
var createError = require('http-errors');
var router = express.Router();


router.get('/hello', function (req, res, next) {
    console.log(req.headers);
    res.send({ msg: 'hello', a: 1 });
});

router.get('/', function (req, res, next) {
    res.send({ msg: 'hi', a: 1 });
});

router.all('*', function(req, res, next) {
    next(createError(404, 'test 존재하지 않는 api 입니다.'));
});

module.exports = router;

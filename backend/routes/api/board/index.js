var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Board = require('../../../models/boards');

router.get('/read/:name', (req, res, next) => {
    const { name } = req.params;

    Board.findOne({ name })
        .then(result => {
            console.log(' Board.findOne => ', result)
            res.send({ success: true, d: result, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
});

router.get('/list', (req, res, next) => {
    Board.find().sort({ lv: -1 })
        .then(boards => {
            res.send({ success: true, data: boards, token: req.token });
        })
        .catch(err => {
            res.send({ success: false, msg: e.message });
        });
});

router.all('*', function (req, res, next) {
    console.log('createError')
    next(createError(404, '그런 api 없어'));
});

module.exports = router;
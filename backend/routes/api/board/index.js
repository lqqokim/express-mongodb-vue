var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Board = require('../../../models/boards');

router.get('/read/:name', (req, res, next) => {
    const { name } = req.params;

    Board.findOne({ name })
        .then(result => {
            // 권한으로 못보게 하려면
              // if (r.lv < req.lv) throw new Error(`${name} 게시판을 볼 수 있는 자격이 없습니다.`)
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

module.exports = router;
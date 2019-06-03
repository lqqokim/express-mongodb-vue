var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const crypto = require('crypto');
const User = require('../../../models/users');

// 로그인 시
router.post('/', (req, res) => {
    const { id, pwd, name } = req.body
    if (!id) return res.send({ success: false, msg: '아이디가 없습니다.' });
    if (!pwd) return res.send({ success: false, msg: '비밀번호가 없습니다.' });
    if (!name) return res.send({ success: false, msg: '이름이 없습니다.' });

    User.findOne({ id })
        .then(user => {
            if (user) throw new Error('이미 존재하는 아이디입니다.');
            return User.create({ id, pwd, name });
        })
        .then(result => {
            //버퍼로 저장되기 때문에 마지막에 toString 처리
            const cryptopwd = crypto.scryptSync(result.pwd, result._id.toString(), 64, { N: 1024 }).toString('hex');
            return User.updateOne({ _id: result._id }, { $set: { pwd: cryptopwd } });
        })
        .then(result => {
            res.send({ success: true })
        })
        .catch(err => res.send({ success: false, msg: err.message }));
})

router.all('*', function (req, res, next) {
    next(createError(404, '그런 api 없어'));
});

module.exports = router;
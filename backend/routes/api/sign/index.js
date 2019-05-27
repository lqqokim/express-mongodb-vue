var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const jwt = require('jsonwebtoken')
const config = require('../../../../config')
const User = require('../../../models/users')

// id, age, privateKey를 기반으로 token 생성
// SHA-256 기본값으로 생성
const createSignToken = (id, level, name) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ id, level, name }, config.secretKey, (err, token) => {
            if (err) reject(err)
            resolve(token)
        });
    })
}

// 로그인 시
router.post('/in', (req, res) => {
    const { id, pwd } = req.body
    if (!id) return res.send({ success: false, msg: '아이디가 없습니다.' })
    if (!pwd) return res.send({ success: false, msg: '비밀번호가 없습니다.' })

    //   res.send({ success: true, token: 'temp token!!' })
    User.findOne({id})
        .then(result => {
            console.log('findOne => ', result)
            if(!result) throw new Error('존재하지 않는 아이디입니다.')
            if(result.pwd !== pwd) throw new Error('비밀번호가 틀립니다.')
            return createSignToken(result.id, result.level, result.name)
        })
        .then(result => res.send({ success: true, token: result}))
        .catch(err => res.send({ success: false, msg: err.message}))
})

router.post('/out', (req, res) => {
    res.send({ success: false, msg: '아직 준비 안됨.' })
})

router.all('*', function (req, res, next) {
    next(createError(404, '그런 api 없어'));
});

module.exports = router;
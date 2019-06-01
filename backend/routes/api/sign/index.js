var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const config = require('../../../../config')
const User = require('../../../models/users')

// id, age, privateKey를 기반으로 token 생성
// SHA-256 기본값으로 생성
const createSignToken = (_id, id, level, name, remember) => {
    return new Promise((resolve, reject) => {
        const jwtOptions = {
            issuer: config.jwt.issuer,
            subject: config.jwt.subject,
            expiresIn: config.jwt.expiresIn, // 3분
            algorithm: config.jwt.algorithm
        };

        if (remember) jwtOptions.expiresIn = config.jwt.expiresInRemember; // 7일

        // token 발급
        jwt.sign({ _id, id, level, name }, config.jwt.secretKey, jwtOptions, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
}

// 로그인 시
router.post('/in', (req, res) => {
    const { id, pwd, remember } = req.body;
    if (!id) return res.send({ success: false, msg: '아이디가 없습니다.' });
    if (!pwd) return res.send({ success: false, msg: '비밀번호가 없습니다.' });
    if (remember == undefined) return res.send({ success: false, msg: '기억하기가 없숩니다.' });

    //   res.send({ success: true, token: 'temp token!!' })
    User.findOne({ id })
        .then(async (result) => {
            if (!result) throw new Error('존재하지 않는 아이디입니다.');

            // 단방향 함수 사용하여 회원가입했을때 저장한 cryptopwd와 로그인했을때 cryptopwd 비교하여 처리한다.
            const cryptopwd = crypto.scryptSync(pwd, result._id.toString(), 64, { N: 1024 }).toString('hex');
            console.log(result.pwd, cryptopwd)
            if (result.pwd !== cryptopwd) throw new Error('비밀번호가 틀립니다.');
            const accessToken = await createSignToken(result._id, result.id, result.level, result.name, remember);
            console.log('accessToken => ', accessToken);
            return accessToken;
        })
        .then(accessToken => {
            res.send({ success: true, token: accessToken })
        })
        .catch(err => res.send({ success: false, msg: err.message }));
})

router.post('/out', (req, res) => {
    res.send({ success: false, msg: '아직 준비 안됨.' })
})

router.all('*', function (req, res, next) {
    next(createError(404, '그런 api 없어'));
});

module.exports = router;
var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const config = require('../../../../config')
const User = require('../../../models/users')

// 회원가입
router.post('/up', (req, res) => {
    const { id, pwd, name } = req.body
    if (!id) throw createError(400, '아이디가 없습니다')
    if (!pwd) throw createError(400, '비밀번호가 없습니다')
    if (!name) throw createError(400, '이름이 없습니다.')


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
});

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
router.post('/in', (req, res, next) => {
    const { id, pwd, remember } = req.body;
    if (!id) throw createError(400, '아이디가 없습니다.');
    if (!pwd) throw createError(400, '아이디가 없습니다.');
    if (remember == undefined) return createError(400, '기억하기가 없습니다.');

    //   res.send({ success: true, token: 'temp token!!' })
    let user = {};
    User.findOne({ id }).lean() // lean을 해주어야 result를 변경할수 있다.
        .then(async (result) => {
            if (!result) throw new Error('존재하지 않는 아이디입니다.'); // promise 체인 안에서는 catch로 이동
            // 단방향 함수 사용하여 회원가입했을때 저장한 cryptopwd와 로그인했을때 cryptopwd 비교하여 처리한다.
            const cryptopwd = crypto.scryptSync(pwd, result._id.toString(), 64, { N: 1024 }).toString('hex');
            if (result.pwd !== cryptopwd) throw new Error('비밀번호가 틀립니다.');
            delete result.pwd;
            user = result;

            const accessToken = await createSignToken(result._id, result.id, result.level, result.name, remember);
            return accessToken;
        })
        .then(accessToken => {
            // res.status(200).send({ success: true, token: accessToken })
            res.send({ success: true, token: accessToken, user: user })
        })
        .catch(err => {
            res.send({ success: false, msg: err.message })
        });
})

router.post('/out', (req, res) => {
    res.send({ success: false, msg: '아직 준비 안됨.' })
})

module.exports = router;
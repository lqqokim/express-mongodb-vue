var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const jwt = require('jsonwebtoken')
const config = require('../../../config')

/* GET /api */
// router.get('/', function (req, res, next) {
//     res.send({ msg: 'hello', a: 1 });
// });

// 토큰 검사하는 미들웨어는 토큰이 있을때만 들어와야되기 때문에 sign이 더 위에 있다.
router.use('/sign', require('./sign'))
router.use('/register', require('./register'))
router.use('/site', require('./site'))
console.log('**************')
console.log('*****SIGN*****')
console.log('**************')

// 라우팅은 위에서 아래로 인증하면서 순차적으로 수행
// Middleware: 토큰처리의 경우 next로 서버내에서 처리하고 api는 vue가 처리 하는 방식으로 라우팅 작업
// 모든 api에 대해 token 검사 수행
router.all('*', (req, res, next) => {
    console.log('토큰 검사 수행');
    //token 검사
    const token = req.headers.authorization;
    verifyToken(token)
        .then(verifiedToken => {
            console.log('verify된 token => ', verifiedToken)
            req.user = verifiedToken; // ??
            next() // token검사 이후 다음 라우터로 이동
        })
        .catch(err => res.send({ success: false, msg: err.message })) // 에러가 나면 다음 라우터 넘어가지 않는다
});

// token 검사
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        // console.log('verifyToken => ', token);
        if (!token) resolve({ id: 'guest', name: '손님', level: 3 }) // token이 없으면 손님
        if ((typeof token) !== 'string') reject(new Error('문자가 아닌 토큰 입니다.'))
        if (token.length < 10 && token === 'null') resolve({ id: 'guest', name: '손님', level: 3 }) // for  'null'

        jwt.verify(token, config.secretKey, (err, verifiedToken) => {
            if (err) reject(err)
            resolve(verifiedToken)
        })
    })
}

// 회원 level에 따른 Page 권환 체크
router.use('/page', require('./page'));
console.log('**************')
console.log('*****PAGE*****')
console.log('**************')

// 관리자가 관리용으로 사용하는 api
router.use('/manage', require('./manage'));
console.log('**************')
console.log('****MANAGE****')
console.log('**************')

router.use('/test', require('./test'));
router.all('*', function (req, res, next) {
    if (req.user.level > 0) return res.send({ success: false, msg: '권한이 없습니다.' })
    next()
})

// router.use('/user', require('./user'));
console.log('**************')
console.log('*****USER*****')
console.log('**************')


router.all('*', (req, res, next) => {
    next(createError(404, '존재하지 않는 api 입니다.'));
});

module.exports = router;

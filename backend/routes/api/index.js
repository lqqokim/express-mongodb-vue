var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../../../config');

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

// front에서 요청온 token을 검증해서 재발급할지 말지를 판단
const getToken = async (token) => {
    let vt = await verifyToken(token);
    console.log('vt => ', vt);
    const diff = moment(vt.exp * 1000).diff(moment(), 'seconds');
    console.log('diff => ', diff);
    // 손님이면 token 발급없이 null을 return | 60초 보다 diff가 크면 토큰을 새로 내려줄 필요가 없기 때문에 null을 return
    const expSec = (vt.exp - vt.iat);
    if (vt.level > 2 || diff > expSec / config.jwt.expiresInDiv) {
        return { user: vt, token: null };
    }
    // 60초보다 작을 경우 token을 다시 생성한다.
    const refreshToken = await createSignToken(vt._id, vt.id, vt.level, vt.name, expSec);
    // console.log('refreshToken => ', refreshToken);
    vt = await verifyToken(refreshToken);

    return { user: vt, token: refreshToken };
}

// secretKey를 이용하여 token을 푼다 
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) resolve({ id: 'guest', name: '손님', level: 3 }); // token이 없으면 손님
        if ((typeof token) !== 'string') reject(new Error('문자가 아닌 토큰 입니다.'));
        //token이 없으면 손님
        if (token.length < 10 && token === 'null') resolve({ id: 'guest', name: '손님', level: 3 });

        jwt.verify(token, config.jwt.secretKey, (err, vt) => {
            if (err) reject(err);
            resolve(vt);
        })
    })
}

//config option 기반으로 token 생성
const createSignToken = (_id, id, level, name, exp) => {
    return new Promise((resolve, reject) => {
        const jwtOptions = {
            issuer: config.jwt.issuer,
            subject: config.jwt.subject,
            expiresIn: config.jwt.expiresIn, // 3분
            algorithm: config.jwt.algorithm,
            expiresIn: exp
        };

        console.log('jwtOptions => ', jwtOptions)
        // token 생성
        jwt.sign({ _id, id, level, name, exp }, config.jwt.secretKey, jwtOptions, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
}

// 라우팅은 위에서 아래로 인증하면서 순차적으로 수행
// Middleware: 토큰처리의 경우 next로 서버내에서 처리하고 api는 vue가 처리 하는 방식으로 라우팅 작업
// 페이지 이동시에 모든 api에 대해 발행된 token 으로 token 검사 수행
router.all('*', (req, res, next) => {
    console.log('토큰 검사 수행');
    //token 검사 수행
    const token = req.headers.authorization;
    getToken(token)
        .then(vt => {
            req.token = vt.token;
            req.user = vt.user;
            next() // token검사 이후 다음 라우터로 이동
        })
        .catch(err => res.send({ success: false, msg: err.message })) // 에러가 나면 다음 라우터 넘어가지 않는다
});

// 회원 level에 따른 Page 권환 체크
router.use('/page', require('./page'));
console.log('**************')
console.log('*****PAGE*****')
console.log('**************')
router.use('/board', require('./board'));
router.use('/article', require('./article'));

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

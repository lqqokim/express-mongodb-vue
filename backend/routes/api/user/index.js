var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const UserModel = require('./../../../models/users');

router.get('/', function (req, res, next) {
    UserModel.find()
        .then(users => {
            res.send({ success: true, users: users });
        }).catch(err => {
            res.send({ success: false });
        })
});

router.post('/', (req, res, next) => {
    const { name, age } = req.body;
    const newUser = new UserModel({ name, age });

    newUser.save() // post create 보다는 save 사용
        .then(user => {
            res.send({ success: true, msg: user });
        }).catch(err => {
            res.send({ success: false, msg: err.message });
        });
});

router.put('/', (req, res, next) => {
    console.log(req.query)
    console.log(req.body)
    res.send({ success: true });
});

router.delete('/', (req, res, next) => {
    console.log(req.query)
    console.log(req.body)
    res.send({ success: true });
});

router.all('*', function (req, req, next) {
    next(createError(404, 'user 존재하지 않는 페이지'));
});

module.exports = router;
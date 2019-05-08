var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const users = [
    {
        name: 'Vue',
        desc: 'Vue',
        img: 'https://kr.vuejs.org/images/logo.png'
    },
    {
        name: 'React',
        desc: 'React',
        img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K'
    },
    {
        name: 'Angular',
        desc: 'Angular',
        img: 'https://angular.io/assets/images/logos/angular/logo-nav@2x.png'
    }
];

router.get('/', function (req, res, next) {
    console.log(req.query)
    console.log(req.body)
    res.send({ users: users });
});

router.post('/', (req, res, next) => {
    console.log(req.query)
    console.log(req.body)
    res.send({ success: true });
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
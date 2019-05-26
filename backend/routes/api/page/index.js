var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Page = require('../../../models/pages')

router.post('/', function (req, res, next) {
  // return res.send({ success: true, d: req.user });
  const { name } = req.body
  console.log('page post => ', name)

  Page.findOne({ name })
    .then((r) => {
      if (!r) {
        if (req.user.level > 0) throw new Error(`페이지 ${name} 생성이 안되었습니다.`)// 관리자가 아니면 생성 할 수 없다.
        return Page.create({ name })
      }
      if (r.level < req.user.level) throw new Error(`페이지 ${name} 이용 자격이 없습니다.`) // User권환이 Page권한보다 낮을때
      return Page.updateOne({ _id: r._id }, { $inc: { loginCnt: 1 } })
    })
    .then(() => {
      //   return Page.find()
      // })
      // .then((rs) => {
      //   console.log(rs)
      res.send({ success: true, d: req.user })
    })
    .catch((e) => {
      res.send({ success: false, msg: e.message })
    })
});

router.all('*', function (req, res, next) {
  next(createError(404, '그런 api 없어'));
});

module.exports = router;
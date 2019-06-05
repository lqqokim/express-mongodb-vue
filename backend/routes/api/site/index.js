var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Site = require('../../../models/sites')

router.get('/', function (req, res, next) {
  Site.findOne()
    .then(result => {
      res.send({ success: true, d: result, token: req.token})
    })
    .catch((e) => {
      res.send({ success: false, msg: e.message })
    })
});

module.exports = router;
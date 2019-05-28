const router = require('express').Router()
const createError = require('http-errors')
const Board = require('../../../../models/boards')

router.post('/', (req, res, next) => {
  const { name, level, rmk } = req.body;
  Board.create({ name, level, rmk })
    .then(result => {
      res.send({ success: true, msg: result, token: req.token })
    })
    .catch(err => {
      res.send({ success: false, msg: err.message })
    })
});

router.get('/', function(req, res, next) {
  Board.find()
    .then(r => {
      res.send({ success: true, boards: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.put('/:_id', (req, res, next) => {
  const _id = req.params._id
  // console.log('put => ', _id)
  // console.log(req.body)
  Board.updateOne({ _id }, { $set: req.body})
    .then(r => {
      res.send({ success: true, msg: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.delete('/:_id', (req, res, next) => {
  const _id = req.params._id
  Board.deleteOne({ _id })
    .then(r => {
      res.send({ success: true, msg: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

module.exports = router;
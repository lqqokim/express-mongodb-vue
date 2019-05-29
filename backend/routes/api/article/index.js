var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Board = require('../../../models/boards');
const Article = require('../../../models/articles');

// 게시판을 읽어온다
router.get('/list/:_board', (req, res, next) => {
    const { _board } = req.params;
    const param = _board ? { _board } : {}; // 게시물이 지정 안되어 있을 경우 전체

    // {  
    //     "cnt":{  
    //        "view":0,
    //        "like":0
    //     },
    //     "title":"aa",
    //     "content":"aa",
    //     "ip":"::1",
    //     "comments":[  
     
    //     ],
    //     "_id":"5cee8ddcf666ef35a8818f29",
    //     "_board":"5cedc962a8ce44ebe299218e",
    //     "_user":{  
    //        "id":"admin",
    //        "name":"관리자",
    //        "age":1,
    //        "retry":0,
    //        "level":0,
    //        "loginCnt":0,
    //        "_id":"5cebfa67c7e8eb170b6aaa0d",
    //        "__v":0
    //     },
    //     "__v":0
    //  }
     
    Article.find(param)
        .populate('_user', '-pwd') // 작성자에 대한 글이 몇개인지 등에 대한 추가적인 정보를 가져올 수 있다.
        .then(result => {
            res.send({ success: true, d: result, token: req.token });
        })
        .catch(e => {
            res.send({ success: false, msg: e.message });
        });
});

router.get('/read/:_id', (req, res, next) => {
    const _id = req.params._id
  
    Article.findById(_id).select('content')
      .then(r => {
        res.send({ success: true, d: r, token: req.token })
      })
      .catch(e => {
        res.send({ success: false, msg: e.message })
      })
  })

Article.deleteMany({}).then(r => console.log(r));

// 게시판에 쓸 자격이 있는지 판단 후에 자격이 있다면 게시물을 작성한다.
router.post('/:_board', (req, res, next) => {
    const { _board } = req.params;
    if (!_board) return res.send({ success: false, msg: '보드를 지정해 주세요' });
    const { title, content } = req.body;
    console.log('_board => ', _board)
    Board.findOne({ _id: _board })
        .then(result => {
            if (!result) throw new Error('게시판이 없습니다.');
            if (result.level < req.user.level) throw new Error('권한이 없음');
            const article = {
                title: title,
                content,
                _board,
                ip: req.ip,
                _user: req.user._id ? req.user._id : null // _id가 없으면 손님이므로 null
            };

            return Article.create(article);
        })
        .then(result => {
            res.send({ success: true, d: result, token: req.token });
        })
        .catch(e => {
            res.send({ success: false, msg: e.message });
        });
});

router.put('/:_id', (req, res, next) => {
    if (!req.user._id) return res.send({ success: false, msg: '손님은 수정이 안됩니다.' });
    const { _id } = req.params;

    Article.findById(_id)
        .then(result => {
            if (!result) throw new Error('게시물 없음');
            if (result._user.toString() !== req.user._id) throw new Error('본인 작성 게시물만 삭제됩니다.');
            // find -> update -> new: true로 갱신된 것을 반환
            return Article.findOneAndUpdate({ _id }, { $set: req.body }, { new: true }); // find한 결과에서 갱싱된 것을 return하기 위한 옵션
        })
        .then(result => {
            res.send({ success: true, d: result, token: req.token });
        })
        .catch(e => {
            res.send({ success: false, msg: e.message });
        });
});

router.delete('/:_id', (req, res, next) => {
    if (!req.user._id) return res.send({ success: false, msg: '손님은 삭제가 안됩니다.' });
    const { _id } = req.params;

    Article.findById(_id).populate('_user', 'level')
        .then(result => {
            if (!result) throw new Error('게시물 없음');
            if (result._user) {
                if (result._user_id.toString() !== req.user._id) {
                    if (result._user.level < req.user.level) {
                        throw new Error('권한이 없습니다.');
                    }
                }
            }

            return Article.deleteOne({ _id });
        })
        .then(result => {
            res.send({ success: true, token: req.token });
        })
        .catch(e => {
            res.send({ success: false, msg: e.message });
        });
});

router.all('*', function (req, res, next) {
    next(createError(404, '그런 api 없어'));
});

module.exports = router;
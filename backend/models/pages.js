
const mongoose = require('mongoose');
const config = require('../../config');

mongoose.set('useCreateIndex', true);

// 유저의 level과 페이지 level을 매칭시켜서 보여주어야 하기 때문에 Page 모델을 추가 
const pageSchema = new mongoose.Schema({
    name: { type: String, default: '', index: true },
    loginCnt: { type: Number, default: 0 },
    level: { type: Number, default: 0 }
})

const Page = mongoose.model('Page', pageSchema)

module.exports = Page;

const mongoose = require('mongoose');
const config = require('../../config');

mongoose.set('useCreateIndex', true);

// 유저의 level과 페이지 level을 매칭시켜서 보여주어야 하기 때문에 Page 모델을 추가 
const siteSchema = new mongoose.Schema({
    title: { type: String, default: '등록 필요' },
    copyright: { type: String, default: '등록 필요' },
    dark: { type: Boolean, default: false }
})

const Site = mongoose.model('Site', siteSchema);

Site.findOne()
    .then(result => {
        if (!result) return Site.create({ title: '등록 필요함' });
        return Promise.resolve(result);
    })
    .then(result => {
        if(result) console.log(result.title + ' created!!!');
    })
    .catch(e => console.error(e.message));


module.exports = Site;
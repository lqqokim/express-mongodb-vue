
const mongoose = require('mongoose');
const config = require('../../config');
const crypto = require('crypto');

mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    id: { type: String, default: '', unique: true, index: true },
    pwd: { type: String, default: '' },
    name: { type: String, default: '' },
    age: { type: Number, default: 1 },
    retry: { type: Number, default: 0 },
    level: { type: Number, default: 2 },
    loginCnt: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);
// User.collection.dropIndexes({ name: 1 })

const createUser = (user) => {
    if (!user) return User.create({ id: config.admin.id, pwd: config.admin.pwd, name: config.admin.name, level: 0 })
    return null // Promise.resolve 처리 안해도 then은 기본적으로 Promise 값을 반환
}

User.findOne({ id: config.admin.id })
    .then(user => {
        // return createUser(user);
        return createUser(user);
    })
    .then(result => {
        console.log(result);
        if (!result) Promise.resolve(null);
        if (result.pwd !== config.admin.pwd) return Promise.resolve(null);
        if (result) console.log(`admin:${result.id} created!!!`, result);

        const pwd = crypto.scryptSync(result.pwd, result._id.toString(), 64, { N: 1024 }).toString('hex');
        return User.updateOne({ _id: result._id }, { $set: { pwd } });
    })
    .then(result => {
        if (result) console.log('password changed!');
    })
    .catch(err => {
        // console.error(err.message);
    })

module.exports = User;
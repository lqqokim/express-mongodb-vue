
const mongoose = require('mongoose');
const config = require('../../config');

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
    if(!user) return User.create({ id: config.admin.id, pwd: config.admin.pwd, name: config.admin.name })
    return null
}

User.findOne({ id: config.admin.id })
    .then(user => {
       return createUser(user);
    }).then(user => {
        if(user) console.log(`admin:${user.id} created!!!`);
    }).catch(err => {
        console.error(err.message);
    })

// User.create(users).then(res => {
//       console.log(res);
//   }).catch(err => {
//       console.log(err);
//   })

module.exports = User;
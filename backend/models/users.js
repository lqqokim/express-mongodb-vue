
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      default: '',
      unique: true, // 동일한 name의 값 insert시에 error
      index: true // 검색 속도 향상
    },
    age: {
      type: Number,
      default: 1
    }
  });
  
  const User = mongoose.model('User', userSchema);
  const users = [
    {
        name: 'Vue',
        age: 20
    },
    {
        name: 'React',
        age: 30
    },
    {
        name: 'Angular',
        age: 25
    }
];

// User.create(users).then(res => {
//       console.log(res);
//   }).catch(err => {
//       console.log(err);
//   })

  module.exports = User;
const mongoose = require('mongoose');
const config = require('../../config');

mongoose.set('useCreateIndex', true);
const boardSchema = new mongoose.Schema({
    name: { type: String, default: '', index: true, unique: true },
    level: { type: Number, default: 0 },
    rmk: { type: String, default: '' }
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
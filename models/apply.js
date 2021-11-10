const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applySchema = new Schema({
    name: String,
    email: String,
    phoneNo: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Apply', applySchema);
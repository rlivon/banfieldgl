const {Schema, model } = require('mongoose');

const UserLog = new Schema({
    fullname: String,
    username: String,
    password: String,
});

module.exports = model('UserLog', UserLog);
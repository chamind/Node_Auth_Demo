const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
  userName: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User_Auth', userSchema);
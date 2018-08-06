var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({ //帳號資訊
    name:String,
	account:String,
	password:String
	});
var usersModel = mongoose.model('users',userSchema); //users模型

module.exports = usersModel
var mongoose = require('mongoose');
var oftenSchema = new mongoose.Schema({ //帳號資訊
	userid:String,
	command:Array	
	});
var oftensModel = mongoose.model('oftens',oftenSchema); //users模型

module.exports = oftensModel
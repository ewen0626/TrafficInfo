var mongoose = require('mongoose');
var logSchema = new mongoose.Schema({ //帳號資訊
    userid:String,
	command:String,
	Time:String
	});
var logsModel = mongoose.model('logs',logSchema); //users模型

module.exports = logsModel
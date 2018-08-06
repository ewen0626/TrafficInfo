const express = require('express')
const router = express.Router()

var userModel = require('../models/usersModel.js');
var json = {
	"messages": [
		{"text": "Welcome to the Chatfuel Rockets!"}
	]
}
router.get('/', function (req, res, next) {
	console.log("首頁");
	userModel.find(function(err, data){
		console.log(data);
	});
	res.send(json);
	
})

module.exports = router
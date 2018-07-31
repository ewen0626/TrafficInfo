const express = require('express')
const router = express.Router()
var json = {
	"messages": [
		{"text": "Welcome to the Chatfuel Rockets!"}
	]
}
router.get('/', function (req, res, next) {
	console.log("首頁");
	res.send(json);
	
})

module.exports = router
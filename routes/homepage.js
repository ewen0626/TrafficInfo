const express = require('express')
const router = express.Router()
router.get('/', function (req, res, next) {
	console.log("首頁");
	res.send("HomePage");
	
})

module.exports = router
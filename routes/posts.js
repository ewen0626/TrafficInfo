const express = require('express')
const router = express.Router()



router.get('/', function (req, res, next) {
	console.log("路由測試");
	res.send("route test");
})

module.exports = router
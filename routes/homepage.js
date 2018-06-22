const express = require('express')
const router = express.Router()
var ubike = require('../function/ubike_search.js');

router.get('/', function (req, res, next) {
	var station = req.query.station;
	console.log("首頁");
	res.send("HomePage");
	//console.log(ubike.getubike(station));
})

module.exports = router
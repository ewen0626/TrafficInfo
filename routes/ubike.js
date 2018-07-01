const express = require('express')
const router = express.Router()
var ubike = require('../function/ubike_search.js');


router.get('/', function (req, res, next) {
	var station = req.query.station;
	//console.log("路由測試");
	//console.log(ubike.getubike(station));
	var data = ubike.getubike(station)
	
	res.json(data);
	
})


module.exports = router
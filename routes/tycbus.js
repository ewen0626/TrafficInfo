const express = require('express')
const router = express.Router()
var tycbus = require('../function/tycbus_search.js');


router.get('/', function (req, res, next) {
	var RouteName = req.query.RouteName;
	RouteName = RouteName.toString();
	console.log('擷取BUS中');
	var data = tycbus.getBusData(RouteName)
	console.log(data)
	res.json(data)
	console.log('擷取BUS完成')
})


module.exports = router
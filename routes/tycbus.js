const express = require('express')
const router = express.Router()
var tycbus = require('../function/tycbus_search.js');


router.get('/', function (req, res, next) {
	var RouteName = req.query.RouteName;
	console.log('擷取BUS中')
	var data = tycbus.getBusData(RouteName)
	
	res.json(data)
})


module.exports = router
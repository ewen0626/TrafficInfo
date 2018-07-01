const express = require('express')
const router = express.Router()
var train = require('../function/train_search.js');


router.get('/', function (req, res, next) {
	var StartStation = req.query.StartStation;
	var EndStation = req.query.EndStation;
	var data = train.getTrainTime(StartStation,EndStation)
	res.json(data)
})


module.exports = router
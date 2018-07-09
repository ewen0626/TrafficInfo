//var http = require("http");
var fs = require("fs"); 
var busdata = {};
var tybus = require('./tybus.json');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var name = "5617"

function BusStation(name){ //以路線之名稱取得路線之ID
	var data = tybus.BusDynInfo.BusInfo.Route
	name = name.toString();
	var BusStation =data.map(function(item, index) { //抓取該路線之索引值
		//console.log(item['-nameZh'])
		return item['-nameZh']
	}).indexOf(name);
	//console.log(BusStation);
	if (BusStation == -1){
		return undefined
	}
	return  tybus.BusDynInfo.BusInfo.Route[BusStation]["-ID"] //回傳該路線的路線ID
	
}
//console.log(BusStation(name))

exports.getBusData = function(name){
	//console.log("執行到這");
	var busurl = 'http://apidata.tycg.gov.tw/OPD-io/bus4/GetEstimateTime.xml?routeIds=';
	if(name == undefined){
		return "路線輸入錯誤"
	}else{
		name.toString();
	}
	var request = require('sync-request');
	if (BusStation(name) == undefined){
		return "路線輸入錯誤"
	}else{
		busurl = busurl + BusStation(name);
	}
	
	var res = request('GET', busurl);
	var BusData ;
	//console.log("res = " + res.getBody('utf-8'))
	if(res.statusCode == 200){
		//console.log(res.getBody('utf-8'));
		parser.parseString(res.getBody('utf-8'), function (err, result) {
			//console.log(result.BusDynInfo.BusInfo[0].Route[0].EstimateTime);
			BusData = result.BusDynInfo.BusInfo[0].Route[0].EstimateTime; 
		});
		return BusData
	}else{
		return '擷取錯誤'
	}
}
//console.log(getBusData(name))
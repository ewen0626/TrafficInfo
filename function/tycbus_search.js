//var http = require("http");
var fs = require("fs"); 
var busurl = 'http://apidata.tycg.gov.tw/OPD-io/bus4/GetEstimateTime.xml?routeIds=';
var busdata = {};
var tybus = require('./tybus.json');
var rp = require('request-promise');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var name = "1"

function BusStation(name){ //以路線之名稱取得路線之ID
	var data = tybus.BusDynInfo.BusInfo.Route
	name = name.toString();
	var BusStation =data.map(function(item, index) { //抓取該路線之索引值
		//console.log(item['-nameZh'])
		return item['-nameZh']
	}).indexOf(name);
	//console.log(BusStation);
	return tybus.BusDynInfo.BusInfo.Route[BusStation]["-ID"] //回傳該路線的路線ID
	
}
//console.log(BusStation(name))



/* function getBusData (name){
	busurl = busurl + BusStation(name);
	http.get(busurl, function(response){
		var data = '';
			// response event 'data' 當 data 陸續接收的時候，用一個變數累加它。
		response.on('data', function(chunk){
			data += chunk;
		});
			// response event 'end' 當接收 data 結束的時候。
		response.on('end', function(){
			//console.log(data);
			parser.parseString(data, function (err, result) {
				return result.BusDynInfo.BusInfo[0].Route[0].EstimateTime
			});
		});
	}).on('error', function(e){ // http get 錯誤時
		  console.log("error: ", e);
	});
		
}
console.log(getBusData(name))*/

/*function getBusData (name){
	busurl = busurl + BusStation(name);
rp(busurl).promise().bind(this)
    .then(function (data) {
		parser.parseString(data, function (err, result) {
			console.log(result.BusDynInfo.BusInfo[0].Route[0].EstimateTime)
			return result.BusDynInfo.BusInfo[0].Route[0].EstimateTime
		});      
    })
    .catch(function (err) {
        // Crawling failed...
		console.log('failed')
    });
console.log("123");
};
console.log(getBusData(name))*/

function test(){
	let test = 'I am test';
	let request = require('request');
	// sync
	new Promise((resolve, reject) => {
		request({
			url: 'https://github.com',
			method: 'get'
		}, (err, res, body) => {
			if (res && res.statusCode === 200) {
				resolve(res.statusCode + ' ok!');
				console.log('123')
			} else {
				reject(' error - -');
			}
		});
	}).then(result => {
		test = result;
		
		console.log("outside request: " + test);
		return test
	}).catch(err => {
		console.log("error: " + err)
	})
}
console.log('321');
console.log(test());


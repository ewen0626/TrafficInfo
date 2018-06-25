var http = require("http");
var fs = require("fs"); 
var busurl = 'http://apidata.tycg.gov.tw/OPD-io/bus4/GetEstimateTime.xml?routeIds=3010';
var busdata = {};
var tybus = require('./tybus.json');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var name = "1A"

function BusStation(name){ //以路線之名稱取得路線之ID
	var data = tybus.BusDynInfo.BusInfo.Route
	name = name.toString();
	var BusStation =data.map(function(item, index) { //抓取起站之索引值
		//console.log(item['-nameZh'])
		return item['-nameZh']
	}).indexOf(name);
	console.log(BusStation);	
}
BusStation(name)



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
			//console.log(result.BusDynInfo.BusInfo[0].Route[0].EstimateTime[0].$.StopName);
			//console.log('Done');
		});
	});
}).on('error', function(e){ // http get 錯誤時
	  console.log("error: ", e);
});

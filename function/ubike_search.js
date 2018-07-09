var http = require("http");
var fs = require("fs"); 
var TycUbikeurl = 'http://data.tycg.gov.tw/api/v1/rest/datastore/a1b4714b-3b75-4ff8-a8f2-cc377e4eaa0f?format=json&limit=2000';
var NewTaipeiUbikeurl = "http://data.ntpc.gov.tw/api/v1/rest/datastore/382000000A-000352-001";
var TaipeiUbikeurl = "http://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json";
var ubikedata = {};
exports.getubikedata = function(){	//開機時先擷取一次
	ubikedata = {};
	http.get(TycUbikeurl, function(response){
		var data = '';
		// response event 'data' 當 data 陸續接收的時候，用一個變數累加它。
		response.on('data', function(chunk){
			data += chunk;
		});
		// response event 'end' 當接收 data 結束的時候。
		response.on('end', function(){
			data = JSON.parse(data);
			data.result.records.forEach(function(val){ //將各筆資料整理
				var index = val.sna //KEY  = 各站名
				ubikedata[index] = val
				
			})		
			console.log('桃園ubike資料擷取完成');
			//console.log(ubikedata)
		});
	}).on('error', function(e){ // http get 錯誤時
		  console.log("error: ", e);
	});
	
	
	http.get(NewTaipeiUbikeurl, function(response){
		var data = '';
		// response event 'data' 當 data 陸續接收的時候，用一個變數累加它。
		response.on('data', function(chunk){
			data += chunk;
		});
		// response event 'end' 當接收 data 結束的時候。
		response.on('end', function(){
			data = JSON.parse(data);
			data.result.records.forEach(function(val){ //將各筆資料整理
				var index = val.sna //KEY  = 各站名
				ubikedata[index] = val
				
			})		
			console.log('新北ubike資料擷取完成');
			//console.log(ubikedata)
		});
	}).on('error', function(e){ // http get 錯誤時
		  console.log("error: ", e);
	});
	
	http.get(TaipeiUbikeurl, function(response){
		var data = '';
		// response event 'data' 當 data 陸續接收的時候，用一個變數累加它。
		response.on('data', function(chunk){
			data += chunk;
		});
		// response event 'end' 當接收 data 結束的時候。
		response.on('end', function(){
			data = JSON.parse(data);
			var DataArray = Object.keys(data.retVal);
			DataArray.forEach(function(val){
				var index = data.retVal[val].sna
				ubikedata[index] = data.retVal[val];
			})
			console.log('台北ubike資料擷取完成');
			//console.log(ubikedata)
		});
	}).on('error', function(e){ // http get 錯誤時
		  console.log("error: ", e);
	});
	setTimeout(function(){
	//console.log(ubikedata)
},5000)
	
}
exports.getubike = function(station){ //回傳ubike站點資料
	//station = station.toString();
	//console.log(station)
	return ubikedata[station]
}
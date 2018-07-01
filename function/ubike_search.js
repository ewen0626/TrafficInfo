var http = require("http");
var fs = require("fs"); 
var ubikeurl = 'http://data.tycg.gov.tw/api/v1/rest/datastore/a1b4714b-3b75-4ff8-a8f2-cc377e4eaa0f?format=json&limit=199';
var ubikedata = {};
exports.getubikedata = function(){	//開機時先擷取一次
	http.get(ubikeurl, function(response){
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
			console.log('ubike資料擷取完成');
		});
	}).on('error', function(e){ // http get 錯誤時
		  console.log("error: ", e);
	});
	
}
exports.getubike = function(station){ //回傳ubike站點資料
	return ubikedata[station]
}

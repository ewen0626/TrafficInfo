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
			if(data.indexOf('"success":true')!= -1){
			data = JSON.parse(data);
			data.result.records.forEach(function(val){ //將各筆資料整理
				var index = val.sna //KEY  = 各站名
				ubikedata[index] = val
				
			})		
			console.log('桃園ubike資料擷取完成');
			//console.log(ubikedata)
			}
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
			if(data.indexOf('"success":true')!= -1){
			data = JSON.parse(data);
			data.result.records.forEach(function(val){ //將各筆資料整理
				var index = val.sna //KEY  = 各站名
				ubikedata[index] = val
				
			})		
			console.log('新北ubike資料擷取完成');
			//console.log(ubikedata)
			}
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
			if(data.indexOf('"retCode":1')!= -1){
			data = JSON.parse(data);
			var DataArray = Object.keys(data.retVal);
			DataArray.forEach(function(val){
				var index = data.retVal[val].sna
				ubikedata[index] = data.retVal[val];
			})
			console.log('台北ubike資料擷取完成');
			//console.log(ubikedata)
			}
		});
	}).on('error', function(e){ // http get 錯誤時
		  console.log("error: ", e);
	});
	setTimeout(function(){
		//console.log(ubikedata)
		//getUbikeDistance()
	},5000)
	
}
function GetDistance(lat1,lon1,lat2,lon2) {
	 var R = 6371; // km (change this constant to get miles)
	 var dLat = (lat2-lat1) * Math.PI / 180;
	 var dLon = (lon2-lon1) * Math.PI / 180;
	 var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	  Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
	  Math.sin(dLon/2) * Math.sin(dLon/2);
	 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	 var d = R * c;
	 //if (d>1) return Math.round(d)+"km";
	 //else if (d<=1) 
	 return Math.round(d*1000);
}

exports.getubike = function(station){ //回傳ubike站點資料
	//station = station.toString();
	//console.log(station)
	return ubikedata[station]
}

exports.getUbikeDistance = function (lat,lng){
	//var lat1 = 24.950692;
	//var lon1 = 121.216686;
	var reply = '附近ubike站點如下:\n';
	var UbikeDataArray = Object.keys(ubikedata);
	UbikeDataArray.forEach(function(val){
		var index = ubikedata[val].sna
		var distance = GetDistance(lat,lng,ubikedata[index].lat,ubikedata[index].lng)
		if (distance <=500){
			//console.log(val)
			reply += val + "\n"
		}
	});
	return reply;
}

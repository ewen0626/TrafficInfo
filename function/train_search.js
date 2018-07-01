/*
分析步驟:
1.過濾未停起站之車次
2.過濾未停迄站之車次
3.查詢起站、迄站索引以判斷南下北上
4.將車次依照時間排序
5.判斷時間戳，排除已過之班次
*/
var traindata = require('./20180622.json');
var TrainStation  = require('./TrainStation.js');
var arr = traindata.TrainInfos;
exports.getTrainTime = function (StartStation,EndStation){
	d = new Date();
	utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	var time=new Date(utc + (3600000*8));
	var timeHour=time.getHours(); 
	var timeMinutes=time.getMinutes(); 
	var timeMonth=time.getMonth()+1; 
	var timeDate=time.getDate();
	var timeYear = time.getYear();	
	StartStation = TrainStation.StationCode(StartStation);
	EndStation = TrainStation.StationCode(EndStation);
	StartStation = StartStation.toString();
	EndStation =  EndStation.toString();
	var arr2 = arr.filter(function(value,index,array){ //篩選起站
		var data = value.TimeInfos.some(function(value){
			return value.Station == StartStation //1011 = 板橋
		})
		if (data == true)
		{
			return value
		}
	})

	var arr3 = arr2.filter(function(value,index,array){ //篩選迄站
		var data = value.TimeInfos.some(function(value){
			return value.Station == EndStation //1008 = 台北  1025 = 新竹
		})
		if (data == true)
		{
			return value
		}
	})


	var arr4 = arr3.filter(function(value,index,array){ //判斷南下北上
		var StartStationIndex =value.TimeInfos.map(function(item, index) { //抓取起站之索引值
			//console.log(item.Station)
			return item.Station
		}).indexOf(StartStation); 
		
		var EndStationIndex =value.TimeInfos.map(function(item, index) {  //抓取迄站索引值
			//console.log(item.Station)
			return item.Station
		}).indexOf(EndStation);
		if (StartStationIndex < EndStationIndex) //如起站之索引大於迄站之索引，表示車次為反向車輛
		{
			var StartStation_data = value.TimeInfos[StartStationIndex];
			var EndStation_data = value.TimeInfos[EndStationIndex];
			value.TimeInfos.length = 2;
			value.TimeInfos[0] = StartStation_data;  //將其餘站資料刪掉，留下起站[0]迄站[1]
			value.TimeInfos[1] = EndStation_data;
			return value
		}
	})
	var arr5 = arr4.sort(function(a,b){ //排序
		/*var StartStation_a =a.TimeInfos.map(function(item, index) { //抓取起站之索引值
			return item.Station
		}).indexOf('1011');

		var StartStation_b =b.TimeInfos.map(function(item, index) { //抓取起站之索引值

			return item.Station
		}).indexOf('1011');*/

		return a.TimeInfos[0].DepTime > b.TimeInfos[0].DepTime ? 1: -1;
		
	})
	var nowtime = timeYear+1900+"/"+ timeMonth +"/" + timeDate + " " + timeHour + ":" + timeMinutes;
	console.log(nowtime)
	var today = timeYear+1900+"/"+ timeMonth +"/" + timeDate
	console.log("NOWTIMETAG = "+(Date.parse(nowtime)).valueOf())
	var final = arr5.filter(function(value,index,array){
		var Traintimetag = today + " " + value.TimeInfos[0].DepTime;
		Traintimetag = Date.parse(Traintimetag).valueOf();
		var nowtimetag = Date.parse(nowtime).valueOf();
		if (Traintimetag > nowtimetag){
			return value 
		}
		else{
			return false
		}	
	})
	
	final = final.map(function(value){
		value.CarClass = TrainStation.TrainClass(value.CarClass)
		return value
	})
	//console.log(final);
	return final
}
//console.log(TrainStation.TrainClass('1120'))
//getTrainTime(1011,1025)
//console.log(TrainStation.TrainClass(1120))
//console.log(TrainStation.StationCode('基隆'))
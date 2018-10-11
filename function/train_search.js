/*
分析步驟:
1.過濾未停起站之車次
2.過濾未停迄站之車次
3.查詢起站、迄站索引以判斷南下北上
4.將車次依照時間排序
5.判斷時間戳，排除已過之班次
*/

module.exports= function (StartStation,EndStation,SearchTime){
	var TrainStation  = require('./TrainStation.js');
	var traindata = require('./20181012.json');
	var reload = require('require-reload')(require),
    traindata = reload('./20181012.json');
	var Time = require('./Time.js');
	arr = null;
	try {
		//console.log("RELOADED")
		traindata = reload('./20180622.json');
	} catch (e) {
		//if this threw an error, the api variable is still set to the old, working version
		console.error("Failed to reload api.js! Error: ", e);
	}
	var arr =  traindata.TrainInfos;
	console.log("ARR = " + arr);
	StartStation = TrainStation.StationCode(StartStation);
	EndStation = TrainStation.StationCode(EndStation);
	if (StartStation === undefined || EndStation === undefined){ //判斷車站是否輸入正確
		console.log("車站輸入錯誤");
		return "車站名稱輸入錯誤"
	}else{
	//	console.log("SEAStartStation="+StartStation)
		//console.log("SEAEndStation="+EndStation)
		StartStation = StartStation.toString();
		EndStation =  EndStation.toString();
	}
	var arr = arr.filter(function(value,index,array){ //篩選起站
		var data = value.TimeInfos.some(function(value){
			return value.Station == StartStation //1011 = 板橋
		})
		if (data == true)
		{
			return value
		}
	})
	//console.log('arr2 = ' + arr2)
	var arr = arr.filter(function(value,index,array){ //篩選迄站
		var data = value.TimeInfos.some(function(value){
			return value.Station == EndStation //1008 = 台北  1025 = 新竹
		})
		if (data == true)
		{
			return value
		}
	})
	//console.log('arr3 = ' + arr3)

	var arr = arr.filter(function(value,index,array){ //判斷南下北上
		var StartStationIndex =value.TimeInfos.map(function(item, index) { //抓取起站之索引值
			//console.log(item.Station)
			return item.Station
		}).indexOf(StartStation); 
		//console.log(StartStationIndex.indexOf(StartStation));
		//console.log("StartStationIndex = "+typeof(StartStationIndex)  + StartStationIndex )
		var EndStationIndex =value.TimeInfos.map(function(item, index) {  //抓取迄站索引值
			//console.log(item.Station)
			return item.Station
		}).indexOf(EndStation);
		//console.log("EndStationIndex = "+typeof(EndStationIndex)  + EndStationIndex )
		if (StartStationIndex < EndStationIndex) //如起站之索引大於迄站之索引，表示車次為反向車輛
		{
			StartStationIndex = Number(StartStationIndex);
			EndStationIndex = Number(EndStationIndex);
			var StartStation_data = value.TimeInfos[StartStationIndex];
			//console.log("StartStation_data = " + StartStation_data)
			var EndStation_data = value.TimeInfos[EndStationIndex];
			//console.log("EndStation_data = " + EndStation_data)
			value.TimeInfos.length = 2;
			value.TimeInfos[0] = StartStation_data;  //將其餘站資料刪掉，留下起站[0]迄站[1]
			value.TimeInfos[1] = EndStation_data;
			return value
		}else{
			return false 
		}
	})
	//console.log('arr3_ = ' +arr3)
	//console.log('arr4 = ' + arr4)
	var arr = arr.sort(function(a,b){ //排序
		var StartStation_a =a.TimeInfos.map(function(item, index) { //抓取起站之索引值
			return item.Station
		}).indexOf(StartStation);

		var StartStation_b =b.TimeInfos.map(function(item, index) { //抓取起站之索引值

			return item.Station
		}).indexOf(EndStation);

		return a.TimeInfos[0].DepTime > b.TimeInfos[0].DepTime ? 1: -1;
		
	});
	var nowtime = Time.TimeYear+ "/"+ Time.TimeMonth +"/" + Time.TimeDate + " " + Time.TimeHour + ":" + Time.TimeMinutes;
	var today = Time.TimeYear+ "/"+ Time.TimeMonth +"/" + Time.TimeDate
	//console.log("NOWTIMETAG = "+(Date.parse(nowtime)).valueOf())
	arr = arr.filter(function(value,index,array){
		var Traintimetag = today + " " + value.TimeInfos[0].DepTime;
		Traintimetag = Date.parse(Traintimetag).valueOf();
		if(SearchTime !=false){
			var nowtimetag = Date.parse(today + " " +SearchTime).valueOf();
			console.log(today + " " +SearchTime)
		}else{
			var nowtimetag = Date.parse(nowtime).valueOf();
		}

		if (Traintimetag > nowtimetag){
			return value 
		}
		else{
			return false
		}	
	})
	//console.log(final)
	/*final = final.map(function(value){
		var CarClass = value.CarClass;
		value.CarClass = TrainStation.TrainClass(CarClass)
		return value
	})*/
	//console.log(final);
	//console.log("final = "+ final);
	//console.log(typeof(final))
	/*arr = '';
	arr2 = '';
	arr3 = '';
	arr4 = '';
	arr5 = '';*/
	return arr
}
//console.log(TrainStation.TrainClass('1120'))
//getTrainTime(1011,1025)
//console.log(TrainStation.TrainClass(1120))
//console.log(TrainStation.StationCode('基隆'))
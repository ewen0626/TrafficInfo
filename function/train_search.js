var traindata = require('./20180622.json');
var arr = traindata.TrainInfos;
var time = new Date();
var arr2 = arr.filter(function(value,index,array){ //篩選起站


	var data = value.TimeInfos.some(function(value){
		return value.Station == 1011 //1011 = 板橋
	})
	if (data == true)
	{
		return value
	}
})
//console.log(arr2.length)

var arr3 = arr2.filter(function(value,index,array){ //篩選迄站
	var data = value.TimeInfos.some(function(value){
		return value.Station == 1025 //1008 = 台北 
	})
	if (data == true)
	{
		return value
	}
})
//console.log(arr3.length)

var arr4 = arr3.filter(function(value,index,array){ //判斷南下北上
	var StartStation =value.TimeInfos.map(function(item, index) { //抓取起站之索引值
		//console.log(item.Station)
		return item.Station
	}).indexOf('1011');
	var EndStation =value.TimeInfos.map(function(item, index) {  //抓取迄站索引值
		//console.log(item.Station)
		return item.Station
	}).indexOf('1025');
	if (StartStation < EndStation) //如啟站之索引大於迄站之索引，表示車次為反向車輛
	{
		return value
	}
})
//console.log(arr4.length)
//console.log(arr4);

var arr5 = arr4.sort(function(a,b){
	var StartStation_a =a.TimeInfos.map(function(item, index) { //抓取起站之索引值
		return item.Station
	}).indexOf('1011');

	var StartStation_b =b.TimeInfos.map(function(item, index) { //抓取起站之索引值

		return item.Station
	}).indexOf('1011');

	return a.TimeInfos[StartStation_a].DepTime > b.TimeInfos[StartStation_b].DepTime ? 1: -1;
	
})
arr5.forEach(function(index){
	console.log(index.TimeInfos[0].DepTime)
})
//console.log(arr5)
var timeHour=time.getHours(); 
var timeMinutes=time.getMinutes(); 
var timeMonth=time.getMonth()+1; 
var timeDate=time.getDate();
var timeYear = time.getYear();
var nowtime = timeYear+1900+"/"+ timeMonth +"/" + timeDate + " " + timeHour + ":" + timeMinutes;
console.log(timeYear+1900+"/"+ timeMonth +"/" + timeDate + " " + timeHour + ":" + timeMinutes)
var ScheduleDate = nowtime, CurrentDate = "2016-06-02 00:00:00";
console.log((Date.parse(ScheduleDate)).valueOf())
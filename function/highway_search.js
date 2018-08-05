//var http = require("http");
var fs = require("fs");
var cheerio = require("cheerio");
var request = require('sync-request');
var station = {
	南港:'2f940836-cedc-41ef-8e28-c2336ac8fe68',
	台北:'977abb69-413a-4ccf-a109-0272c24fd490',
	板橋:'e6e26e66-7dc1-458f-b2f3-71ce65fdc95f',
	桃園:'fbd828d8-b1da-4b06-a3bd-680cdca4d2cd',
	新竹:'a7a04c89-900b-4798-95a3-c01c455622f4',
	苗栗:'e8fc2123-2aaf-46ff-ad79-51d4002a1ef3',
	台中:'3301e395-46b8-47aa-aa37-139e15708779',
	彰化:'38b8c40b-aef0-4d66-b257-da96ec51620e',
	雲林:'5f4c7bb0-c676-4e39-8d3c-f12fc188ee5f',
	嘉義:'60831846-f0e4-47f6-9b5b-46323ebdcef7',
	台南:'9c5ac6ca-ec89-48f8-aab0-41b738cb1814',
	左營:'f2519629-5973-4d08-913b-479cce78a356'
};
//console.log(station["台中s"])
exports.getHighwayData =function (StartStation,EndStation,InputTime){
	console.log("StartStation ="  + StartStation);
	console.log("EndStation="  + EndStation);
	if (station[StartStation] == undefined || station[EndStation] == undefined){
		return false
	}
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	var time=new Date(utc + (3600000*8));
	var time_year = time.getYear()+1900;
	var time_month=time.getMonth()+1;
	var time_day=time.getDate();
	var time_hour=time.getHours();
	var time_minute=time.getMinutes();
	time_year = String(time_year);
	time_month = String(time_month);
	time_day = String(time_day);
	time_hour = String(time_hour);
	time_minute = String(time_minute);
	if(time_month.length==1){
		time_month='0'+time_month;
	}
	if(time_day.length==1){
		time_day='0'+time_day;
	}
	if(time_hour.length==1){
		time_hour='0'+time_hour;
	}
	if(time_minute.length==1){
		time_minute='0'+time_minute;
	}
	console.log("InputTime ="  + InputTime);
	if (InputTime == undefined){
		nowtime = time_hour + ":" + time_minute;
	}else{
		nowtime = InputTime;
	}
	var res = request('POST', 'https://www.thsrc.com.tw/tw/TimeTable/SearchResult', {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
	},
		body:"StartStation=" + station[StartStation] +"&"+ 
		"EndStation=" + station[EndStation] +"&" +
		"SearchDate=" + time_year+"/"+ time_month +"/" + time_day + "&" +
		"SearchTime=" + nowtime + "&" +
		"SearchWay=DepartureInMandarin"
	});
	body  =res.getBody('utf8');
	var $ = cheerio.load(body);
//	var Train = $("[class='column1']").text();
	//var StartTime = $("[class='column3']").text();
	//var ArrTime = $("[class='column4']").text();

	var data = [];
	for (var i =1;i<$("[class='column1']").length;i++){
		Train = $("[class='column1']").eq(i).text();
		StartTime = $("[class='column3']").eq(i).text();
		EndTime = $("[class='column4']").eq(i).text();
		data.push(Object.assign({ Train, StartTime, EndTime}));
		//console.log(data)
	}
	
	return data
}
//console.log(getHighway('台中','桃園'))
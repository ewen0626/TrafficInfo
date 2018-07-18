const express = require('express');


var TaipeiBus = require('../function/TaipeiBus.js');
var ubike = require('../function/ubike_search.js');
var train = require('../function/train_search.js');
var TrainStation  = require('../function/TrainStation.js');
var tycbus = require('../function/tycbus_search.js');
const router = express.Router()
var linebot = require('linebot');
const config = require('../config.json'),
	util = require('util');
	
/*var reload = require('require-reload')(require),
    train = reload('../function/train_search.js');*/
var emoji = require('node-emoji');

var bot = linebot({
    channelId: config.channelId,
    channelSecret: config.channelSecret,
    channelAccessToken: config.channelAccessToken
});
bot.on('message', function(event) {
	d = new Date();
	utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	var time=new Date(utc + (3600000*8));
	var timeHour=time.getHours(); 
	var timeMinutes=time.getMinutes(); 
	var timeMonth=time.getMonth()+1; 
	var timeDate=time.getDate();
	var timeYear = time.getYear();	
	
	if (timeMonth < 10){
		timeMonth = "0" + timeMonth;
	}
	if (timeDate.length < 10){
		timeDate = "0" + timeDate;
	}
	var today = timeYear+1900 + "/" + timeMonth + "/" + timeDate
	console.log(today)
	if (event.message.type = 'text'&& event.message.text!= undefined) {
		var msg = event.message.text;
		//msg_index = msg.indexOf(" ") //抓取指令類型
		console.log(event.message.text);
		command = msg.split(" ")
		switch(command[0]){
			case 'ubike':
				var station = command[1];
				var reply;
				var ubikedata = ubike.getubike(station);
				if (ubikedata !=undefined){
					reply = 
					emoji.get('bike')  + "ubike"+ station +"資訊如下" + "\n" + 
					emoji.get(':mag:') +	"總停車格"+ emoji.get(':arrow_right:') + ubikedata.tot + "\n" +
					emoji.get(':mag:') +	"剩餘車輛"+ emoji.get(':arrow_right:') + ubikedata.sbi + "\n" +
					emoji.get(':mag:') +	"空停車格"+ emoji.get(':arrow_right:') + ubikedata.bemp + "\n" +
					emoji.get(':mag:') +	"更新時間"+ emoji.get(':arrow_right:') + ubikedata.mday
					reply = {
					  "type": "location",
					  "title": reply,
					  "address": ubikedata.ar,
					  "latitude": ubikedata.lat,
					  "longitude": ubikedata.lng
					}					
				}else{
					reply = emoji.get('crossed_swords') + "站點名稱輸入錯誤"
				}
				event.reply(reply);
				break;
			case '火車':
				var StartStation = command[1];
				var EndStation = command[2];
				var limit = Number(command[3]);
				var time = command[4];
				if(isNaN(limit)){ //檢查有沒有輸入LIMIT，若無就預設為3筆資料
					limit = 3;
				}else{
					limit = command[3];
				}
				if (time == undefined){
					time = false;
				}
				var reply = '';
				var traindata =  train(StartStation,EndStation,time)
				console.log("time = " + time)
				console.log("資料 :  " + traindata);
				if (traindata == "車站名稱輸入錯誤"){
					//console.log("1");
					reply = emoji.get('crossed_swords') + "車站輸入錯誤";	
				}else if(traindata == ""){
					reply = emoji.get('crossed_swords') + "無資料";
				}else{
					console.log("資料數量 = "+traindata.length)
					
					limit = (limit>=traindata.length)?traindata.length:limit
					if(limit >= 10){
						for (var i = 0; i<limit; i++){
							reply = reply + 
							'\n' + emoji.get(':train:') + traindata[i].Train + emoji.get(':train2:')+ TrainStation.TrainClass(traindata[i].CarClass) + "\n" + 
							emoji.get('clock2') + traindata[i].TimeInfos[0].DepTime  +  emoji.get(':calendar:') + traindata[i].TimeInfos[1].ArrTime + "\n"		
						}
					}else{
						reply = {
						  "type": "template",
						  "altText": "火車資訊",
						  "template": {
							"type": "carousel",
							"imageAspectRatio": "rectangle",
							"imageSize": "contain",
							"columns": []
						  }
						}
						for (var i = 0; i<limit; i++){
							var imgUrl = ""
							switch (TrainStation.TrainClass(traindata[i].CarClass)){
								case "區間車":
									imgUrl = "https://twtrafficinfo.herokuapp.com/img/區間.png?"
									break;
								case "自強(普悠瑪)":
									imgUrl = "https://twtrafficinfo.herokuapp.com/img/普悠瑪.png?"
									break;
								case "莒光":
									imgUrl = "https://twtrafficinfo.herokuapp.com/img/莒光.png?"
									break;
								case "自強(太魯閣)":
									imgUrl = "https://twtrafficinfo.herokuapp.com/img/太魯閣.png?"
									break;
								case "自強":
									imgUrl = "https://twtrafficinfo.herokuapp.com/img/自強.png?"
									break;
								default:
							}
							var template_columns = {
									"thumbnailImageUrl": imgUrl,
									"imageBackgroundColor": "#FFFFFF",
									"title": emoji.get('clock2') + traindata[i].TimeInfos[0].DepTime +  emoji.get(':calendar:') + traindata[i].TimeInfos[1].ArrTime,
									"text": emoji.get(':train:') + traindata[i].Train + emoji.get(':train2:')+ TrainStation.TrainClass(traindata[i].CarClass),
									"defaultAction": {
										"type": "uri",
										"label": "點到圖片或標題",
										"uri": "http://twtraffic.tra.gov.tw/twrail/mobile/TrainDetail.aspx?searchdate="+today+"&traincode="+traindata[i].Train
									},
									"actions": [
									  {
										"type": "uri",
										"label": "前往台鐵網站",
										"uri": "http://twtraffic.tra.gov.tw/twrail/mobile/home.aspx"
									  },									
									  {
										"type": "message",
										"label": "回主頁面",
										"text": "梓宸帥"
									  }
									]
							}	
							reply.template.columns.push(template_columns);
							//console.log("http://twtraffic.tra.gov.tw/twrail/mobile/TrainDetail.aspx?searchdate="+today+"&traincode="+traindata[i].Train);
						}						
					}
				}
				event.reply(reply);
				break;
			case '梓宸帥':
				//var trainNumber = command[1];
				var reply = "錯 立偉最帥"
				event.reply(reply);
				break;
			case '桃園公車':
				var reply = "";
				var RouteName = command[1];
				var busdata = tycbus.getBusData(RouteName);
				//console.log(busdata);
				if (busdata == "路線輸入錯誤"){
					var reply = emoji.get('crossed_swords')+ busdata
				}else{
					busdata_go =  busdata.filter(function(value){
						return value['$'].GoBack == 1
						//console.log("value  = " + value['$'].GoBack)
					})
					busdata_back = busdata.filter(function(value){
						return value['$'].GoBack == 2					
					})
					reply  = emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+"去程"+emoji.get(':heavy_minus_sign:')+ emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+"\n"
					busdata_go.forEach(function(value){
						//console.log(value['$'].StopName + value['$'].comeTime)
						reply += "  " + value['$'].StopName + value['$'].comeTime + "\n"
					})
					reply  += emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+"回程"+emoji.get(':heavy_minus_sign:')+ emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+"\n"
					busdata_back.forEach(function(value){
						//console.log(value['$'].StopName + value['$'].comeTime)
						reply += "  " +  value['$'].StopName + value['$'].comeTime + "\n"
					})
				}
				event.reply(reply);
				break;
			case '台北公車':
				var reply = '';
				var Route = encodeURI(command[1]);
				var data_go = '';
				var data_back = '';
				TaipeiBus(Route, function(error, data) {
					if (error != null) { /* if error */
						console.log(error);
						return;
					}
					reply  = emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+"去程"+emoji.get(':heavy_minus_sign:')+ emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+"\n"
					data.go.forEach(function(val){
						reply += "  " +  val.name + " " + val.status +"\n"
					});
					reply  += emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+"回程"+emoji.get(':heavy_minus_sign:')+ emoji.get(':heavy_minus_sign:')+emoji.get(':heavy_minus_sign:')+"\n"
					data.back.forEach(function(val){
						reply += "  " +  val.name + " " + val.status + "\n"
					})
					console.log(data);
					event.reply(reply);
				});
				
				break;
			case 'help':
				var reply = emoji.get(':cancer:') +"	" +  emoji.get(':gemini:') +"	" +  emoji.get(':leo:') +"	" +  emoji.get(':capricorn:') +"	" +  emoji.get(':cancer:') + "	" + "\n" +
					emoji.get(':one:') + "ubike指令 " + emoji.get(':arrow_heading_down:') + "\nubike [站點名稱] \n\n" +
					emoji.get(':two:') +"火車指令 " + emoji.get(':arrow_heading_down:') + "\n火車 [起站] [迄站] [數量] \n\n" +
					emoji.get(':three:') +"公車指令 "+ emoji.get(':arrow_heading_down:') + "\n地區+公車 [路線名稱]\n\n" + 
					"支援範圍:\n" + 
					"公車: 桃園、台北地區公車\n" +
					"ubike:桃園、台北、新北地區站點皆可查詢"
					event.reply(reply);
				break;
			case '測試地圖':
				reply = {
				  "type": "imagemap",
				  "baseUrl": "https://gd3.alicdn.com/imgextra/i3/2651530664/TB2W.vTXlnBIuJjSszgXXa7nFXa_!!2651530664.jpg?",
				  "altText": "歡迎使用",
				  "baseSize": {
					"height": 1040,
					"width": 1040
				  },
				  "actions": [
					{
					  "type": "message",
					  "text": "help",
					  "area": {
						"x": 0,
						"y": 0,
						"width": 1040,
						"height": 1040
					  }
					}
				  ]
				}
				event.reply(reply);
				break;
			case "測試樣板" :
				reply = {
				  "type": "template",
				  "altText": "在不支援顯示樣板的地方顯示的文字",
				  "template": {
					"type": "carousel",
					"imageAspectRatio": "rectangle",
					"imageSize": "contain",
					"columns": [
				  ]
				  }
				}
				var template_columns = {
						"thumbnailImageUrl": "https://gd3.alicdn.com/imgextra/i3/2651530664/TB2W.vTXlnBIuJjSszgXXa7nFXa_!!2651530664.jpg?",
						"imageBackgroundColor": "#FFFFFF",
						"title": "更粗的標題",
						"text": "第一組標題",
						"defaultAction": {
							"type": "uri",
							"label": "點到圖片或標題",
							"uri": "http://a4.att.hudong.com/74/78/01300000772135126274786681453.jpg?"
						},
						"actions": [
						  {
							"type": "message",
							"label": "第一個按鈕",
							"text": "1"
						  }
						]
				}
				reply.template.columns.push(template_columns);
				event.reply(reply);
				break;
			default:
				var reply =  emoji.get('u7981') + "無此指令或無資料\n"+
						emoji.get(':star:') + "請輸入 help 以取得指令資訊"
				event.reply(reply);
				
		}
	}
	if (event.message.type == 'location'){
		var lat = event.message.latitude;
		var lng = event.message.longitude;
		var reply  = getUbikeDistance(lat,lng);
		event.reply(reply);
	}
	
});
bot.on('follow',   function (event) {
	reply = {
	  "type": "imagemap",
	  "baseUrl": "https://twtrafficinfo.herokuapp.com/img/welcome.png?",
	  "altText": "歡迎使用",
	  "baseSize": {
		"height": 1040,
		"width": 1040
	  },
	  "actions": [
		{
		  "type": "message",
		  "text": "help",
		  "area": {
			"x": 0,
			"y": 0,
			"width": 1040,
			"height": 1040
		  }
		}
	  ]
	}
	event.reply(reply);
});

const linebotParser = bot.parser();
router.post('/', linebotParser);
module.exports = router
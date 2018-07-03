const express = require('express');

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
    //console.log(event); // 把收到訊息的 event 印出來
	if (event.message.type = 'text'&& event.message.text!= undefined) {
		var msg = event.message.text;
		//msg_index = msg.indexOf(" ") //抓取指令類型
		command = msg.split(" ")
		switch(command[0]){
			case 'ubike':
				var station = command[1];
				var reply;
				var ubikedata = ubike.getubike(station);
				if (ubikedata !=undefined){
					//console.log(ubikedata)
					reply = 
					emoji.get('bike')  + "ubike站點"+ station +"資訊如下" + "\n" + 
					emoji.get(':mag:') +	"總停車格"+ emoji.get(':arrow_right:') + ubikedata.tot + "\n" +
					emoji.get(':mag:') +	"剩餘車輛"+ emoji.get(':arrow_right:') + ubikedata.sbi + "\n" +
					emoji.get(':mag:') +	"空停車格"+ emoji.get(':arrow_right:') + ubikedata.bemp + "\n" +
					emoji.get(':mag:') +	"更新時間"+ emoji.get(':arrow_right:') + ubikedata.mday 						
				}else{
					reply = emoji.get('crossed_swords') + "站點名稱輸入錯誤"
				}
				event.reply(reply);
				break;
			case '火車':
				var StartStation = command[1];
				var EndStation = command[2];
				//console.log("StartStation="+StartStation)
			//	console.log("EndStation="+EndStation)
				var limit = Number(command[3]) ;
				if(isNaN(limit)){ //檢查有沒有輸入LIMIT，若無就預設為3筆資料
					limit = 3;
				}else{
					limit = command[3];
				}
				var reply = '';
				
	/*			try {
					console.log("RELOADED")
					train = reload('../function/train_search.js');
				} catch (e) {
					//if this threw an error, the api variable is still set to the old, working version
					console.error("Failed to reload api.js! Error: ", e);
				}*/
				var traindata =  train(StartStation,EndStation)
				console.log("資料 :  " + traindata);
				if (traindata == "車站名稱輸入錯誤"){
					//console.log("1");
					reply = emoji.get('crossed_swords') + "車站輸入錯誤";	
				}else if(traindata == ""){
					reply = emoji.get('crossed_swords') + "無資料";
				}else{
					console.log("資料數量 = "+traindata.length)
					limit = (limit>=traindata.length)?traindata.length:limit
						for (var i = 0; i<limit; i++){
							reply = reply + 
							'\n' + emoji.get(':train:') + traindata[i].Train + emoji.get(':train2:')+ TrainStation.TrainClass(traindata[i].CarClass) + "\n" + 
							emoji.get('clock2') + traindata[i].TimeInfos[0].DepTime  +  emoji.get(':calendar:') + traindata[i].TimeInfos[1].ArrTime + "\n"		
						}
				}
				event.reply(reply);
				break;
			case '公車':
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
			case 'help':
				var reply = emoji.get(':new:') + emoji.get(':new:') + emoji.get(':new:') + emoji.get(':new:') + emoji.get(':new:') + "\n" +
					emoji.get(':one:') + "ubike指令 " + emoji.get(':arrow_heading_down:') + "\nubike [站點名稱] \n" +
					emoji.get(':two:') +"火車指令 " + emoji.get(':arrow_heading_down:') + "\n火車 [起站] [迄站] [數量] \n" +
					emoji.get(':three:') +"公車指令 "+ emoji.get(':arrow_heading_down:') + "\n公車 [路線名稱]"
					event.reply(reply);
				break;
			case '測試地圖':
				var reply = {
				  "type": "imagemap",
				  "baseUrl": "https://upload.wikimedia.org/wikipedia/zh/thumb/8/8c/Chien_Hsin_University_of_Science_and_Technology_logo.svg/1024px-Chien_Hsin_University_of_Science_and_Technology_logo.svg.png?",
				  "altText": "在不支援顯示影像地圖的地方顯示的文字",
				  "baseSize": {
					"height": 1040,
					"width": 1040
				  },
				  "actions": [
					{
					  "type": "uri",
					  "linkUri": "https://www.kamigo.tw/",
					  "label": "https://www.kamigo.tw/",
					  "area": {
						"x": 0,
						"y": 0,
						"width": 520,
						"height": 1040
					  }
					},
					{
					  "type": "message",
					  "text": "傳送文字",
					  "area": {
						"x": 520,
						"y": 0,
						"width": 520,
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
					"type": "image_carousel",
					"columns": [
					  {
						"imageUrl": "https://upload.wikimedia.org/wikipedia/zh/thumb/8/8c/Chien_Hsin_University_of_Science_and_Technology_logo.svg/1024px-Chien_Hsin_University_of_Science_and_Technology_logo.svg.png?",
						"action": {
						  "type": "message",
						  "label": "第一張圖",
						  "text": "1"
						}
					  },
					  {
						"imageUrl": "https://i.imgur.com/bdXpTZV.jpg?",
						"action": {
						  "type": "message",
						  "label": "第二張圖",
						  "text": "2"
						}
					  },
					  {
						"imageUrl": "https://i.imgur.com/bdXpTZV.jpg?",
						"action": {
						  "type": "message",
						  "label": "第二張圖",
						  "text": "2"
						}
					  },
					  {
						"imageUrl": "https://i.imgur.com/bdXpTZV.jpg?",
						"action": {
						  "type": "message",
						  "label": "第二張圖",
						  "text": "2"
						}
					  },
					  {
						"imageUrl": "https://i.imgur.com/bdXpTZV.jpg?",
						"action": {
						  "type": "message",
						  "label": "第二張圖",
						  "text": "2"
						}
					  },
					  {
						"imageUrl": "https://i.imgur.com/bdXpTZV.jpg?",
						"action": {
						  "type": "message",
						  "label": "第二張圖",
						  "text": "2"
						}
					  },
					  {
						"imageUrl": "https://i.imgur.com/bdXpTZV.jpg?",
						"action": {
						  "type": "message",
						  "label": "第二張圖",
						  "text": "2"
						}
					  },
					  {
						"imageUrl": "https://i.imgur.com/bdXpTZV.jpg?",
						"action": {
						  "type": "message",
						  "label": "第二張圖",
						  "text": "2"
						}
					  }
					]
				  }
				}
				event.reply(reply);
				break;
			default:
				var reply =  emoji.get('u7981') + "無此指令或無資料\n"+
						emoji.get(':star:') + "請輸入 help 已取得指令資訊"
				event.reply(reply);
				
		}
	}
	
});
const linebotParser = bot.parser();
router.post('/', linebotParser);
module.exports = router
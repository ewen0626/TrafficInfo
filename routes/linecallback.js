const express = require('express');

var ubike = require('../function/ubike_search.js');
var train = require('../function/train_search.js');
const router = express.Router()
var linebot = require('linebot');
const config = require('../config.json'),
	util = require('util');
var emoji = require('node-emoji')
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
				var StartStation = command[1]
				var EndStation = command[2]
				var limit = command[3]
				var reply = '';
				if (StartStation == undefined || EndStation ==undefined){
					reply = "車站輸入錯誤";
				}else{
					var traindata = train.getTrainTime(StartStation,EndStation)
					//console.log(traindata)
					for (var i = 0; i<limit; i++){
						reply = reply + 
						"車次" + traindata[i].Train + "車輛種類" + traindata[i].CarClass + "開車時間" + traindata[i].TimeInfos[0].DepTime
					}
				}
				event.reply(reply);
				break;
			case '公車':
			
				break;
			default:
				var reply =  emoji.get('u7981') + "無此指令或無資料"
				event.reply(reply);
				
		}
	}
	
});
const linebotParser = bot.parser();
router.post('/', linebotParser);
module.exports = router
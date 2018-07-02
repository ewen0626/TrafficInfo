const express = require('express');

var ubike = require('../function/ubike_search.js');
var train = require('../function/train_search.js');
var TrainStation  = require('../function/TrainStation.js');
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
				var limit = Number(command[3]) ;
				if(isNaN(limit)){ //檢查有沒有輸入LIMIT，若無就預設為3筆資料
					limit = 3;
				}else{
					limit = command[3];
				}
				var reply = '';
				if (StartStation == undefined || EndStation ==undefined){
					reply =emoji.get('crossed_swords') + "車站輸入錯誤";
				}else{
					var traindata = train.getTrainTime(StartStation,EndStation)
					console.log(traindata);
					if (traindata ==false){
						reply = emoji.get('crossed_swords') + "車站輸入錯誤";
					}else{
						console.log("資料數量 = "+traindata.length)
						limit = (limit>=traindata.length)?traindata.length:limit
							for (var i = 0; i<limit; i++){
								reply = reply + 
								'\n' + emoji.get(':train:') + traindata[i].Train + emoji.get(':train2:')+ TrainStation.TrainClass(traindata[i].CarClass) + "\n" + 
								emoji.get('clock2') + traindata[i].TimeInfos[0].DepTime  +  emoji.get(':calendar:') + traindata[i].TimeInfos[1].ArrTime + "\n"		
							}
					}
				}
				event.reply(reply);
				break;
			case '公車':
				var reply =  emoji.get(':punch:') + "敬請期待"
				event.reply(reply);
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
const express = require('express');

var ubike = require('../function/ubike_search.js');

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
	if (event.message.type = 'text') {
		var msg = event.message.text;
		msg_index = msg.indexOf(" ") //抓取指令類型
		command = msg.substring(0,msg_index)
		switch(command){
			case 'ubike':
				var station = msg.substring(msg_index+1,msg.length)
				//console.log(station)
				var ubikedata = ubike.getubike(station);
				if (ubikedata !=undefined){
					//console.log(ubikedata)
					var reply = 
					emoji.get('bike')  + "ubike站點"+ station +"資訊如下" + "\n" + 
					emoji.get(':mag:') +	"總停車格"+ emoji.get(':arrow_right:') + ubikedata.tot + "\n" +
					emoji.get(':mag:') +	"剩餘車輛"+ emoji.get(':arrow_right:') + ubikedata.sbi + "\n" +
					emoji.get(':mag:') +	"空停車格"+ emoji.get(':arrow_right:') + ubikedata.bemp + "\n" +
					emoji.get(':mag:') +	"更新時間"+ emoji.get(':arrow_right:') + ubikedata.mday 					
					event.reply(reply);
				}else{
					var reply = emoji.get('crossed_swords') + "站點名稱輸入錯誤"
					event.reply(reply);
				}
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
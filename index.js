var express = require('express');
var app     = express();
//var config = require('./config/config.js');
const routes = require('./routes');


var ubike = require('./function/ubike_search.js');
var tycbus = require('./function/tycbus_search.js');
var train = require('./function/train_search.js');


var router = express.Router();// 建立 Router 物件

routes(app) //抓取路由設定

// ---- 啟動伺服器 ----
app.listen(process.env.PORT || 8080,function(){
	console.log("伺服器已啟動 Port : " + 8080);
	ubike.getubikedata() //擷取ubikeData
	//console.log(tycbus.getBusData('1'));
	var a = "中壢"
	var b = "板橋"
	//console.log(train(a,b).length)
	
});

setInterval(function(){
	ubike.getubikedata() //擷取ubikeData
},60000)

setInterval(function(){
	
	var http = require("http");
	var url='http://twtrafficinfo.herokuapp.com/';
	http.get(url, function(response){
    var data1 = '';

    response.on('data1', function(chunk){
        data1 += chunk;
    });
       response.on('end', function(){
      
        data1 = JSON.parse(data1);      
    });
}).on('error', function(e){ // http get 錯誤時
      console.log("error: ", e);
	  
});	
	console.log('GET成功');		
},1080000);

/*StartStationIndex = number10
EndStationIndex = number18
StartStation_data = [object Object]
EndStation_data = [object Object]
StartStationIndex = number20
EndStationIndex = number12
StartStationIndex = number6
EndStationIndex = number4*/
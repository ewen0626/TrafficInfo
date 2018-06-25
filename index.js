var express = require('express');
var app     = express();
var config = require('./config/config.js');
const routes = require('./routes');
var ubike = require('./function/ubike_search.js');
var train = require('./function/train_search.js');
var router = express.Router();// 建立 Router 物件

routes(app) //抓取路由設定

// ---- 啟動伺服器 ----
app.listen(config.config.port,function(){
	console.log("伺服器已啟動 Port : " + config.config.port);
	ubike.getubikedata();
	console.log(train.getTrainTime("板橋","臺北"));
});


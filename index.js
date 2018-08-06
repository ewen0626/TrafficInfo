var express = require('express');
var app     = express();
//var config = require('./config/config.js');
const routes = require('./routes');


var ubike = require('./function/ubike_search.js');
var tycbus = require('./function/tycbus_search.js');
var train = require('./function/train_search.js');
var TaipeiBus = require('./function/TaipeiBus.js');
//var TPBus = require('./function/TPBus.js')

var router = express.Router();// 建立 Router 物件
app.use(express.static('public'));
routes(app) //抓取路由設定

// ---- 啟動伺服器 ----
app.listen(process.env.PORT || 8080,function(){
	console.log("伺服器已啟動 Port : " + 8080);
	
});

setInterval(function(){ //定時取得資料
	ubike.getubikedata() //擷取ubikeData
},60000)

var mongoose = require('mongoose');
mongoose.connect('mongodb://ewen0626:yuda39429@ds213612.mlab.com:13612/heroku_cf8p9gsh');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {									
	/*var users = new usersModel({name:'Zack',phone:'0930082454'});
	users.save();*/
	console.log("Database Connected.");
});

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

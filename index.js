var ubike = require('./function/ubike_search.js');
ubike.getubikedata();

setTimeout(function(){
	
	console.log(ubike.getubike('新勢公園'));
},2000);


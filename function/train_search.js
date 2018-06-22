var traindata = require('./20180622.json');
var arr = traindata.TrainInfos;
/*var arrayIndex = 0;
var arr = traindata.TrainInfos.filter(function(value){
	
	return 0
})*/






var A = 0;
var arr2 = arr.filter(function(value,index,array){ 
	//console.log(value.TimeInfos)
	var data = value.TimeInfos.some(function(value){
		
		return value.Station == 1011
	})
	//console.log(data)
	if (data == true)
	{
		return value
	}
	
 
})
console.log(arr2.length)
var flag = arr.some(function (value, index, array) {
	return value == "may" ? true : false;
});


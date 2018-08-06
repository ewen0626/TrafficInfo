d = new Date();
utc = d.getTime() + (d.getTimezoneOffset() * 60000);
var Time=new Date(utc + (3600000*8));
var TimeHour=Time.getHours(); 
var TimeMinutes=Time.getMinutes(); 
var TimeMonth=Time.getMonth()+1; 
var TimeDate=Time.getDate();
var TimeYear = Time.getYear();
if(TimeMonth<10){
	TimeMonth='0'+TimeMonth;
}
if(TimeDate<10){
	TimeDate='0'+TimeDate;
}
if(TimeHour<10){
	TimeHour='0'+TimeHour;
}
if(TimeMinutes<10){
	TimeMinutes='0'+TimeMinutes;
}
var Time_JSON ={
	TimeYear :TimeYear + 1900,
	TimeMonth:TimeMonth,
	TimeDate :TimeDate,
	TimeHour : TimeHour,
	TimeMinutes :TimeMinutes
} 
//console.log(Time_JSON) 
module.exports = Time_JSON
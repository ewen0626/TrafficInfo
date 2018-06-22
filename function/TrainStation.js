const TrainStaton = {
	'福隆':1810,
	'貢寮':1809,
	'雙溪':1808,
	'牡丹':1807,
	'三貂嶺':1806,
	'猴硐':1805,
	'瑞芳':1804,
	'四腳亭':1803,
	'暖暖':1802,
	'基隆':1001,
	'三坑':1029,
	'八堵':1002,
	'七堵':1003,
	'百福':1030,
	'五堵':1004,
	'汐止':1005,
	'汐科':1031,
	'南港':1006,
	'松山':1007,
	'臺北':1008,
	'台北':1008,
	'萬華':1009,
	'板橋':1011,
	'浮洲':1032,
	'樹林':1012,
	'南樹林':1034,
	'山佳':1013,
	'鶯歌':1014,
	'桃園':1015,
	'內壢':1016,
	'中壢':1017,
	'埔心':1018,
	'楊梅':1019,
	'富岡':1020,
	'新富':1036,
	'北湖':1033,
	'湖口':1021,
	'新豐':1022,
	'竹北':1023,
	'北新竹':1024,
	'新竹':1025,
	'三姓橋':1035,
	'香山':1026,
	'菁桐':1908,
	'平溪':1907,
	'嶺腳':1906,
	'望古':1905,
	'十分':1904,
	'大華':1903,
	'海科館':6103,
	'八斗子':2003,
	'千甲':2212,
	'新莊':2213,
	'竹中':2203,
	'六家':2214,
	'上員':2204,
	'榮華':2211,
	'竹東':2205,
	'橫山':2206,
	'九讚頭':2207,
	'合興':2208,
	'富貴':2209,
	'內灣':2210
	

};
exports.StationCode = function(station){
	return TrainStaton[station]
	
}
//exports.TrainStaton = TrainStaton;
//console.log(TrainStaton('臺北'));
//console.log(TrainStaton['臺北']);
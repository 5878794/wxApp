

module.exports = {
	//时间戳转 日期带 时分秒
	stamp2time:function(stamp){
		stamp = stamp || new Date().getTime();

		var a = new Date(parseInt(stamp));
		var year=a.getFullYear();
		var month=parseInt(a.getMonth())+1;
		month= (month<10)? "0"+month : month;
		var date=a.getDate();
		date= (date<10)? "0"+date : date;
		var hours=a.getHours();
		hours= (hours<10)? "0"+hours : hours;
		var minutes=a.getMinutes();
		minutes= (minutes<10)? "0"+minutes : minutes;
		var seconds=a.getSeconds();
		seconds= (seconds<10)? "0"+seconds : seconds;

		return year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
	},
	//时间戳转 日期
	stamp2Date:function(stamp){
		stamp = stamp || new Date().getTime();
		var a = new Date(parseInt(stamp));
		var year = a.getFullYear();
		var month = parseInt(a.getMonth()) + 1;
		month = (month < 10) ? "0" + month : month;
		var date = a.getDate();
		date = (date < 10) ? "0" + date : date;
		return year + "-" + month + "-" + date;
	},
	//时间转时间戳 自动补足 时分秒
	time2Stamp:function(date){
		if(!date){
			return new Date().getTime();
		}


		var new_str = date.replace(/:/g,'-');
		new_str = new_str.replace(/ /g,'-');
		new_str = new_str.replace(/\//ig,'-');
		var arr = new_str.split("-");
		if(arr.length != 6){
			for(var i= 0,l=6-arr.length;i<l;i++){
				arr.push(0);
			}
		}

		return new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5])).getTime();
	}
};
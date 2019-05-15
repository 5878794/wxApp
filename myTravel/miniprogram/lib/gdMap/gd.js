

let webServer = 'https://restapi.amap.com/v3/',
	webKey ='fd947c9f2d68842007c13c569a6daf49';


module.exports = {
	//获取输入提示
	getInputTip(val){
		let url = webServer+'assistant/inputtips?key='+webKey;

		return new Promise((success,error)=>{
			wx.request({
				url: url,
				data: {
					keywords: val
				},
				header: {
					'content-type': 'application/json' // 默认值
				},
				success: function (res) {
					// console.log(res.data)
					success(res.data);
				},
				error: function (e) {
					error(e);
					// console.log(e)
				}
			})
		})
	},

	//搜索
	searchKeyWord(text){
		let url = webServer+'place/text?key='+webKey;

		return new Promise((success,error)=>{
			wx.request({
				url: url, //仅为示例，并非真实的接口地址
				data: {
					keywords: text,
					children: 1,
					offset: 20,
					page: 1,
					city: ''
				},
				header: {
					'content-type': 'application/json' // 默认值
				},
				success: function (res) {
					// console.log(res.data)
					success(res.data);
				},
				error: function (e) {
					error(e);
					// console.log(e)
				}
			})
		})
	},

	//获取2个经纬度之间的直线距离
	get2PointLength(longitude1, latitude1, longitude2, latitude2){
		let lat1 = latitude1*Math.PI/180,
			lat2 = latitude2 * Math.PI / 180,
			lon1 = longitude1 * Math.PI / 180,
			lon2 = longitude2 * Math.PI / 180,
			a = lat1 - lat2,
			b = lon1 - lon2,
			s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(b / 2), 2)));

		s = s * 6378137.0; //弧长乘地球半径（半径为米）
		//精确距离的数值 米
		s = Math.round(s);


		return s;
	}

};
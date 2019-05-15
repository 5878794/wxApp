

let webServer = 'https://restapi.amap.com/v3/assistant/inputtips',
	webKey ='fd947c9f2d68842007c13c569a6daf49';


module.exports = {
	//获取输入提示
	getInputTip(val){
		let url = webServer+'?key='+webKey;

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
	}


};
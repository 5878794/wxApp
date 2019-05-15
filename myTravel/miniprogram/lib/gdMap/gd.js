

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
	}
};
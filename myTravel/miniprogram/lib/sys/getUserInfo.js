

module.exports = {
	getUserInfo:function(){
		return new Promise((success,error)=>{
			wx.getSetting({
				success: res => {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
						wx.getUserInfo({
							success: res => {
								success(res);
							}
						})
					}else{
						//未授权
						error();
					}
				}
			})
		})
	},
	getOpenId:function(){
		return new Promise((success,error)=>{
			// 调用云函数
			wx.cloud.callFunction({
				name: 'login',
				data: {},
				success:(res) => {
					// console.log('[云函数] [login] user openid: ', res.result.openid)
					// app.globalData.openid = res.result.openid
					// console.log(res)
					success(res.requestID);
					// wx.navigateTo({
					//   url: '../userConsole/userConsole',
					// })
				},
				fail: (err) => {
					error(err);
					// console.error('[云函数] [login] 调用失败', err)
					// wx.navigateTo({
					// 	url: '../deployFunctions/deployFunctions',
					// })
				}
			})
		});
	}
};
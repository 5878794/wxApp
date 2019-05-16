const regeneratorRuntime = require('../../lib/regeneratorRuntime.js'),
    wxApp = require('../../lib/all.js'),
    sys = require('../../lib/sys/getUserInfo.js'),
    app = getApp();





Page({

    /**
     * 页面的初始数据
     */
    data: {
        class_icon:'',
        class_btn:'',
        icon_img:'../../images/user-unlogin.png',
        logged:false,
        userInfo:{}
    },
    onGetUserInfo(e){
        if (!this.data.logged && e.detail.userInfo) {
            this.setData({
                logged: true,
                icon_img: e.detail.userInfo.avatarUrl,
                userInfo: e.detail.userInfo,
                class_icon:'show_icon',
                class_btn:'show_btn'
            });
            app.globalData.userInfo = e.detail.userInfo;
        }
    },
    async login(){
        if(!this.data.logged){return;}

        let openId = await sys.getOpenId().catch(rs=>{
            wxApp.alert(rs);
        });

        app.globalData.openId = openId;


        wxApp.closeAndOpenUrl('../list/list');
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:async function (options) {
        let userInfo = await sys.getUserInfo();

        if(userInfo){
            this.setData({
                icon_img:userInfo.userInfo.avatarUrl
            });

            await wxApp.sleep(500);

            this.setData({
                logged: true,
                icon_img: userInfo.userInfo.avatarUrl,
                userInfo: userInfo.userInfo,
                class_icon:'show_icon',
                class_btn:'show_btn'
            });
            app.globalData.userInfo = userInfo.userInfo;
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
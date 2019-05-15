const regeneratorRuntime = require('../../lib/regeneratorRuntime.js'),
    gd = require('../../lib/gdMap/gd.js'),
    wxApp = require('../../lib/all.js'),
    app = getApp();





Page({

    /**
     * 页面的初始数据
     */
    data: {
        historyLength:6,
        search:'',
        searchList:[],
        searchHistory:[1,2,3]
    },


    setInputVal:function(e){

        let val = e.detail.value;
        this.setData({
            search:val
        });

        this.getInputtips(val);
    },


    //获取输入提示
    async getInputtips(val){
        let data = await gd.getInputTip(val);
        data = data.tips;

        this.setData({
            searchList:data
        });
    },

    //选择输入提示
    async selectData(e){
        let data = e.target.dataset.data,
            name = data.name;

        //blur事件会触发input事件 所以需要延迟
        await wxApp.sleep(100);
        this.setData({
            search:name,
            searchList:[]
        });

    },

    //刷新当前缓存数据
    refreshNowStorage(val){
        let str = wx.getStorageSync('search_obj') || [],
            l = str.length;

        let n = str.indexOf(val);


        if(n == -1){
            //不存在
            if(l>=this.data.historyLength){
                //去除最后个数据
                str.splice(str.length-1,1);
            }
        }else{
            //存在
            str.splice(n,1);
        }
        //在第一个添加
        str.unshift(val);

        wx.setStorageSync('search_obj',str);
    },

    searchVal(){
        let val = this.data.search;
        this.refreshNowStorage(val);
        this.refreshHistoryList();

        wxApp.openUrl('../save/save?search='+val);
    },

    searchFromHistoryData(e){
        let data = e.target.dataset.data;
        this.refreshNowStorage(data);
        this.refreshHistoryList();

        wxApp.openUrl('../save/save?search='+data);
    },

    // 刷新历史搜索记录
    refreshHistoryList(){
        //设置搜素历史
        let history = wx.getStorageSync('search_obj') || [];
        this.setData({
            searchHistory:history
        })
    },


    // showMap(){
    //     let map = wx.createMapContext('map', this);
    //     map.moveToLocation();
    //
    //
    //
    // },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.refreshHistoryList();
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
        this.refreshHistoryList();
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
});
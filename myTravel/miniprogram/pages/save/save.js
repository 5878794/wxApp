const regeneratorRuntime = require('../../lib/regeneratorRuntime.js'),
    gd = require('../../lib/gdMap/gd.js'),
    inputVal = require('../../lib/wxPublish/getInputVal.js'),
    wxApp = require('../../lib/all.js'),
    app = getApp();





Page({

    /**
     * 页面的初始数据
     */
    data: {
        points:[],
        choose:0,

        //地图
        markers:[],
        markers_include:[],
        scale:12,
        longitude:'',
        latitude:'',

        title:'',
        imgUrls: []
    },


    setInputVal:inputVal,
    makertap:function(e){
        let id = e.markerId,
            data=  this.data.points,
            n = 0;

        data.map((rs,i)=>{
            if(rs.id == id){
                n =i;
            }
        });

        this.getDataFromPoints(n);
    },


    showMap(){
        let map = wx.createMapContext('map', this);
        map.moveToLocation();
    },

    getDataFromPoints(n){
        let data = this.data.points,
            nn = n || 0;
        data = data[nn];

        let text = data.pname+' '+data.cityname+' '+data.name,
            images = data.photos,
            location = data.location.split(','),
            imgUrls = [];

        images.map(rs=>{
            imgUrls.push(rs.url);
        });

        this.setData({
            choose:nn,
            title:text,
            imgUrls:imgUrls,
            longitude:location[0],
            latitude:location[1]
        });
        this.setMapMarkersData(n);
    },

    setMapMarkersData(n){
        let data = this.data.points,
            nn = n || 0,
            markers = [],
            markers_include = [];

        data.map((rs,i)=>{
            let icon = (i==nn)? '/images/map_select.png' : '/images/map.png',
                location = rs.location.split(',');

            let point = {
                id:rs.id,
                latitude:location[1],
                longitude:location[0],
                title:rs.name,
                iconPath:icon
            };

            markers.push(point);
        });

        //第一次所有点全部显示在可视区域
        if(!n && n!=0){
            markers_include = markers;
        }


        this.setData({
            markers:markers,
            markers_include:markers_include
        });



    },

    showBigImage(e){
        console.log(e);
        let imgUrls = this.data.imgUrls,
            url = e.target.dataset.src;

        wx.previewImage({
            current: url,
            urls: imgUrls,
            success(res) {
                // console.log(res)
            }
        })
    },

    savePoint(e){
        let n = this.data.choose,
            data = this.data.points[n];

        data.photos = this.data.imgUrls;

        this.updateDataToServer(data).then(rs=>{
            wxApp.goBack();
        }).catch(rs=>{
            wxApp.alert(rs)
        });

    },

    async updateDataToServer(data){
        const db = wx.cloud.database();
        const address = db.collection('address');

        await address.add({
            data:data,
        });

        wxApp.alert('保存成功！');
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:async function (options) {
        let search = options.search || '成都';
        this.showMap();

        let data = await gd.searchKeyWord(search);
        data = data.pois || [];

        this.setData({
            points:data
        });

        this.getDataFromPoints();
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
});
const regeneratorRuntime = require('../../lib/regeneratorRuntime.js'),
    wxApp = require('../../lib/all.js'),
    setInputVal = require('../../lib/wxPublish/getInputVal'),
    gd = require('../../lib/gdMap/gd.js'),
    sys = require('../../lib/sys/getUserInfo.js'),
    app = getApp();





Page({

    /**
     * 页面的初始数据
     */
    data: {
        //原始数据
        list:[],
        //显示用数据
        listData:[],
        //我的位置
        myLocation:{},
        locationGetTime:0,

        search:''
    },

    setInputVal:setInputVal,

    async getListData(searchText){
        const db = wx.cloud.database();
        const address = db.collection('address');
        const _ = db.command;

        // let data = await address.where({
        //     name: {
        //         $regex: '.*'+searchText+'.*'
        //     }
        // }).get();

        //TODO 分页  下拉加载  刷新 距离排序
        let data = await address.where(_.or([
            {name: {$regex: '.*'+searchText+'.*'}},
            {address:{$regex: '.*'+searchText+'.*'}},
            {cityname:{$regex: '.*'+searchText+'.*'}},
            {pname:{$regex: '.*'+searchText+'.*'}}
        ]))
            .orderBy('pname','asc')
            .limit(20)
            .skip(0)
            .get();


        data = data.data || [];

        data.map(rs=>{
           rs.zxjl = '计算中...';
        });

        this.setData({
            list:data,
            listData:data
        });
        console.log(data);
    },

    getMyLocation(){
        let _this = this;

        return new Promise(success=>{
            let time = new Date().getTime();

            //10分钟获取一次定位
            if(time - this.data.locationGetTime < 600000){
                success();
            }else{
                wx.getLocation({
                    type: 'gcj02',
                    altitude:'true',
                    success(res) {
                        _this.setData({
                            myLocation:res,
                            locationGetTime:new Date().getTime()
                        });
                        success();
                    }
                })
            }
        });
    },


    refreshListJl(){
        let myLocation = this.data.myLocation,
            lon = myLocation.longitude,
            lat = myLocation.latitude,
            data = this.data.list;

        data.map(rs=>{
            let location = rs.location.split(','),
                lon1 = location[0],
                lon2 = location[1],
                jl = gd.get2PointLength(lon,lat,lon1,lon2);

            jl = (jl/1000).toFixed(1);

            rs.zxjl = jl;
            console.log(jl)
        });

        //对象 内存地址相同 不需要更新正在使用的数据
        this.setData({
            list:data
        })
    },

    searchVal(){
        let val = this.data.search;

        this.init(val).then(rs=>{

        }).catch(e=>{
            wxApp.alert(e);
        })
    },


    openAdd(){
        wxApp.openUrl('../add/add');
    },


    async init(searchText){
        searchText = searchText || '';

        await this.getListData(searchText);
        await this.getMyLocation();
        this.refreshListJl();

        this.setData({
            listData:this.data.list
        })


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function (options) {
        this.init().then(rs=>{

        }).catch(e=>{
            wxApp.alert(e);
        })
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
        this.init().then(rs=>{

        }).catch(e=>{
            wxApp.alert(e);
        })
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
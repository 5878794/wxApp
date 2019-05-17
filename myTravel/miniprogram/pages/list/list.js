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
        //我的位置
        myLocation:{},
        locationGetTime:0,

        search:'',
        pageSize:20,
        nowIndex:0,

        //是否显示删除
        showDel:false
    },

    setInputVal:setInputVal,

    async getListData(searchText){
        const db = wx.cloud.database();
        const address = db.collection('address');
        const _ = db.command;


        let data = await address.where(_.or([
            {name: {$regex: '.*'+searchText+'.*'}},
            {address:{$regex: '.*'+searchText+'.*'}},
            {cityname:{$regex: '.*'+searchText+'.*'}},
            {pname:{$regex: '.*'+searchText+'.*'}}
        ]))
            .orderBy('hasGo','pname','desc')
            .limit(this.data.pageSize)
            .skip(this.data.nowIndex)
            .get();


        data = data.data || [];


        //分页合并数据
        let newData = this.data.list;
        data.map(rs=>{
            rs.zxjl = '计算中...';
            rs.style = 0;
            newData.push(rs);
        });

        this.setData({
            list:newData
        });
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
        });

        this.setData({
            list:data
        })
    },

    searchVal(){
        let val = this.data.search;
        this.setData({
            nowIndex:0,
            list:[]
        });
        this.init(val).then(rs=>{

        }).catch(e=>{
            wxApp.alert(e);
        })
    },


    openAdd(){
        wxApp.openUrl('../add/add');
    },


    //刷新页面
    refreshPage(callback){
        callback = callback || function(){};
        this.setData({
            search:'',
            nowIndex:0,
            list:[]
        });
        this.init().then(rs=>{
            callback();
        }).catch(e=>{
            callback();
            wxApp.alert(e);
        })
    },

    //长按显示删除按钮
    longtap(e){
        let id = e.currentTarget.dataset.id,
            data = this.data.list;

        data.map(rs=>{
            if(rs.id == id){
                rs.style = -140;
            }else{
                rs.style = 0;
            }
        });

        this.setData({
            showDel:true,
            list:data
        })

    },
    //列表点击    在显示删除按钮时关闭删除按钮，没显示时页面跳转到详情
    listTap(e){
        //在显示删除
        if(this.data.showDel){
            //关闭删除按钮
            let data = this.data.list;
            data.map(rs=>{
               rs.style=0;
            });

            this.setData({
                list:data,
                showDel:false
            });
            return;
        }


        //跳转
        let id = e.currentTarget.dataset.id;

        wxApp.openUrl('../info/info?id='+id);

    },

    //获取要删除的列表的图片数据
    getDelListImages(id){
        //获取添加的图片数据
        let data1 = this.data.list,
            imgs = [];
        data1.map(rs=>{
            if(rs._id == id){
                imgs = rs.photos;
            }
        });

        let newImgs = [];
        imgs.map(rs=>{
           if(rs.substr(0,5)=='cloud'){
               newImgs.push(rs);
           }
        });

        return newImgs;

    },

    async delList(e){
        let id = e.currentTarget.dataset.id,
            imgs = this.getDelListImages(id);

        if(imgs.length !=0){
            wx.cloud.deleteFile({
                fileList: imgs,
                success: res => {
                    // handle success
                    // console.log(res.fileList)
                }
            });
        }


        const db = wx.cloud.database();
        const address = db.collection('address');

        await address.doc(id).remove();

        await wxApp.alert('删除成功！');

        //删除数据
        let data=  this.data.list,
            newData = [];
        data.map(rs=>{
            if(rs._id != id){
                newData.push(rs);
            }
        });

        this.setData({
           list:newData
        });

    },

    async init(searchText){
        searchText = searchText || '';

        await this.getListData(searchText);
        await this.getMyLocation();
        this.refreshListJl();

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function (options) {
        this.refreshPage();
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
        if(app.globalData.needRefresh){
            app.globalData.needRefresh = false;
            this.refreshPage();
        }

        //需要更新 去没去过的ui
        let _id = app.globalData.hasGoId;
        if(_id){
            let data = this.data.list;

            data.map(rs=>{
                if(rs._id == _id){
                    rs.hasGo = app.globalData.hasGoVal;
                }
            });

            this.setData({
                list:data
            });

            app.globalData.hasGoId = null;
            app.globalData.hasGoVal = null;
        }
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
        this.refreshPage(function(){
            wx.stopPullDownRefresh();
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let index = this.data.nowIndex,
            search = this.data.search;
        index += this.data.pageSize;

        this.setData({
            nowIndex:index
        });

        this.init(search).then(rs=>{

        }).catch(e=>{
            wxApp.alert(e);
        })

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }




});
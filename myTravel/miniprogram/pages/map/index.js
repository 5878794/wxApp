var amapFile = require('../..//lib/gdMap/amap-wx.js');//如：..­/..­/libs/amap-wx.js

var markersData = [];
Page({
    data: {
        markers: [],
        latitude: '',
        longitude: '',
        textData: {}
    },
    onLoad(){
        
        this.showMap();

        console.log(this.get2PointLength(104.073553, 30.626181, 104.073769, 30.611325))
        // 104.073553, 30.626181
        //104.073769,30.611325

        // let myAmapFun = new amapFile.AMapWX({ key: 'a6f0522377fa6b3d16244a40376054fe' });
        // myAmapFun.getPoiAround({
        //     querykeywords:'建设路',
        //     queryTypes:'110202',
        //     success:function(e){
        //         console.log(e);
        //     }
        // });
        
        // wx.getLocation({
        //     success(e) {
        //         console.log(e)
        //     },
        //     error() {
        //         console.log('err')
        //     }
        // })
    },
    search(){
        let url = 'https://restapi.amap.com/v3/place/text?key=fd947c9f2d68842007c13c569a6daf49';

        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            data: {
                keywords: '青城山',
                children: 1,
                offset: 20,
                page: 1,
                city: ''
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res.data)
            },
            error: function (e) {
                console.log(e)
            }
        })
    },
    searchInput(){
        let url = 'https://restapi.amap.com/v3/assistant/inputtips?key=fd947c9f2d68842007c13c569a6daf49';

        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            data: {
                keywords: '动物园'
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res.data)
            },
            error: function (e) {
                console.log(e)
            }
        })
    },
    showMap(){
        var that = this;
        var myAmapFun = new amapFile.AMapWX({ key: 'a6f0522377fa6b3d16244a40376054fe' });
        myAmapFun.getPoiAround({
            iconPathSelected: '选中 marker 图标的相对路径', //如：..­/..­/img/marker_checked.png
            iconPath: '未选中 marker 图标的相对路径', //如：..­/..­/img/marker.png
            success: function (data) {
                markersData = data.markers;
                that.setData({
                    markers: markersData
                });
                that.setData({
                    latitude: markersData[0].latitude
                });
                that.setData({
                    longitude: markersData[0].longitude
                });
                that.showMarkerInfo(markersData, 0);
            },
            fail: function (info) {
                wx.showModal({ title: info.errMsg })
            }
        })
    },
    makertap: function (e) {
        var id = e.markerId;
        var that = this;
        that.showMarkerInfo(markersData, id);
        that.changeMarkerColor(markersData, id);
    },
    showMarkerInfo: function (data, i) {
        var that = this;
        that.setData({
            textData: {
                name: data[i].name,
                desc: data[i].address
            }
        });
    },
    changeMarkerColor: function (data, i) {
        var that = this;
        var markers = [];
        for (var j = 0; j < data.length; j++) {
            if (j == i) {
                data[j].iconPath = "选中 marker 图标的相对路径"; //如：..­/..­/img/marker_checked.png
            } else {
                data[j].iconPath = "未选中 marker 图标的相对路径"; //如：..­/..­/img/marker.png
            }
            markers.push(data[j]);
        }
        that.setData({
            markers: markers
        });
    },

    //获取2个经纬度的直线距离
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

   

})
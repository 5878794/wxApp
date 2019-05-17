const regeneratorRuntime = require('../../lib/regeneratorRuntime.js'),
    gd = require('../../lib/gdMap/gd.js'),
    inputVal = require('../../lib/wxPublish/getInputVal.js'),
    wxApp = require('../../lib/all.js'),
    md5 = require('../../lib/fn/md5.js'),
    app = getApp();





// pages/info/info.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data:{},
        _id:'',
        title:'',
        address:'',
        imgUrls:[],
        location:'',
        text:'',
        hasGo:0,   //0未去  1已去
        textNotCanEdit:false,
        hasGoCanTap:true,
        border:{}
    },

    async init(id){
        let data = await this.getDataFromServer(id);
        data = data.data || [];
        if(data.length == 0){
            await wxApp.alert('地点已删除！');
            wxApp.goBack();
            return;
        }

        data = data[0];
console.log(data)
        this.setData({
            title:data.name,
            location:data.location,
            address:data.pname+' '+data.cityname+' '+data.adname+' '+data.address,
            imgUrls:data.photos,
            text:data.bz || '',
            hasGo:data.hasGo || 0,
            _id:data._id,
            data:data
        });
    },

    showBigImage(e){
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

    async getDataFromServer(id){
        const db = wx.cloud.database();
        const address = db.collection('address');

        return await address.where({
                id:id
            }).get();
    },

    async submitBz(e){
        let val = e.detail.value,
            newData = this.data.data;
        newData.bz = val;

        //阻止text可编辑
        this.setData({textNotCanEdit:true});

        //提交数据
        const db = wx.cloud.database();
        const address = db.collection('address');

        await address.doc(this.data._id).update({
            data:{
                bz:val
            }
        }).then(rs=>{
            this.setData({
                textNotCanEdit:false,
                data:newData,
                text:val
            });
            wxApp.info.show('保存成功');
        }).catch(async e=>{
            await wxApp.alert(e);
            this.setData({textNotCanEdit:false});
        });
    },

    async notGoOrGo(e){
        if(!this.data.hasGoCanTap){return;}

        let data = e.target.dataset.data,
            hasGo = (data == 0)? 1 : 0,
            newData = this.data.data;
        newData.hsGo = hasGo;

        //阻止btn可点击
        this.setData({hasGoCanTap:false});

        //提交数据
        const db = wx.cloud.database();
        const address = db.collection('address');

        await address.doc(this.data._id).update({
            data:{
                hasGo:hasGo
            }
        }).then(rs=>{
            app.globalData.hasGoId = this.data._id;
            app.globalData.hasGoVal = hasGo;
            this.setData({
                hasGoCanTap:true,
                data:newData,
                hasGo:hasGo
            });
            wxApp.info.show('保存成功');
        }).catch(async e=>{
            await wxApp.alert(e);
            this.setData({hasGoCanTap:true});
        });

    },

    async addImage(){
        let time = new Date().getTime(),
            openId = md5(app.globalData.openId),
            fileName = openId+'_'+time;

        wx.chooseImage({
            success: chooseResult => {
                let file = chooseResult.tempFilePaths || [];
                file = file[0] || '';
                fileName += file.substr(file.lastIndexOf('.'));

                wxApp.loading.show('上传中');
                // 将图片上传至云存储空间
                wx.cloud.uploadFile({
                    // 指定上传到的云路径
                    cloudPath: fileName,
                    // 指定要上传的文件的小程序临时文件路径
                    filePath: chooseResult.tempFilePaths[0],
                    // 成功回调
                    success: async res => {
                        let path = res.fileID;

                        this.addImagePathToServer(path).then(rs=>{
                            wxApp.loading.hide();
                            wxApp.info.show('上传成功');
                        }).catch(e=>{
                            wxApp.loading.hide();
                            wxApp.alert(e);
                        });
                    },
                    error:e=>{
                        wxApp.loading.hide();
                        wxApp.alert(e);
                    }
                })
            },
        })
    },

    delImg(e){
        let src = e.target.dataset.src,
            borders = this.data.border;

        borders[src] = true;
        this.setData({border:borders});



        wxApp.confirm('确定要删除图片么？').then(rs=>{
            this.delImagePathToServer(src).then(rs=>{
                wxApp.info.show('删除成功！');
            }).catch(e=>{
                let borders = this.data.border;
                borders[src] = null;
                this.setData({border:borders});
                wxApp.alert(e);
            });
        }).catch(rs=>{
            let borders = this.data.border;
            borders[src] = null;
            this.setData({border:borders});
        })
    },

    openMap(e){
        let location = e.target.dataset.location;
        location = location.split(',');

        let lon = location[0]*1,
            lat = location[1]*1;

        wx.openLocation({
            latitude:lat,
            longitude:lon,
            scale: 18
        })


    },

    addImagePathToServer(imgSrc){
        return new Promise(async (success,error)=>{
            let imgs = this.data.imgUrls || [];
            imgs.unshift(imgSrc);

            const db = wx.cloud.database();
            const address = db.collection('address');

            await address.doc(this.data._id).update({
                data:{
                    photos:imgs
                }
            }).then(rs=>{
                this.setData({
                    imgUrls:imgs
                });

                success();
            }).catch(async e=>{
                error(e);
            });
        })
    },

    delImagePathToServer(imgSrc){
        return new Promise(async (success,error)=>{
            let imgs = this.data.imgUrls || [],
                n = imgs.indexOf(imgSrc);
            imgs.splice(n,1);

            const db = wx.cloud.database();
            const address = db.collection('address');


            wx.cloud.deleteFile({
                fileList: [imgSrc],
                success: res => {
                    // handle success
                    // console.log(res.fileList)
                }
            });

            await address.doc(this.data._id).update({
                data:{
                    photos:imgs
                }
            }).then(rs=>{
                this.setData({
                    imgUrls:imgs
                });

                success();
            }).catch(async e=>{
                error(e);
            });
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        if(!id){
            wxApp.goBack();
            return;
        }

        this.init(id).then(rs=>{

        }).catch(async e=>{
            await wxApp.alert(e);
            wxApp.goBack();
        });
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
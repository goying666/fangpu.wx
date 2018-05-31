// pages/mine/mine.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goyingOpenFlag:false,
    goyingFlag:true,
    loadingFlag:true,
    region: ["", "", ""],
    snNum: "1.0.3",    
    userNum: {
      mytermnum: 0,
      myrecordingnum: 0,
      mysharenum: 0,
      myallzannum: 0,
    }
  },
  goying:function(res){
    var that = this;
    that.setData({
      goyingFlag: false,
    })
  },
  // cancelgoyingback: function (res) {
  //   var that = this;
  //   if (that.data.goyingOpenFlag){
  //     that.setData({
  //       goyingFlag: true
  //     })
  //   }
  // },
  cancelGoying: function (res) {
    var that = this;
    that.setData({
      goyingFlag: true
    })
  },
  gotoMytermsPage: function (options) {
    wx.navigateTo({
      url: '/pages/myterms/myterms',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  gotoMyAcordingPage: function (options) {
    wx.navigateTo({
      url: '/pages/myrecording/myrecording',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  gotoMyCollectionPage: function (options) {
    wx.navigateTo({
      url: '/pages/mycollection/mycollection',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickname: app.globalData.userDB.nickname,
      avatarurl: app.globalData.userDB.avatarurl,
    })
    // wx.getStorage({
    //   key: 'userDB',
    //   success: function(res) {
    //     console.log("data.address is : " + res.data.address);
    //     // this.data.region = res.data.address
    //     that.setData({
    //       // region : app.globalData.userAddress
    //       region : res.data.address.split(",")
    //     })
    //   },
    // })
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    app.globalData.userAddress = this.data.region;

    app.globalData.userDB.address = this.data.region.join(",");

    console.log("app.globalData")
    console.log(app.globalData)
    console.log("app.globalData")
    
    wx.setStorage({
      key: 'userDB',
      data: app.globalData.userDB,
    })
    // wx.getStorage({
    //   key: 'userDB',
    //   success: function (getStorageSuccessres) {
    //     console.log(getStorageSuccessres)
    //     app.globalData.userDB = getStorageSuccessres.data;
    //     app.globalData.userDB.address = app.globalData.userAddress       
    //   },
    // })
    // setTimeout(function () {
    //   wx.setStorage({
    //     key: 'userDB.',
    //     data: app.globalData.userDB,
    //   })
    // }, 1000);  

    that.setData({
      loadingFlag: false
    })
    wx.request({
      // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/user/address/update',
      // url: app.globalData.serverUrl + '/user/user/address/update',
      url: app.globalData.serverUrl + '/user/address/update',
      method: 'POST',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        id: app.globalData.userDB.id,
        nickame: app.globalData.userDB.nickame,
        // nickame: app.globalData.userInfo.nickName,
        address: this.data.region.join(","),
      },
      success: function (res) {
        setTimeout(function () {
          that.setData({
            loadingFlag: true
          })
        }, 10);
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }
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
    var that = this
    // 获取mynum  app.globalData.userNum,
    that.setData({
      loadingFlag: false
    })
    wx.request({
      url: app.globalData.serverUrl + '/my/all/' + app.globalData.userDB.id,
      method: 'GET',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        // 需要传入的acordingId已经通过url传入，data部分为空
      },
      success: function (successRes) {
        app.globalData.userNum.mytermnum = successRes.data.data.mytermnum;
        app.globalData.userNum.myrecordingnum = successRes.data.data.myrecordingnum;
        app.globalData.userNum.mysharenum = successRes.data.data.mysharenum;
        app.globalData.userNum.myallzannum = successRes.data.data.myallzannum;

        that.setData({
          region: app.globalData.userAddress,
          userNum: app.globalData.userNum,
        })
        setTimeout(function () {
          that.setData({
            loadingFlag: true
          })
        }, 10);
        console.log(successRes)
        console.log(app.globalData.userNum)
      },
      fail: function (failRes) {
        console.log(failRes)
      },
      complete: function (completeRes) {
        console.log(completeRes)
      }
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
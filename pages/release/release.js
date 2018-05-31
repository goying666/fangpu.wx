// pages/release/release.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingFlag: true,
    todayterms: [{
      address: "",
      addtime: "",
      content: "",
      id: 0,
      introduce: "",
      ownerid: 0,
      recordingids: "",
      recordingnum: 0,
      termclass: "",
      tingnum: 0,
      zannum: 0,
      usernickname: "",
      useravatarurl: "",
      sharenum: "",
    }],
  },

  gotoTermsPages: function (res) {
    wx.navigateTo({
      url: "/pages/release/releaseterm/releaseterm",
    })
  },
  oneterm: function (e) {
    wx.navigateTo({
      url: "/pages/terms/terms?termid=" + this.data.todayterms[e.currentTarget.dataset.id].id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;

    that.setData({
      loadingFlag: false
    })

    wx.request({
      url: app.globalData.serverUrl + '/system/todaytermget',
      method: 'GET',
      header: {
        'content-type': 'application/json;'
      },
      // data: this.data.jsonTest2,
      // data: new Date,
      success: function (res) {
        that.data.todayterms = res.data.data;
        for (var i = 0; i < res.data.data.length; i++) {
          that.data.todayterms[i].addtime = that.data.todayterms[i].addtime.replace("T", " ").slice(0, 19);
        }
        that.setData({
          todayterms: res.data.data,
          loadingFlag: true
          // "todayterms.addtime": res.data.data
        })
        app.globalData.todayTerms = res.data;
        console.log("success " + res.data)
        console.log(res)
      },
      fail: function (res) {
      },
      complete: function (res) {
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
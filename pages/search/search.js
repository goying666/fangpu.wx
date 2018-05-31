const app = getApp()
// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstSearchFlag:true,
    myaddFlag:true,
    loadingFlag:true,
    scrollViewCondition: false,
    location: "",
    lickterms: 0,
    lickrecordings: 0,
    spendtimemS: 0,
    searchinfo:"",
    searchRes: [{
      address: "",
      addtime: "",
      content: "",
      id: 34,
      introduce: "",
      ownerid: 61,
      recordingids: "4",
      recordingnum: 0,
      termclass: "日常",
      tingnum: 0,
      zannum: 0,
      usernickname: "",
      useravatarurl: "",
      sharenum: "",
    }]
  },
  gotominePage: function (res) {
    wx.switchTab({     
      url: '/pages/mine/mine',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  gotoAddTermPage: function(res) {
    wx.navigateTo({
      url: '/pages/release/releaseterm/releaseterm',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  finishInputContent: function (options) {

    this.setData({
      searchinfo: options.detail.value,
      firstSearchFlag:false
    })

    var that = this;
    that.setData({
      loadingFlag: false,
      myaddFlag:false
    })
    wx.request({
      url: app.globalData.serverUrl + '/search/terminfo',
      method: 'POST',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        searchString: this.data.searchinfo,
      },
      success: function (successRes) {
        that.setData({
          searchRes: successRes.data.data.termlist,
          lickterms: successRes.data.data.termnum,
          lickrecordings: successRes.data.data.recordingnum,
          spendtimemS: successRes.data.data.spendtime,
          loadingFlag: true
        })
        if (successRes.data.data.termlist[0]) {
          console.log("successRes.data.data[0] is not null")
          that.setData({
            scrollViewCondition: true,
          })
        } else {
          console.log("successRes.data.data[0] is null")
          that.setData({
            scrollViewCondition: false,
          })
        }
        console.log(successRes)
      },
      fail: function (failRes) {
        console.log(failRes)
      },
      complete: function (completeRes) {
        console.log(completeRes)
      }
    }) 

  },

  oneterm: function (options) {
    console.log(options)
    wx.navigateTo({
      url: '/pages/terms/terms?termid=' + this.data.searchRes[options.currentTarget.dataset.id].id,
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
    this.setData({
      location: app.globalData.userAddress
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
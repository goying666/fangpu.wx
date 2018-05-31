const app = getApp()

// pages/myrecording/myrecording.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingFlag:true,
    scrollViewCondition: "",
    recordingnum:"",
    allmyrecordings:[{
      id: "",
      termid: "",
      terminfo: "123",
      userid: "",
      path: "",
      address: "",
      filename: "",
      tingnum: 0,
      zannum: 0,
      badnum: 0,
      addtime: "2018/05/09 12:34",
      shoucangnum: 0,
      sharenum: 0,
      useravatarurl: "",
      termclass: "",
      usernickname: "",
    }],
    size: "",
    currentNumber: ""
  },
  selectOneRecording: function (options) {
    this.data.currentNumber = this.data.size - options.currentTarget.dataset.id - 1 ;
    console.log(options.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/recording/recording?recordingid=' + this.data.allmyrecordings[this.data.currentNumber].id,
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
    var that = this
    wx.request({
      url: app.globalData.serverUrl + '/my/myrecording/get/' + app.globalData.userDB.myrecordingid,
      method: 'GET',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      success: function (successRes) {
        // that.data.allMyTerms = successRes.data.data
        // .replace("T", " ").slice(0, 19);
        that.data.allmyrecordings = successRes.data.data;
        for (var i = 0; i < successRes.data.data.length; i++) {
          that.data.allmyrecordings[i].addtime = that.data.allmyrecordings[i].addtime.replace("T", " ").slice(0, 19);
        }
        that.setData({
          allmyrecordings: successRes.data.data,
          size: successRes.data.data.length
        })
        if (successRes.data.data[0]) {
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
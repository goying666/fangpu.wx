const util = require('../../utils/util.js')
const app = getApp()
// pages/terms/terms.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingFlag: true,
    size:"",
    scrollViewCondition: "",
    recordingList: [],
    currentRecordingIndex: "",
    termid: null,
    owerInfo: {
      id: "",
      address: "",
      nickname: "",
      avatarurl: "",
    },
    termInfo: {
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
    },
    allrecordings: [{
      usernickname: "安安",
      address: "陕西省-汉中市-南郑县",
      addtime: "2018-05-10 18:21",
      tingnum: "123",
      zannum: "",
      useravatarurl: "",
    }],
  },

  gotoRecordingPage: function (options) {
    this.data.currentRecordingIndex = this.data.size - options.currentTarget.dataset.id - 1;
    console.log("id is " + this.data.allrecordings[options.currentTarget.dataset.id].id)
    wx.navigateTo({
      url: '/pages/recording/recording?recordingid=' + this.data.allrecordings[this.data.currentRecordingIndex].id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  gotoReleaseRecording: function (options) {
    wx.navigateTo({
      url: '/pages/release/releaserecording/releaserecording?termid=' + this.data.termInfo.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.termid = options.termid
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this;
    that.setData({
      loadingFlag: false
    })
    //请求获取词条的info
    wx.request({
      // url: app.globalData.serverUrl + ':7898/term/info', + app.globalData.serverMoudle 
      url: app.globalData.serverUrl + '/term/info',
      method: 'POST',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        id: this.data.termid,
        // ownerId: app.globalData.DBdata.id,
      },
      success: function (successRes) {
        //刷新terminfo的相关信息；
        that.data.termInfo = successRes.data.data;
        that.data.termInfo.addtime = successRes.data.data.addtime.replace("T"," ").slice(0,19);
        // that.data.termInfo.addtime = util.formatTime(new Date(successRes.data.data.addtime));
        that.setData({
          termInfo: that.data.termInfo,
        })   
            
        // 获取词条对应的recordinglist信息，并刷新
        wx.request({
          url: app.globalData.serverUrl + '/recording/recordinglist/get/' + successRes.data.data.recordingids,
          method: 'GET',
          header: {
            'content-type': 'application/json;'
          },// 设置请求的 header
          data: {
            // 需要传入的acordingId已经通过url传入，data部分为空
          },
          success: function (getsuccessRes) {
            that.data.allrecordings = getsuccessRes.data.data;
            for (var i = 0; i < getsuccessRes.data.data.length; i++) {
              that.data.allrecordings[i].addtime = that.data.allrecordings[i].addtime.replace("T", " ").slice(0, 19);
            }
            that.setData({
              allrecordings: that.data.allrecordings,
              size: that.data.allrecordings.length
            })
            setTimeout(function () {
              that.setData({
                loadingFlag: true
              })
            }, 10);
            console.log(getsuccessRes)

            if (getsuccessRes.data.data[0] == null) {
              that.setData({
                scrollViewCondition: false,
              })
            } else {
              that.setData({
                scrollViewCondition: true,
              })
            }

            console.log(getsuccessRes)
          },
          fail: function (failRes) {
            console.log(failRes)
          },
          complete: function (completeRes) {
            console.log(completeRes)
          }
        })

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
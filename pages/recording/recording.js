const util = require('../../utils/util.js')
const app = getApp()

var recordingFile = ""

// const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
// pages/recording/recording.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playFlag:true,
    loadingFlag: true,
    recordingid: "",
    shoupicture: "/images/recording/shou.png",
    zanpicture: "/images/recording/zan.png",
    badpicture: "/images/recording/bad.png",
    recordingInfo: {
      id: "",
      termid: "",
      terminfo: "",
      userid: "",
      path: "",
      address: "",
      filename: "",
      tingnum: "",
      zannum: "",
      badnum: "",
      addtime: "",
      shoucangnum: "",
      sharenum: "",
      useravatarurl: "",
      termclass: "",
      usernickname: "",
    },
  },
  badbind: function (res) {
    var that = this;
    // 向服务器发起点赞请求；
    setTimeout(function () {
      that.setData({
        loadingFlag: false
      })
    }, 0);
    wx.request({
      url: app.globalData.serverUrl + '/num/bad',
      method: 'POST',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        userid: app.globalData.userDB.id,
        recordingid: this.data.recordingid,
        termid: this.data.recordingInfo.termid,
      },
      success: function (successRes) {
        that.setData({
          "recordingInfo.badnum": successRes.data.data.badnum,
          loadingFlag: true
        }),
          console.log(successRes)
        if (successRes.data.code == 9)
          that.setData({
            badpicture: "/images/recording/baded.png"
          })
        else
          that.setData({
            badpicture: "/images/recording/bad.png"
          })
      },
      fail: function (failRes) {
        console.log(failRes)
      }
    })
  },

  zanbind: function (res) {
    var that = this;
    // 向服务器发起点赞请求；
    that.setData({
      loadingFlag: false
    })
    wx.request({
      url: app.globalData.serverUrl + '/num/zan',
      method: 'POST',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        userid: app.globalData.userDB.id,
        recordingid: this.data.recordingid,
        termid: this.data.recordingInfo.termid,
      },
      success: function (successRes) {        
        that.setData({
          "recordingInfo.zannum": successRes.data.data.zannum,
          loadingFlag: true
        }),
          console.log(successRes)
        if (successRes.data.code == 8){
          that.setData({
            zanpicture: "/images/recording/zaned.png",
          })
        }         
        else
          that.setData({
            zanpicture: "/images/recording/zan.png"
          })
      },
      fail: function (failRes) {
        console.log(failRes)
      }
    })
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this
    that.setData({
      loadingFlag: false
    })
    this.data.recordingid = options.recordingid
    wx.request({
      // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/recording/term/info',
      url: app.globalData.serverUrl + '/recording/info/get',
      method: 'POST',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        id: this.data.recordingid,
      },
      success: function (successRes) {
        //刷新terminfo的相关信息；
        that.data.recordingInfo = successRes.data.data;
        that.data.recordingInfo.addtime = successRes.data.data.addtime.replace("T", " ").slice(0, 19);
        that.setData({
          recordingInfo: that.data.recordingInfo, 
          loadingFlag: true
        })
        console.log(successRes)
      },
      fail: function (failRes) {
        console.log(failRes)
      }
    })
    // 判断我对该词条的操作，然后刷新图片

  },

  playRecording: function (options) {
    console.log("path ")
    var that = this;
    wx.downloadFile({
      url: app.globalData.serverUrl + '/recording/file/get/' + this.data.recordingInfo.id,
      header: {
        'content-type': 'application/octet-stream'
      },
      success: function (ssuccessres) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        recordingFile = ssuccessres.tempFilePath
        innerAudioContext.autoplay = true
        innerAudioContext.src = ssuccessres.tempFilePath;
        innerAudioContext.onPlay(() => {
          that.setData({
            playFlag: false
          })
          console.log('开始播放')
        })
        innerAudioContext.onError((res) => {
          console.log(res.errMsg)
          console.log(res.errCode)
        })

        innerAudioContext.onEnded((res) => {
          that.setData({
            playFlag: true
          })
        })
        console.log("res tempFilePath is : " + ssuccessres.tempFilePath)
        console.log(ssuccessres)
      },
      fail: function (failres) {
        console.log("fail : ")
        console.log(failres)
      }
    })
  },
  gotoReleaseRecording: function (options) {
    wx.navigateTo({
      url: '/pages/release/releaserecording/releaserecording?termid=' + this.data.recordingInfo.termid,
      // url: '/pages/release/releaserecording/releaserecording' + "?whereCome=termPage",
      success: function (res) { },
      fail: function (res) { },
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
    that.setData({
      loadingFlag: false
    })
    wx.request({
      url: app.globalData.serverUrl + "/num/" + app.globalData.userDB.id + "/info/" + this.data.recordingid,
      method: 'GET',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        // 需要传入的acordingId已经通过url传入，data部分为空
      },
      success: function (successRes) {
        that.setData({
          loadingFlag: true
        })
        console.log(successRes)
        if (successRes.data.data.zan)
          that.setData({
            zanpicture : "/images/recording/zaned.png"
          })
        else
          that.setData({
            zanpicture : "/images/recording/zan.png"
          })

        if (successRes.data.data.bad)
          that.setData({
            badpicture : "/images/recording/baded.png"
          })
        else
          that.setData({
            badpicture : "/images/recording/bad.png"
          })
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
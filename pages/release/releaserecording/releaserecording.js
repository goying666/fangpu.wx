const util = require('../../../utils/util.js')

const app = getApp()

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
// const options = {
//   duration: 6000,
//   sampleRate: 16000,
//   numberOfChannels: 1,
//   encodeBitRate: 24000,
//   format: 'aac',
//   frameSize: 50
// }

const options = {
  duration: 10000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 96000,
  format: 'mp3',
  frameSize: 50
}

var recordingFile = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordingButton:"长按录音",
    loading:false,
    playFlag:true,
    loadingFlag: true,
    recordFlag: false,
    opentypeValue: "",
    thisTerm: {
      address: "",
      addtime: "",
      content: "",
      id: 0,
      introduce: "",
      ownerid: 0,
      recordingids: null,
      recordingnum: 0,
      termclass: "",
      tingnum: 0,
      zannum: 0,
    },
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("enter into /pages/releaserecording/releaserecording page")
    var that = this;

    that.setData({
      loadingFlag: false
    })
    // 请求terminfo消息，展示
    wx.request({
      url: app.globalData.serverUrl + '/term/info',
      method: 'POST',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        id: options.termid,
      },
      success: function (successRes) {
        that.data.thisTerm = successRes.data.data,
          that.data.thisTerm.addtime = util.formatTime(new Date(successRes.data.data.addtime));
        that.setData({
          thisTerm: that.data.thisTerm,
          loadingFlag: true
        })
      },
      fail: function (failRes) {
        console.log(failRes)
      },
      complete: function (completeRes) {
        console.log(completeRes)
      }
    })
    this.data.thisTerm.id = options.termid
    that.setData({
      recordingInfo: {
        useravatarurl: app.globalData.userDB.avatarurl,
        usernickname: app.globalData.userDB.nickname,
        addtime: util.formatTime(new Date()),
        address: app.globalData.userAddress.join("-"),
      }
    });
  },

  submitRecording: function (res) {
    var that = this;

    that.setData({
      loadingFlag: false
    })
    this.data.recordingInfo = {
      termid: this.data.thisTerm.id,
      terminfo: this.data.thisTerm.content,
      userid: app.globalData.userDB.id,
      path: null,
      address: app.globalData.userAddress.join("-"),
      filename: null,
      tingnum: 0,
      zannum: 0,
      badnum: 0,
      addtime: null,
      shoucangnum: 0,
      sharenum: 0,
      useravatarurl: app.globalData.userDB.avatarurl,
      termclass: this.data.thisTerm.termclass,
      usernickname: app.globalData.userDB.nickname,
    }

    // 第一步：上传recordingInfo
    wx.request({
      url: app.globalData.serverUrl + '/recording/info/add',
      method: 'POST',
      header: {
        'content-type': 'application/json;'
      },
      data: this.data.recordingInfo,
      success: function (ressuccess) {

        that.data.recordingInfo.id = ressuccess.data.data.id
        console.log("that.data.recordingInfo.id is ::  " + ressuccess.data.data.id)
        console.log(" app.globalData.userDB.id ::  " + app.globalData.userDB.id)
        console.log(" app.globalData.userDB.id ::  " + app.globalData.userDB.id)
        // 第二步：将录下的音频上传至服务器；
        setTimeout(function () {
          // 上传音频文件
          wx.uploadFile({
            url: app.globalData.serverUrl + '/recording/file/add/' + app.globalData.userDB.id + '/recId/' + ressuccess.data.data.id,
            filePath: recordingFile,
            name: 'file',
            formData: {
              // 'user': 'test'
            },
            header: {
              'content-type': 'multipart/form-data'
            },
            success: function (resuploadFile) {
              console.log(resuploadFile.data);
              // 第三步：对term下面的acordingList 更新
              wx.request({
                url: app.globalData.serverUrl + '/recording/recordinglist/' + that.data.thisTerm.recordingids
                + '/recordingId/' + ressuccess.data.data.id + '/flag/add',
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
                },
                fail: function (failRes) {
                  console.log(failRes)
                },
                complete: function (completeRes) {
                  console.log(completeRes)
                }
              })

              that.setData({
                loadingFlag: false
              })
              //第四步：更新myrecording
              wx.request({
                url: app.globalData.serverUrl + '/my/myrecording/' + app.globalData.userDB.myrecordingid + '/recordinId/' + ressuccess.data.data.id + '/flag/add',
                method: 'GET',
                header: {
                  'content-type': 'application/json;'
                },// 设置请求的 header
                data: {
                },
                success: function (successRes) {
                  that.setData({
                    loadingFlag: true
                  })
                  wx.navigateBack({
                    delta: 1,
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
            fail: function (resuploadFile) {
              console.log(resuploadFile)
            }
          })
        }, 500);

      },
      fail: function (resfail) {
        console.log(resfail)
      },
      complete: function (rescomplete) {
        console.log(rescomplete)
      }
    })
    if (res.whereCome)
      wx.navigateBack({
        delta: 1,
      })
  },

  recordStart: function (res) {
    var that = this;
    wx.authorize({
      scope: 'scope.record',
      success(resauthorize) {
        console.log('resauthorize')
        console.log(resauthorize)
      },
      fail() {
        that.data.recordFlag = true;
      }
    })
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.record']) {
          that.data.opentypeValue = "contact";
          recorderManager.start(options);
          recorderManager.onStart(() => {
            console.log('recorder start')
          });
          recorderManager.onError(() => {
            console.log('error : ' + res)
          });
        } else {
          // 设置button的类型，用于下一次点击；
          // that.data.opentypeValue = "openSetting";
          if (that.data.recordFlag) {
            // 需要进入权限管理界面
            wx.openSetting({
              success: (res) => {
                console.log(res)
              }
            })
          }
          // console.log("res.authSetting['scope.record'] is false")
        }
      },
      fail(res) {
        console.log(res)
      }
    })
    that.setData({
      recordingButton: "录音中",
      loading:true,
    })
  },
 
  recordStop: function (recordStopres) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.record']) {
          recorderManager.stop();
          recorderManager.onStop((recordStopres) => {
            that.tempFilePath = recordStopres.tempFilePath;
            recordingFile = recordStopres.tempFilePath;
            // this.data.recordingInfo.fileName = res.tempFilePath.slice(9)
            that.data.recordingInfo.fileName = recordStopres.tempFilePath
            const { tempFilePath } = recordStopres
            console.log("onStop + ： " + recordStopres.tempFilePath);
            console.log(recordStopres);
          });
          //错误回调
          recorderManager.onError((recordStopres) => {
            console.log("onError");
            console.log(recordStopres);
          })

        }
      }
    })

    that.setData({
      recordingButton: "长按录音",
      loading: false,
    })
  }, 

  playButton: function (res) {
    var that = this;
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath;
    innerAudioContext.onPlay(() => {
      that.setData({
        playFlag : false
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

  }, 

  gotoTest: function (res) {
    wx.navigateTo({
      url: '/pages/release/oneterm/onterm',
    })
  },
  cancleSubmitButton: function (res) {
    wx.navigateBack({
      delta: 1
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
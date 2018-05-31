// pages/release/oneterm/onterm.js

const app = getApp()

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const options = {
  duration: 10000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 96000,
  format: 'mp3',
  frameSize: 50
}

// recorderManager.onPause(() => {
//   console.log('recorder pause')
// })
// recorderManager.onStop((res) => {
//   console.log('recorder stop', res)
//   const { tempFilePath } = res
// })
// recorderManager.onFrameRecorded((res) => {
//   const { frameBuffer } = res
//   console.log('frameBuffer.byteLength', frameBuffer.byteLength)
// })

var recordingFile = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneTermString: "",
    // recordingFile: "",
    //通过从上一个界面传下来的key，在今日十条中找到一个term，然后付给本页面进行展示
    oneterm: {},
    answerInfo: {
      id: "",
      path: "",
      answerFileName: "",
      termInfo: "",
      userId: "72",
      termId: "999",
      addTime: "",
      answerNum: "1"
    },
    answerFileNameIs:[]
  },
  recordStart: function (res) {
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')

    });
    recorderManager.onError(() => {
      console.log('error : ' + res)
    });
  },
  recordStop: function (res) {
    // setTimeout(function(){

    // },1000);
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      recordingFile = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      console.log('this.data.recordingFile is ', this.data.recordingFile)
      // console.log('tempFilePath is : ' + res.tempFilePath.slice(11))
      console.log('tempFilePath is : ' + res.tempFilePath)

      // 将刚录完的音频的名字记录进answerInfo.answerFileName中；
      this.data.answerInfo.answerFileName = res.tempFilePath.slice(9)
      
      this.data.answerFileNameIs[0] = res.tempFilePath.slice(0)
      this.data.answerFileNameIs[1] = res.tempFilePath.slice(10)
      this.data.answerFileNameIs[2] = res.tempFilePath.slice(15)
      app.globalData.logs = this.data.answerFileNameIs
      // this.data.answerInfo.answerFileName = res.tempFilePath
      console.log('answerInfo:answerFileName is : ' + this.data.answerInfo.answerFileName)
      const { tempFilePath } = res
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  downloadButton: function (res) {
    var that = this;
    wx.downloadFile({
      // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/answer/getoneanswer' + "?filePath=" + this.tempFilePath,
      url: app.globalData.serverUrl + '/answer/answer/getoneanswer' + "?filePath=" + this.tempFilePath,
      header: {
        'content-type': 'multipart/form-data'
      },
      success: function (res1) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        console.log("success res : " + res1)
        console.log("res tempFilePath is : " + res1.tempFilePath)
        // if (res.statusCode === 200) {
        //   that.innerAudioContext.src = res.tempFilePath
        // }
      },
      fail: function (res1) {
        console.log("fail : " + this.tempFilePath)
        console.log(res1)
      }
    })
  },
  submitButton: function (res) {
    // 第一步：上传answerInfo
    wx.request({
      // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/answer/addanswerinfo',
      url: app.globalData.serverUrl + '/answer/answer/addanswerinfo',
      method: 'POST',
      header: {
        'content-type': 'application/json;'
      },
      data: this.data.answerInfo,
      success: function (ressuccess) {
        
        // 第二步：将录下的音频上传至服务器；
        wx.uploadFile({
          // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/answer/addanswerrecording',
          url: app.globalData.serverUrl + '/answer/answer/addanswerrecording',
          filePath: recordingFile,
          name: 'file',
          formData: {
            // 'user': 'test'
          },
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (resuploadFile) {
            var data = resuploadFile.data;
            console.log(resuploadFile.data);
          },
          fail: function (resuploadFile) {
            console.log(resuploadFile)
          }
        })
      },
      fail: function (resfail) {
        console.log(resfail)
      },
      complete: function (rescomplete) {
        console.log(rescomplete)
      }
    })
    wx.navigateBack({
      delta: 1,
    })   
  },
  inputover: function (res) {
    this.setData({
      answerInfo: res.detail.value
    });
  },
  playButton: function (res) {
    var that = this;
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath;
      console.log(this.tempFilePath)
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },
  goback: function (e) {
    wx.navigateBack({
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // //通过从上一个界面传下来的key，在今日十条中找到一个term，然后付给本页面进行展示
    // this.data.onterm = app.globalData.todayTerms[options.key - 1];
    // console.log("id is : " + this.data.onterm.id);
    // console.log("zanNum is : " + this.data.onterm.zanNum);
    // console.log("termString is : " + this.data.onterm.termString);
    // this.setData({
    //   oneTermString: this.data.onterm.termString,
    // })
    // // 将本页面term的String赋值给上传answerInfo的terminfo；
    // this.data.answerInfo.termInfo = this.data.onterm.termString;
    // this.data.answerInfo.termId = this.data.onterm.id;
    // this.data.answerInfo.addTime = new Date;
    // app.globalData.logs = this.data.answerInfo;
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
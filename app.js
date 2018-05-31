//app.js
App({
  globalData: {
    serverUrl: "https://www.zujuba.com/fangpu",
    // serverUrl: "http://127.0.0.1:7899",
    userInfo: null,
    userDB: "",
    oneterminfo: "",
    termranks: [],
    recordingranks: [],
    userAddress:"",
    wxlogin: {
      "jscode": "",
      "encryptedData": "",
      "errMsg": "",
      "iv": "",
      "rawData": "",
      "signature": "",
    },
    userNum:{
      mytermnum: 0,
      myrecordingnum: 0,
      mysharenum: 0,
      myallzannum: 0,
    }
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("login success")
        this.globalData.wxlogin.jscode = res.code
        console.log(res)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.wxlogin.encryptedData = res.encryptedData
              this.globalData.wxlogin.signature = res.signature
              this.globalData.wxlogin.rawData = res.rawData
              this.globalData.wxlogin.iv = res.iv
              console.log("app.js 56")
              console.log(this.globalData)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                console.log("userInfoReadyCallback")
                this.globalData.userInfo = res.userInfo
                this.globalData.wxlogin.encryptedData = res.encryptedData
                this.globalData.wxlogin.signature = res.signature
                this.globalData.wxlogin.rawData = res.rawData
                this.globalData.wxlogin.iv = res.iv
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  } 
})


const app = getApp()

// pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: "term",
    loadingFlag:false,
    termRanks: [{
      address: "",
      addtime: "2018-05-21T03:08:23.000+0000",
      content: "测试4",
      id: 34,
      introduce: "安欣421",
      ownerid: 61,
      recordingids: "4",
      recordingnum: 0,
      termclass: "日常",
      tingnum: 0,
      zannum: 0,
      usernickname: "",
      useravatarurl: "",
      sharenum: "",
    },],
    recordingRanks: [
      {
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
      }],
    rankRes: [{
      userNickName: "安安",
      termInfo: "锄禾日当午，汗滴禾下土",
      zanNum: 123,
      tingNum: 321,
      userAddress: []
    },],
    myranknum: 0,
    userNum: {
      mytermnum: 0,
      myrecordingnum: 0,
      mysharenum: 0,
      myallzannum: 0,
    },
    userInfo: {
      id: "",
      nickname: "",
      avatarurl: "",
      gender: "",
      city: "",
      province: "",
      country: "",
      language: "",
      unionid: "",
      address: "",
      vip: "",
      mytermsid: "",
      myrecordingid: "",
      myrankid: "",
      myshareid: "",
    },
  },
  upnewtermlist: function (res) {
    //获取当前termlist的信息：内容+长度；
    var that = this;
    var ranksize = this.data.termRanks.length + 1;
    //请求服务器再返回10条term信息（传当前长度的参数）
    that.setData({
      loadingFlag:false
    })
    wx.request({
      url: app.globalData.serverUrl + '/rank/gettermrank/' + ranksize,
      method: 'GET',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        // 需要传入的acordingId已经通过url传入，data部分为空
      },
      success: function (successRes) {
        if (successRes.data.code == 7)
          app.globalData.termranks = app.globalData.termranks.concat(successRes.data.data);
        
        that.setData({
          termRanks: app.globalData.termranks,
        })
        setTimeout(function () {
          that.setData({
            loadingFlag: true
          })
        }, 10);
        console.log(successRes)
      },
      fail: function (failRes) {
        console.log(failRes)
      },
      complete: function (completeRes) {
        console.log(completeRes)
      }
    })
    //更新页面termlist显示；
  },
  gotoTermsOrRecordingPage: function (options) {
    var pageurl = "";
    if (this.data.flag == "term") {
      pageurl = '/pages/terms/terms'
    }
    else if (this.data.flag == "recording") {
      pageurl = "pages/recording/recording"
    };
    wx.navigateTo({
      url: pageurl + "?termid=" + this.data.termRanks[options.currentTarget.dataset.id].id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置排名界面区域名
    var that = this;
    var that = this;
    that.setData({
      loadingFlag: false
    })
    // 获取10个rank的信息
    wx.request({
      url: app.globalData.serverUrl + '/rank/gettermrank/1' ,
      method: 'GET',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        // 需要传入的acordingId已经通过url传入，data部分为空
      },
      success: function (successRes) {
        app.globalData.termranks = successRes.data.data;

      },
      fail: function (failRes) {
        console.log(failRes)
      },
      complete: function (completeRes) {
        console.log(completeRes)
        that.setData({
          loadingFlag: true
        })
      }
    })
    console.log(app.globalData)

    this.data.userInfo = app.globalData.userDB;
    // 设置排名界面区域名
    var that = this;
    setTimeout(function () {
      that.setData({
        termRanks: app.globalData.termranks,
        userInfo: app.globalData.userDB,
        recordingRanks: app.globalData.recordingranks,
        "userInfo.address": app.globalData.userAddress
      })
    }, 500);

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
          userNum: app.globalData.userNum,
        })
      },
      fail: function (failRes) {
        console.log(failRes)
      },
      complete: function (completeRes) {
        that.setData({
          loadingFlag: true
        })
        console.log(completeRes)
      }
    })
    that.setData({
      loadingFlag: false
    })
    // 获取myrank  
    wx.request({
      url: app.globalData.serverUrl + '/rank/getmygrank/' + app.globalData.userDB.id,
      method: 'GET',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        // 需要传入的acordingId已经通过url传入，data部分为空
      },
      success: function (successRes) {

        console.log("successRes")
        console.log(successRes)
        console.log("successRes")
        that.setData({
          myranknum: successRes.data.data,
        })
      },
      fail: function (failRes) {
        console.log(failRes)
      },
      complete: function (completeRes) {
        that.setData({
          loadingFlag: true
        })
        console.log(completeRes)
      }
    })
    that.setData({
      termRanks: app.globalData.termranks,
      recordingRanks: app.globalData.recordingranks,
      userNum: app.globalData.userNum,
      "userInfo.address": app.globalData.userAddress
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("渲染完毕")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 设置排名界面区域名
    var that = this;
    var that = this;
    that.setData({
      loadingFlag: false
    })
    console.log("app.globalData.termranks.length");
    console.log(app.globalData.termranks.length);
    // 获取10个rank的信息
    wx.request({
      url: app.globalData.serverUrl + '/rank/gettermrank/' + (app.globalData.termranks.length+1),
      method: 'GET',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        // 需要传入的acordingId已经通过url传入，data部分为空
      },
      success: function (successRes) {

        console.log("add termranks begin")
        console.log(successRes)
        if (successRes.data.data)
        app.globalData.termranks = app.globalData.termranks.concat(successRes.data.data);

      },
      fail: function (failRes) {
        console.log(failRes)
      },
      complete: function (completeRes) {
        console.log(completeRes)
        that.setData({
          loadingFlag: true
        })
      }
    })
    console.log(app.globalData)

    this.data.userInfo = app.globalData.userDB;
    // 设置排名界面区域名
    var that = this;
    setTimeout(function () {
      that.setData({
        termRanks: app.globalData.termranks,
        userInfo: app.globalData.userDB,
        recordingRanks: app.globalData.recordingranks,
        "userInfo.address": app.globalData.userAddress
      })
    }, 500);

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
          userNum: app.globalData.userNum,
        })
      },
      fail: function (failRes) {
        console.log(failRes)
      },
      complete: function (completeRes) {
        that.setData({
          loadingFlag: true
        })
        console.log(completeRes)
      }
    })
    that.setData({
      loadingFlag: false
    })
    // 获取myrank  
    wx.request({
      url: app.globalData.serverUrl + '/rank/getmygrank/' + app.globalData.userDB.id,
      method: 'GET',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        // 需要传入的acordingId已经通过url传入，data部分为空
      },
      success: function (successRes) {

        console.log("successRes")
        console.log(successRes)
        console.log("successRes")
        that.setData({
          myranknum: successRes.data.data,
        })
      },
      fail: function (failRes) {
        console.log(failRes)
      },
      complete: function (completeRes) {
        that.setData({
          loadingFlag: true
        })
        console.log(completeRes)
      }
    }) 
    that.setData({
      termRanks: app.globalData.termranks,
      recordingRanks: app.globalData.recordingranks,
      userNum: app.globalData.userNum,
      "userInfo.address": app.globalData.userAddress
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
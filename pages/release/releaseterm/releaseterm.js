const app = getApp()

// pages/terms/terms.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ["", "", ""],
    loadingFlag: true,
    termId: "",
    styleArray: ['日常', '诗词', '咨询', '商务', '笑话', '口头语', '其他'],
    content: "",
    introduce: "",
    index: 0,
    address: "",
  },
  finishInputContent: function (res) {
    this.setData({
      content: res.detail.value
    })
  },
  finishInputIntroduce: function (res) {
    this.setData({
      introduce: res.detail.value
    })
  },
  submitTerm: function (res) {
    var that = this;
    that.setData({
      loadingFlag: false
    })
    if (this.data.content != null) {
      wx.request({
        // url: app.globalData.serverUrl + ':7898/term/add',
        // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/term/add',
        url: app.globalData.serverUrl + '/term/add',
        method: 'POST',
        header: {
          'content-type': 'application/json;'
        },// 设置请求的 header
        data: {
          ownerid: app.globalData.userDB.id,
          address: app.globalData.userAddress.join(","),
          termclass: this.data.styleArray[this.data.index],
          content: this.data.content,
          introduce: this.data.introduce,
          tingnum: 0,
          zannum: 0,
          recordingnum: 0,
          usernickname: app.globalData.userDB.nickname,
          useravatarurl: app.globalData.userDB.avatarurl,
          sharenum: 0,
        },

        success: function (successres) {
          // 词条创建成功后，更新myterms
          wx.request({
            // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/terms/funa',
            url: app.globalData.serverUrl + '/my/myterms/' + app.globalData.userDB.mytermsid + '/termId/' + successres.data.data.id + '/flag/add',
            method: 'POST',
            header: {
              'content-type': 'application/json;'
            },
            data: {

            },
            success: function (res) {
              that.setData({
                loadingFlag: true
              })
              if (successres.data.code == 0) {
                wx.showToast({
                  title: successres.data.msg,
                  icon: 'success',
                  duration: 1000,
                  mask: true
                })
                wx.redirectTo({
                  url: '/pages/myterms/myterms',
                })
                // wx.navigateBack({
                //   delta: 1
                // })
              } else {
                wx.showToast({
                  title: successres.data.msg,
                  icon: 'fail',
                  duration: 1000,
                  mask: true
                })
              }
              console.log("success res " + res)
            },
            fail: function (res) {
              console.log("fail res " + res)
            },
            complete: function (res) {
              console.log("complete res " + res)
            }
          })
        },

        fail: function (res) {
          console.log(res)
        },

        complete: function (res) {
          console.log(res)
        }
      })
    } else {
      wx.showToast({
        title: '请输入有效词条',
        icon: 'fail',
        duration: 1000,
        mask: true
      })
    }

  },

  gotoAcordingPage: function (res) {
    var that = this;
    that.setData({
      loadingFlag: false
    })
    if (this.data.content != null) {
      wx.request({
        // url: app.globalData.serverUrl + ':7898/term/add',
        // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/term/add',
        url: app.globalData.serverUrl + '/term/add',
        method: 'POST',
        header: {
          'content-type': 'application/json;'
        },// 设置请求的 header
        data: {
          ownerid: app.globalData.userDB.id,
          address: app.globalData.userAddress.join(","),
          termclass: this.data.styleArray[this.data.index],
          content: this.data.content,
          introduce: this.data.introduce,
          tingnum: 0,
          zannum: 0,
          recordingnum: 0,
          usernickname: app.globalData.userDB.nickname,
          useravatarurl: app.globalData.userDB.avatarurl,
          sharenum: 0,
        },

        success: function (successres) {
          // 词条创建成功后，更新myterms
          wx.request({
            // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/terms/funa',
            url: app.globalData.serverUrl + '/my/myterms/' + app.globalData.userDB.mytermsid + '/termId/' + successres.data.data.id + '/flag/add',
            method: 'POST',
            header: {
              'content-type': 'application/json;'
            },
            data: {

            },
            success: function (res) {

              that.setData({
                loadingFlag: true
              })
              if (successres.data.code == 0) {
                wx.showToast({
                  title: successres.data.msg,
                  icon: 'success',
                  duration: 1000,
                  mask: true
                })

                wx.redirectTo({
                  url: "/pages/release/releaserecording/releaserecording?termid=" + successres.data.data.id,
                })
                // wx.navigateBack({
                //   delta: 1
                // })
              } else {
                wx.showToast({
                  title: successres.data.msg,
                  icon: 'fail',
                  duration: 1000,
                  mask: true
                })
              }
              console.log("success res " + res)
            },
            fail: function (res) {
              console.log("fail res " + res)
            },
            complete: function (res) {
              console.log("complete res " + res)
            }
          })
        },

        fail: function (res) {
          console.log(res)
        },

        complete: function (res) {
          console.log(res)
        }
      })
    } else {
      wx.showToast({
        title: '请输入有效词条',
        icon: 'fail',
        duration: 1000,
        mask: true
      })
    }

  },
  cancleSubmitButton: function (res) {
    wx.navigateBack({
      delta: 1
    })
  },
  bindPickerChange: function (res) {
    this.setData({
      index: res.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      region: app.globalData.userAddress,
      address: app.globalData.userAddress.join(",")
    })
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
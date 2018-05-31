//index.js
//获取应用实例
const app = getApp()

const logs = wx.getStorageSync('logs') || []
Page({
  data: {
    indexLog: "加载中",
    loadingFlag: true,
    requstDate: {},
    userDBflag: false,
    motto: 'Hello World',
    userinfoHiddenFlag: "false",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    region: ["陕西省", "汉中市", "南郑县"]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this; // 展示本地存储能力
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
        app.globalData.wxlogin.encryptedData = res.encryptedData
        app.globalData.wxlogin.signature = res.signature
        app.globalData.wxlogin.rawData = res.rawData
        app.globalData.wxlogin.iv = res.iv
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 有授权就进入获取一次，刷新页面的userinfo
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        console.log("run here 1")
        console.log(res)
        console.log("run here 1")
        // app.globalData.wxlogin.encryptedData = res.encryptedData
        // app.globalData.wxlogin.signature = res.signature
        // app.globalData.wxlogin.rawData = res.rawData
        // app.globalData.wxlogin.iv = res.iv
        console.log(app.globalData)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
    wx.getStorage({
      key: 'userDB',
      success: function (getStorageressuccess) {
        if (getStorageressuccess.data.address) {
          // 本地缓存有用户地址数据，直接去rank
          wx.switchTab({
            url: '/pages/rank/rank',
          })
          app.globalData.userAddress = getStorageressuccess.data.address.split(",");
          console.log("getStorageressuccess is here")
          console.log(getStorageressuccess.data)
          console.log("getStorageressuccess is here")

        } else if (getStorageressuccess.data) {
          // 本地缓存有用户数据，但没有地址数据，去address
          wx.navigateTo({
            url: '/pages/address/address?userid=' + getStorageressuccess.data.id,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) {
              console.log(res)
            },
          })
        }
        // 将缓存数据复制一份给全局userDB；
        app.globalData.userDB = getStorageressuccess.data;
        that.setData({
          loadingFlag: false
        })
        //用户登录信息上传；
        wx.request({
          // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/user/login',
          url: app.globalData.serverUrl + '/user/login',
          method: 'POST',
          header: {
            'content-type': 'application/json;'
          },
          data: {
            userid: getStorageressuccess.data.id
          },
          success: function (res) {
            setTimeout(function () {
              that.setData({
                loadingFlag: true
              })
            }, 10);
          },
          fail: function (res) { },
          complete: function (res) {
            console.log(res)
          }
        })
      },
    })
  },

  bindOpenShow: function (e) {
    if (app.globalData.userInfo) {
      // 判断用户是否已选过地址；
      // 先从本地缓存查，查不到再从数据库读，
      var that = this;
      wx.getStorage({
        key: 'userDB',
        success: function (getStorageReSsuccess) {
          console.log("getStorage success,ande res is : " + getStorageReSsuccess.data.id)
          var urladdress = '/pages/address/address?userid=' + getStorageReSsuccess.data.id
          console.log("urladdress is : " + urladdress)
          app.globalData.userDB = getStorageReSsuccess.data
          //用户登录信息上传；
          that.setData({
            loadingFlag: false,
            indexLog: "/user/login加载中",
          })
          wx.request({
            // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/user/login',
            url: app.globalData.serverUrl + '/user/login',
            method: 'POST',
            header: {
              'content-type': 'application/json;'
            },
            data: {
              userid: getStorageReSsuccess.data.id
            },
            success: function (res) {
              setTimeout(function () {
                that.setData({
                  loadingFlag: true
                })
              }, 10);
            },
            fail: function (res) { },
            complete: function (res) {
              console.log(res)
            }
          })
          if (getStorageReSsuccess.data.address) {
            // 数据库内用户地址存在就直接去rank界面
            wx.switchTab({
              url: '/pages/rank/rank',
            })
          }
          else {

            // 数据库内用户地址数据不存在，就去地址选取界面进行选取；
            wx.navigateTo({
              url: urladdress,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) {
                console.log(res)
              },
            })
          }
        },
        fail: function (getStorageResFail) {
          that.setData({
            loadingFlag: false,
            indexLog: "/user/wxlogin加载中",
          })
          console.log("getStorage fail,ande res is : ")
          console.log(getStorageResFail)
          console.log(app.globalData)
          // 认证微信登录信息是否为真
          wx.request({
            url: app.globalData.serverUrl + '/user/wxlogin',
            method: 'POST',
            header: {
              'content-type': 'application/json;'
            },// 设置请求的 header
            data: app.globalData.wxlogin,
            success: function (successRes) {
              console.log("/user/wxlogin successRes")
              console.log(successRes)
              // 注册新用户
              that.setData({
                loadingFlag: false,
                indexLog: "/user/addinfo加载中",
              })
              wx.request({
                url: app.globalData.serverUrl + '/user/addinfo',
                method: 'POST',
                header: {
                  'content-type': 'application/json;'
                },
                data: {
                  avatarurl: app.globalData.userInfo.avatarUrl,
                  nickname: app.globalData.userInfo.nickName,
                  gender: app.globalData.userInfo.gender,
                  city: app.globalData.userInfo.city,
                  province: app.globalData.userInfo.province,
                  country: app.globalData.userInfo.country,
                  language: app.globalData.userInfo.language,
                  openid: successRes.data.data.openId,
                  unionid: successRes.data.data.unionId,
                },
                success: function (res) {
                  console.log("/user/addinfo success res")
                  console.log(res)
                  that.setData({
                    loadingFlag: true
                  })
                  if (res.data.data.address) {
                    // 数据库内用户地址存在就直接去rank界面
                    wx.switchTab({
                      url: '/pages/rank/rank',
                    })
                    app.globalData.userAddress = res.data.data.address.split(",");
                  }
                  else {
                    // 数据库内用户地址数据不存在，就去地址选取界面进行选取；
                    wx.navigateTo({
                      url: '/pages/address/address?userid=' + res.data.data.id,
                      success: function (res) { },
                      fail: function (res) { },
                      complete: function (res) {
                        console.log(res)
                      },
                    })
                    console.log("addinfo success: address is none ")
                  }
                  // 将数据库中用户的信息更新一份到缓存userInfo中
                  wx.setStorage({
                    key: 'userDB',
                    data: res.data.data,
                  })
                  // 将数据库中用户数据赋值给全局变量userInfo
                  app.globalData.userDB = res.data.data;
                },
                fail: function (res) {
                  console.log("/user/addinfo fail res")
                  console.log(res)
                  wx.showToast({
                    title: "添加用户失败，请退出后重试",
                    icon: 'none',
                    duration: 1000,
                    mask: true
                  })
                },
                complete: function (res) {
                  console.log(res.data)
                }
              })
            },
            fail: function (failRes) {
              wx.showToast({
                title: '登录验证信息失败，请退出后重试',
                icon: 'none',
                duration: 1000,
                mask: true
              })
              that.setData({
                loadingFlag: true,
                indexLog: "加载中",
              })
              console.log("/user/wxlogin failRes")
              console.log(failRes)
            },
            complete: function (completeRes) {
              console.log(completeRes)
            }
          })


        },
      })
    } else {
      wx.showToast({
        title: '信息无法查询，请提供基本信息',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      console.log("please enter your basic information")
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo

    app.globalData.wxlogin.encryptedData = e.detail.encryptedData
    app.globalData.wxlogin.signature = e.detail.signature
    app.globalData.wxlogin.rawData = e.detail.rawData
    app.globalData.wxlogin.iv = e.detail.iv
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    console.log(app.globalData)
  }

})

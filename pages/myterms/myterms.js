const app = getApp()

// pages/myterms/myterms.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleteHidden: true,
    deletesrc: [],
    deleteidlist: null,
    deleteidargs: [],
    allControllText: "批量管理",
    okButton: true,
    loadingFlag: true,
    scrollViewCondition: "",
    allMyTermNum: "",
    allMyTerms: [{
      address: "",
      addtime: "",
      content: "",
      id: 34,
      introduce: "",
      ownerid: 61,
      recordingids: null,
      recordingnum: 0,
      termclass: "日常",
      tingnum: 0,
      zannum: 0,
    }],
    size: "",
    currentNumber: ""
  },

  selectOneTerm: function (options) {
    var that = this;
    this.data.currentNumber = this.data.size - options.currentTarget.dataset.id - 1;
    console.log(options.currentTarget.dataset.id)
    if (this.data.allControllText == "批量管理") {
      wx.navigateTo({
        url: '/pages/terms/terms?termid=' + this.data.allMyTerms[this.data.currentNumber].id,
      })
    } else if (this.data.allControllText == "取消修改") {
      if (that.data.deletesrc[this.data.currentNumber] == "/images/delete.png")
        that.data.deletesrc[this.data.currentNumber] = "/images/deleted.png";
      else
        that.data.deletesrc[this.data.currentNumber] = "/images/delete.png";
      that.setData({
        deletesrc: this.data.deletesrc,
      })
    }
  },
  controllAllButton: function (options) {
    var that = this;
    if (this.data.allControllText == "批量管理") {
      that.setData({
        deleteHidden: false,      // 显示删除图标
        okButton: false,          // 显示删除按钮
        allControllText: "取消修改",// 修改自身为"取消修改"   
      })
      console.log("src is : 1")
      console.log(that.data.deletesrc)
    } else if (this.data.allControllText == "取消修改") {
      that.setData({
        deleteHidden: true,// 隐藏删除图标
        okButton: true,// 隐藏删除按钮
        allControllText: "批量管理"// 修改自身为"批量管理"
      })
      console.log("src is : 2")
      console.log(that.data.deletesrc)
    }
    // 初始化待删除的参数
    for (var i = 0; i < that.data.deletesrc.length; i++) {
      that.data.deletesrc[i] = "/images/delete.png"
    }
    that.setData({
      deleteidlist: null,
      deletesrc: this.data.deletesrc,
    })
  },
  okButtonTap: function (options) {
    var that = this;
    // 获取删除list
    // 发送给服务器
    // 刷新 1、列表内容；2、按键；3、初始化待删除的参数
    if (that.data.allControllText == "取消修改") {
      if (that.data.deletesrc) {
        // 组装listString
        for (var i = 0; i < that.data.deletesrc.length; i++) {
          if (that.data.deletesrc[i] == "/images/deleted.png") {
            if (that.data.deleteidlist)
              that.data.deleteidlist = that.data.deleteidlist + "-" + that.data.allMyTerms[i].id
            else
              that.data.deleteidlist = that.data.allMyTerms[i].id
          }
        }
        console.log(that.data.deleteidlist)

        that.setData({
          loadingFlag: false
        })

        if (that.data.deleteidlist) {
          wx.request({
            url: app.globalData.serverUrl + '/term/delete',
            method: 'POST',
            header: {
              'content-type': 'application/json;'
            },// 设置请求的 header
            data: {
              deleteidlist: this.data.deleteidlist,
              mytermsid: app.globalData.userDB.mytermsid,
            },
            success: function (successRes) {

              that.setData({
                loadingFlag: true,
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
        } else
          console.log("that.data.deleteidlist is null!~")

        // 初始化待删除的参数
        for (var i = 0; i < that.data.deletesrc.length; i++) {
          that.data.deletesrc[i] = "/images/delete.png"
        }
        that.setData({
          deleteHidden: true,// 隐藏删除图标
          okButton: true,// 隐藏删除按钮
          allControllText: "批量管理",// 修改自身为"批量管理"
          deleteidlist: null,
        })
      }
    }

    setTimeout(function () {
      that.setData({
        loadingFlag: false
      })
      wx.request({
        url: app.globalData.serverUrl + '/my/myterms/get/' + app.globalData.userDB.mytermsid,
        method: 'GET',
        header: {
          'content-type': 'application/json;'
        },// 设置请求的 header
        success: function (successRes) {
          // that.data.allMyTerms = successRes.data.data

          that.data.allMyTerms = successRes.data.data;
          for (var i = 0; i < successRes.data.data.length; i++) {
            that.data.allMyTerms[i].addtime = that.data.allMyTerms[i].addtime.replace("T", " ").slice(0, 19);
            that.data.deletesrc[i] = "/images/delete.png";
          }
          that.setData({
            allMyTerms: successRes.data.data,
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
    }, 500);

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
    that.setData({
      loadingFlag: false
    })
    wx.request({
      url: app.globalData.serverUrl + '/my/myterms/get/' + app.globalData.userDB.mytermsid,
      method: 'GET',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      success: function (successRes) {
        // that.data.allMyTerms = successRes.data.data

        that.data.allMyTerms = successRes.data.data;

        if (successRes.data.data) {
          console.log("successRes.data.data is not null")
          for (var i = 0; i < successRes.data.data.length; i++) {
            that.data.allMyTerms[i].addtime = that.data.allMyTerms[i].addtime.replace("T", " ").slice(0, 19);
            that.data.deletesrc[i] = "/images/delete.png";
          }
          that.setData({
            allMyTerms: successRes.data.data,
            size: successRes.data.data.length
          })
          that.setData({
            scrollViewCondition: true,
          })
        } else {
          console.log("successRes.data.data is null")
          that.setData({
            allMyTerms: null,
            size: 0
          })
          that.setData({
            scrollViewCondition: false,
          })
        }
        
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
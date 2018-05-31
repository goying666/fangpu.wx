const app = getApp()

// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ["陕西省", "汉中市", "南郑县"],
    regionstr: '["陕西省", "汉中市", "南郑县"]',
    regionjson: [{ "1": "陕西省" }, { "1": "汉中市" }, { "1": "南郑县" }],
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    }) 
    app.globalData.userAddress = e.detail.value;
  },

  finishButton: function (finishRes) {
    console.log("userid is : " + app.globalData.userDB.id),
      console.log(finishRes),
    // this.data.users.useraddress = this.data.region.join(",");
    wx.request({

      // url: app.globalData.serverUrl + app.globalData.serverMoudle + '/user/address/add',
      url: app.globalData.serverUrl + '/user/address/add',
      method: 'POST',
      header: {
        'content-type': 'application/json;'
      },// 设置请求的 header
      data: {
        id: app.globalData.userDB.id,
        address: this.data.region.join(","),
      },
      success: function (res) {
        wx.switchTab({
          url: '/pages/rank/rank',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        // 将数据库中用户的信息更新一份到缓存userInfo中
        app.globalData.userDB.address = res.data.data.address;
        wx.setStorage({
          key: 'userDB',
          data: app.globalData.userDB,
        })
        app.globalData.userAddress = res.data.data.address.split(",");
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options.userid)
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
    console.log(this.data.region)
    console.log(JSON.stringify(this.data.region))
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
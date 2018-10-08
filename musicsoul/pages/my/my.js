const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo: null,
    Albums:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      navHeight: app.globalData.navHeight,
      hasUserInfo:app.globalData.hasUserInfo,
      userInfo:app.globalData.userInfo
    })

    wx.cloud.callFunction({
      name: 'album',
      data: {
        action: "getMyalbum",
      },
      complete: res => {
        console.log(res)
        this.setData({
          Albums:res.result.data
        })
      },
    })
  },


  onGetUserInfo: function(event) {
    console.log('用户信息')
    console.log(event)
    let userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: userInfo
      })
      app.globalData.hasUserInfo = true
      app.globalData.userInfo = userInfo
    }
  },
})
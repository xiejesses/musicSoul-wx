// musicsoul/pages/my/my.js
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
    // this.setData({
    //   navHeight: app.globalData.navHeight,
    //   hasUserInfo:app.globalData.hasUserInfo,
    //   userInfo:app.globalData.userInfo
    // })
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

  },

  // hasGottenUserInfo: function(){
  //   wx.getSetting({
  //     success: (data) => {
  //       if (data.authSetting['scope.userInfo']) {
  //         wx.getUserInfo({
  //           success: (data) => {
  //             this.setData({
  //               hasUserInfo: true,
  //               userInfo: data.userInfo
  //             })
  //           }
  //         })
  //       } else {
  //         this.setData({
  //           hasUserInfo: false
  //         })
  //       }
  //     }
  //   })
  // },

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
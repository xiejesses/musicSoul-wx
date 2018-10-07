const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumdetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.cloud.callFunction({
      name: 'album',
      data: {
        id:options.id,
        action: "getAlbumdetail",
      },
      complete: res => {
        console.log(res)
        this.setData({
          albumdetail:res.result.data[0]
        })
        console.log(this.data.albumdetail)
      },
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
    this.setData({
      navHeight: app.globalData.navHeight,
      screenHeight:app.globalData.screenHeight,
    })
    console.log(this.data.screenHeight)
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
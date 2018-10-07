// musicsoul/pages/create/create.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumDes:'',
    albumName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: app.globalData.navHeight,
      userInfo:app.globalData.userInfo
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

  },
  formSubmit: function (e) {
    console.log(e.detail.value)
    // let that = this;
    wx.cloud.callFunction({
      name: 'album',
      data: {
        action: "create",
        albumName:e.detail.value.albumName,
        albumDes:e.detail.value.albumDes,
        creatorAvatar:this.data.userInfo.avatarUrl,
        creator:this.data.userInfo.nickName
      },
      complete: res => {
        if(res.result._id) {
          wx.showToast({
            title: '创建成功',
            icon: 'success'
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            },500)
          
        }
        console.log(res)
      },
    })
  },
  onCancel: function () {
    this.setData({
      albumDes:'',
      albumName:''
    })
    wx.navigateBack({
      delta: 1
    });
  }
})
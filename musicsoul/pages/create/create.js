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

  formSubmit: function (e) {
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
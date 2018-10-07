// musicsoul/pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword:'',
    songlists:[],
    loadingCenter:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: app.globalData.navHeight
    })
    // console.log(options)
    // this.setData({
    //   keyword:options.value
    // })
    // this.onConfirm()
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

  /**
   * 按确认发起搜索
   */
  onConfirm: function (event) {
    let keyword = event.detail.value;

    // let keyword = this.data.keyword
    this.setData({
      songlists:[],
      loadingCenter:true,
    })

    wx.cloud.callFunction({
      name: 'searchsong',
      data: {
        keyword:keyword,
        action:'search'
      },
      complete: res => {
        console.log(res.result.result)
        this.setData({
          loadingCenter:false,
        })
        this.setData({
          songlists:res.result.result.songs
        })
      },
    })
  },
  onDelete: function (event) {
    console.log(event)
    this.setData({
      songlists:[],
      keyword:''
    })
  },
  onCancel: function () {
    this.setData({
      songlists:[],
      keyword:''
    })
    wx.navigateBack({
      delta: 1
    });
  }

})
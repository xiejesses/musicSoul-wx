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
  },

  /**
   * 按确认发起搜索
   */
  onConfirm: function (event) {
    let keyword = event.detail.value;

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
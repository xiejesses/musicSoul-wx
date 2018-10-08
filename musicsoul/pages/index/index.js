//index.js
const app = getApp()

Page({
  data: {
    Albums: [],
    tmpAlbums:[],
    page: 0,
    more: true,
    loading:false,
    loadingCenter:false,
    empty:false
  },

  onLoad: function() {
    // var that = this;

    this.setData({
      navHeight: app.globalData.navHeight
    })
    console.log(this.data.navHeight);
    this.setData({
      loadingCenter:true
    })
    this.getindexalbums(true)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getindexalbums(true)
  },

  getindexalbums(init) {

    this.setData({
      loading:true
    })

    new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'album',
          data: {
            action: "getAllalbum",
            page: this.data.page,
          },
          complete: res => {
            resolve(res)
          },
        })
      }).then(res => {
        this.setData({
          loading:false
        })
        console.log(res)
        if (res.result.data.length < 3 && this.data.page > 0) {
          this.data.more = false
          this.setData({
            empty:true
          })
        }
        if (init) {
          this.setData({
            Albums:res.result.data
          })
          this.setData({
            loadingCenter:false
          })
        } else {
          this.setData({
            Albums:this.data.Albums.concat(res.result.data)
          })
        }
      })

    

  },
  onReachBottom() {
    if (!this.data.more) {
      // 没有更多了
      return false
    }
    this.data.page = this.data.page + 1
    this.getindexalbums(false)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.cloud.callFunction({
      name: 'album',
      data: {
        action: "getAllalbum",
        page: 0
      },
      complete: res => {
        wx.stopPullDownRefresh()
        this.data.more = true
        this.data.page = 0
        this.setData({
          Albums:res.result.data,
          empty:false
        })
      },
    })
  },

  clickSearch: function() {
    wx.navigateTo({
      url:"/pages/search/search"
    })
  }

})

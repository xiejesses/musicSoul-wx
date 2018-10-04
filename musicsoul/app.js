//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
    this.globalData.backgroundPlayer = wx.getBackgroundAudioManager();
    // 获取手机系统信息
  wx.getSystemInfo({
    success: res => {
      //导航高度
      this.globalData.navHeight = res.statusBarHeight + 46;
      this.globalData.winHeight = res.windowHeight;
      this.globalData.screenHeight = res.screenHeight;
    }, fail(err) {
      console.log(err);
    }
  })
  },
  
})

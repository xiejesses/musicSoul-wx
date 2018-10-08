//app.js
App({
  onLaunch: function () {
    this.globalData = {}
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env: 'test-1ff606', //测试环境
        traceUser: true,
      })
    }

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

    wx.getSetting({
      success: (data) => {
        if (data.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (data) => {
              this.globalData.hasUserInfo = true,
              this.globalData.userInfo = data.userInfo
            }
          })
        } else {
          this.globalData.hasUserInfo = false,
          this.globalData.userInfo = null
        }
      }
    })


  },
  
})

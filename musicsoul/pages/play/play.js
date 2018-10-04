import utils from '../../utils/utils';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    songdetail:{},
    pickerAlbums:['+新建','test'],
    currentTime: '00:00',
    duration: '00:00',
    progressWidth: 0,
    play_status:false,
    playing: false,
    waiting: true,
    drag: false,
    playUrl:'/images/play.png',
    pauseUrl:'/images/pause.png',
    songSrc:'http://music.163.com/song/media/outer/url?id=',
    hasUserInfo:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      navHeight: app.globalData.navHeight,
      screenHeight:app.globalData.screenHeight,
      hasUserInfo:app.globalData.hasUserInfo
    })
    console.log(options)
    console.log('可使用窗口高度' + app.globalData.winHeight)
    console.log('屏幕高度' + app.globalData.screenHeight)
    

    // wx.cloud.callFunction({
    //   name: 'searchsong',
    //   data: {
    //     id:options.id,
    //     action:'getdetail'
    //   },
    //   complete: res => {
    //     console.log(res)
    //     this.setData({
    //       songdetail:res.result.songs[0]
    //     })
    //   },
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
    const that = this;

    

    wx.getBackgroundAudioPlayerState({
      success: res => {
        switch (res.status) {
          case 0:
            that.setData({ play_status: false });
            break;
          case 1:
            that.setData({ play_status: true });
            break;
          default:
            break;
        }
      }
    });
    // this.backgroundPlayer = app.globalData.backgroundPlayer;

    const currentPlayerId = this.data.id;
    // const currentPlayerId = wx.getStorageSync('currentPlayerId');
    // if (currentPlayerId) {
    //   const currentI = data.songs.findIndex(item => Number(item.id) === Number(currentPlayerId));
    //   if (currentI > -1) {
    //     this.setData({
    //       playerData: data.songs[currentI],
    //       i: currentI
    //     });
    //   }
    // } else {
    //   this.setData({
    //     playerData: data.songs[this.data.i]
    //   });
    // }
    // this.setData({
    //   playerData: data.songs[this.data.i]
    // });

    // 如果当前有音频
    if (!this.backgroundPlayer.src || this.backgroundPlayer.src !== this.data.playerData.src) {
      // 给背景音频赋值
      this.backgroundPlayer.src = this.data.songSrc + this.data.id;
      this.backgroundPlayer.title = '心跳';
      // this.backgroundPlayer.title = this.data.songdetail.name;
      // this.backgroundPlayer.coverImgUrl = this.data.songdetail.al.picUrl;
      // wx.setStorageSync('currentPlayerId', this.data.playerData.id);
    }
    this.duration = this.backgroundPlayer.duration * 1000 || 0;
    this.currentTime = this.backgroundPlayer.currentTime * 1000 || 0;

    const {duration, currentTime, progressWidth} = this.setProgress(this.duration, this.currentTime);
    that.setData({
      duration,
      currentTime,
      progressWidth
    });

    // 音频开始播放
    this.backgroundPlayer.onPlay(() => {
      that.setData({
        play_status: true
      });
      this.duration = this.backgroundPlayer.duration * 1000 || 0;
    });

    // 音频播放进度控制
    this.backgroundPlayer.onTimeUpdate(() => {
      that.duration = that.backgroundPlayer.duration * 1000;
      that.currentTime = that.backgroundPlayer.currentTime * 1000;

      const {duration, currentTime, progressWidth} = this.setProgress(that.duration, that.currentTime);
      if (that.data.drag) {
        that.setData({
          currentTime,
          waiting: false
        });
        return;
      }
      that.setData({
        duration,
        currentTime,
        progressWidth,
        waiting: false
      });
    });

    // 音频暂停后
    this.backgroundPlayer.onPause(() => {
      that.setData({ play_status: false });
    });

    // 音频停止后
    this.backgroundPlayer.onStop(() => {
      that.setData({ play_status: false });
    });

    // 自然播放后，自动切换到下一首
    // this.backgroundPlayer.onEnded(() => {
    //   if (that.data.i < Number(data.songs && data.songs.length - 1)) {
    //     that.setData({
    //       playerData: data.songs[that.data.i + 1],
    //       i: that.data.i + 1
    //     });
    //     that.backgroundPlayer.src = that.data.playerData.src;
    //     that.backgroundPlayer.title = that.data.playerData.name;
    //     that.backgroundPlayer.coverImgUrl = that.data.playerData.image;
    //     wx.setStorageSync('currentPlayerId', that.data.playerData.id);
    //   } else {
    //     const { duration } = this.setProgress(that.duration, 0);
    //     that.setData({
    //       duration
    //     });
    //   }
    // });

    this.backgroundPlayer.onPrev(() => {
      that.prev();
    });

    this.backgroundPlayer.onNext(() => {
      that.next();
    });

    this.backgroundPlayer.onWaiting(() => {
      this.setData({
        waiting: true
      });
    });

    // this.backgroundPlayer.onError((res) => {
    //   let msg = '';
    //   switch (res.errCode) {
    //     case 10001:
    //       msg = '系统错误';
    //       break;
    //     case 10002:
    //       msg = '网络错误';
    //       break;
    //     case 10003:
    //       msg = '文件错误';
    //       break;
    //     case 10004:
    //       msg = '格式错误';
    //       break;
    //     default:
    //       msg = '未知错误';
    //       break;
    //   }
    //   toast.toast({
    //     show: true,
    //     content: msg
    //   });
    //   that.setData({ waiting: true });
    // });
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

  changePlayerStatus: function () {
    this.setData({
      play_status: !this.data.play_status
    });
    if (this.data.play_status) {
      this.backgroundPlayer.play();
    } else {
      this.backgroundPlayer.pause();
    }
  },

   /**
   * 设置进度函数
   * @param duration
   * @param currentTime
   * @returns {{duration: *, currentTime: *, progressWidth: string}}
   */
  setProgress(duration, currentTime) {
    return {
      duration: utils.formatTime(new Date(duration)),
      currentTime: utils.formatTime(new Date(currentTime)),
      progressWidth: parseFloat(currentTime / duration * 100).toFixed(2)
    };
  },
  /**
   * 拖拽开始，记录当前拖拽的pageX
   * @param e
   */
  touchStartProgress(e) {
    this.setData({ drag: true });
    this.touchStart = e.changedTouches[0].pageX;
    this.progress = parseInt(this.data.progressWidth * utils.rpxIntoPx(500) / 100);
  },
  /**
   * 拖拽中，记录当前的pageX，并且与开始拖拽的点以及播放的当前进度条长度进行计算，得出拖拽的长度，重设播放进度条
   * @param e
   */
  touchMoveProgress(e) {
    let spacing = this.progress + e.changedTouches[0].pageX - this.touchStart;
    if (spacing >= utils.rpxIntoPx(500)) {
      spacing = utils.rpxIntoPx(500);
    } else if (spacing <= 0) {
      spacing = 0;
    }
    const progressWidth = parseFloat(spacing / utils.rpxIntoPx(500) * 100).toFixed(2);
    this.setData({
      progressWidth
    });
  },
  /**
   * 拖拽结束后，记录当前的pageX，并且与开始拖拽的点以及播放的当前进度条长度进行计算，得出拖拽的长度，重设播放进度条
   * @param e
   */
  touchEndProgress(e) {
    let spacing = this.progress + e.changedTouches[0].pageX - this.touchStart;
    if (spacing >= utils.rpxIntoPx(500)) {
      spacing = utils.rpxIntoPx(500);
    } else if (spacing <= 0) {
      spacing = 0;
    }
    const progressWidth = parseFloat(spacing / utils.rpxIntoPx(500) * 100).toFixed(2);
    this.setData({
      progressWidth,
      drag: false
    });
    this.currentTime = progressWidth * this.duration / 100 || 0;
    this.backgroundPlayer.seek(this.currentTime / 1000);
  },
 

  // prev() {
  //   if (this.data.i === 0) {
  //     toast.toast({
  //       show: true,
  //       content: '已经是第一首'
  //     });
  //     return;
  //   }
  //   const currentIndex = this.data.i - 1;
  //   if (data.songs && data.songs[currentIndex]) {
  //     this.backgroundPlayer.src = data.songs[currentIndex].src;
  //     this.backgroundPlayer.title = data.songs[currentIndex].name;
  //     this.backgroundPlayer.coverImgUrl = data.songs[currentIndex].image;
  //     wx.setStorageSync('currentPlayerId', data.songs[currentIndex].id);
  //     this.setData({
  //       playerData: data.songs[currentIndex],
  //       i: currentIndex
  //     });
  //   }

  // },

  // next() {
  //   if (this.data.i === Number(data.songs && data.songs.length - 1)) {
  //     toast.toast({
  //       show: true,
  //       content: '已经是最后一首'
  //     });
  //     return;
  //   }
  //   const currentIndex = this.data.i + 1;
  //   if (data.songs && data.songs[currentIndex]) {
  //     this.backgroundPlayer.src = data.songs[currentIndex].src;
  //     this.backgroundPlayer.title = data.songs[currentIndex].name;
  //     this.backgroundPlayer.coverImgUrl = data.songs[currentIndex].image;
  //     wx.setStorageSync('currentPlayerId', data.songs[currentIndex].id);
  //     this.setData({
  //       playerData: data.songs[currentIndex],
  //       i: currentIndex
  //     });
  //   }
  // },

  goback:function () {
    wx.navigateBack({
      delta: 1
    });
  },
  bindPickerChange: function(event) {
    console.log('picker发送选择改变，携带值为', this.data.pickerAlbums[event.detail.value])

    // if (!app.globalData.hasUserInfo) {
    //   console.log("还没有登录呢")
    // } else if (this.data.pickerAlbums[event.detail.value] === '+新建') {
    //   wx.navigateTo({
    //     url: '/pages/create/create',
    //     success: (result)=>{
          
    //     },
    //     fail: ()=>{},
    //     complete: ()=>{}
    //   });
    // }

    if (this.data.pickerAlbums[event.detail.value] === '+新建') {
      wx.navigateTo({
        url: '/pages/create/create',
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },
  onGetUserInfo: function(event) {
    let userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        hasUserInfo: true,
        // userInfo: userInfo
      })
      app.globalData.hasUserInfo = true,
      app.globalData.userInfo = userInfo
    }
  },
  // checklogin: function() {
  //   console.log('还没登录')
  //   wx.showModal({
  //     title: '请先登录！',
  //     // content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
  //     confirmText: "登录",
  //     cancelText: "算了",
  //     success: function (res) {
  //       // console.log(res);
  //       if (res.confirm) {
  //         console.log('点了去登录');
  //            wx.navigateTo({
  //             url: '/pages/index/main?activeIndex=1',
  //           })
  //           self.getalbums();
  //       } else {
  //         console.log('点了算了')
  //       }
  //     }
  //   });
  // }
})
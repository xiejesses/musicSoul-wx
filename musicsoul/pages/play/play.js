import utils from '../../utils/utils';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    title:'',
    songdetail:{},
    Albums: [],
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
      title:options.title,
      navHeight: app.globalData.navHeight,
      screenHeight:app.globalData.screenHeight,
      hasUserInfo:app.globalData.hasUserInfo
    })

    wx.cloud.callFunction({
      name: 'searchsong',
      data: {
        id:options.id,
        action:'getdetail'
      },
      complete: res => {
        console.log(res)
        //只获取需要的数据
        let tmp = {}
        tmp.id = res.result.songs[0].id
        tmp.name = res.result.songs[0].name
        tmp.author = res.result.songs[0].ar[0].name
        tmp.picUrl = res.result.songs[0].al.picUrl
        this.setData({
          songdetail:tmp
        })
      },
    })
    this.getAlbums();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;

    this.getAlbums();
    

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
    this.backgroundPlayer = app.globalData.backgroundPlayer;

    let currentPlayerId = this.data.id;

    // 如果当前有音频
    // if (!this.backgroundPlayer.src || this.backgroundPlayer.src !== this.data.playerData.src) {
      // if(currentPlayerId !== this.data.id) {
        this.backgroundPlayer.src = this.data.songSrc + this.data.id;
        this.backgroundPlayer.title = this.data.title;
    // }
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
    this.backgroundPlayer.onEnded(() => {
      that.setData({ play_status: false });
    });

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
 
  goback:function () {
    wx.navigateBack({
      delta: 1
    });
  },
  addsong: function(event) {
    let that = this
    if (this.data.Albums[event.detail.value].albumName === '+新建') {
      wx.navigateTo({
        url: '/pages/create/create',
      });
    } else {
      wx.cloud.callFunction({
        name: 'album',
        data: {
          action: "addsong",
          albumId:that.data.Albums[event.detail.value]._id,
          songdetail:that.data.songdetail
        },
        complete: res => {
          console.log(res)
          if (res.result.stats.updated === 1) {
            wx.showToast({
              title: '添加成功',
              icon: 'success'
              })
          }
        },
      })
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
  getAlbums:function() {
    let that = this
    wx.cloud.callFunction({
      name: 'album',
      data: {
        action: "getMyalbum",
      },
      complete: res => {
        res.result.data.unshift({
          _id: 0,
          albumName: '+新建'
        })
        that.setData({
          Albums:res.result.data
        })
      },
    })
  }
})
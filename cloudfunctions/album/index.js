// 云函数入口文件
const cloud = require('wx-server-sdk')
// const TcbRouter = require('tcb-router');

cloud.init()
const db = cloud.database({
  env: 'test-1ff606'
})

// 云函数入口函数
exports.main = async (event, context) => {

    const size = 3

    // const app = new TcbRouter({ event });
    if (event.action === 'create') {
        try {
            return await db.collection('albums').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                  openId:event.userInfo.openId,
                  creatorAvatar:event.creatorAvatar,
                  creator:event.creator,
                  albumName: event.albumName,
                  albumDes: event.albumDes,
                  createTime: db.serverDate(),
              }
            })
          } catch(e) {
            console.error(e)
          }
    }
    if (event.action === 'getAllalbum') {
        try {
            return await db.collection('albums').field({
                  _id:true,
                  albumName:true,
                  albumDes:true,
                  albumPic:true
              }).orderBy('updateTime', 'desc').limit(size).skip(Number(event.page) * size).get()
          } catch(e) {
            console.error(e)
          }
    }
    if (event.action === 'getAlbumdetail') {
        try {
            return await db.collection('albums').where({
                _id: event.id
              }).get()
          } catch(e) {
            console.error(e)
          }
    }
    if (event.action === 'getMyalbum') {
        try {
            return await db.collection('albums').where({
                openId: event.userInfo.openId 
              }).field({
                  albumName:true,
                  albumPic:true,
                  songs:true,
                  _id:true
              }).orderBy('createTime', 'desc').get()
          } catch(e) {
            console.error(e)
          }
    }
    if (event.action === 'addsong') {
        try {
              const _ = db.command
              return await db.collection('albums').doc(event.albumId).update({
                data: {
                  albumPic:event.songdetail.picUrl,
                  updateTime: db.serverDate(),
                  songs: _.push({
                    songId:event.songdetail.id,
                    songName:event.songdetail.name,
                    songAuthor:event.songdetail.author,
                    songPic:event.songdetail.picUrl,
                    addTime: new Date(),//使用db.serverDate()存在 bug,等待官方修复
                  })
                },
              })
          } catch(e) {
            console.error(e)
          }
    }
    
  }
//app.js
const util = require("/utils/util.js")
const API = require("/utils/api.js")
App({
  globalData: {
    userinfo: null,
    openid: null,
    user: null
  },
  //检查用户使用版本是否为最新版本，若不是则提醒用户重启更新
  checkUpdate: function () {
    //版本更新器
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
  },
  //自动获取用户头像
  getUserInfo: function () {
    var that = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //若已经授权，则直接调用getUserInfo获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.globalData.userinfo = res.userInfo
              console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回，所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true
      })
    }

    var that = this
    //进行版本更新检查
    that.checkUpdate()
    //获取用户头像和用户名
    that.getUserInfo()
    // 自动登录
    wx.login({
      success: res => {
        var code = res.code; //登录凭证
        if (code) {
          //请求自动登录API
          util.request(API.LoginUrl, { code: code })
            .then(function (res) {
              console.log(res)
              that.globalData.user = res
              that.globalData.openid = res.userOpenId
            }).catch(function (err) {
              console.log(err)
            });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: console.log
    })

  }
})

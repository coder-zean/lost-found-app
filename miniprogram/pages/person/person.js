
var app = getApp()
Page({
  data: {
    menuItems: [
      { text: '个人信息', url: '../usermes/usermes', icon: '/image/userMsg.png', tips: '' },
      { text: '我的发布', url: '../myPost/myPost', icon: '/image/myPost.png', tips: '' },
      { text: '我的收藏', url: '../collection/collection', icon: '/image/collect-active.png', tips: '' },
      { text: '关于我们', url: '../aboutUs/aboutUs', icon: '/image/aboutUs.png', tips: '' }
    ],
    userinfo:{},
    extraData: { id: "35486"},
    openid:"",
    administrator1:"oK4or5MxodU-ds7srcJe0fUvB52E"
  },

  onLoad: function (options) {
    var info=app.globalData.userinfo;
    console.log(app.globalData.userinfo);
    this.setData({
      userinfo:info,
      openid: app.globalData.openid
    })
  },
  //获取用户登录授权
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userinfo = e.detail.userInfo
    this.setData({
      userinfo: e.detail.userInfo,
    })
    //重新获取openid
    app.onLaunch();
  }
  
})
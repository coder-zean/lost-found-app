// pages/person/person.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuitems: [
      { text: '账号信息', url: '../usermes/usermes', icon: '../../image/usermes.png', tips: '' },
      { text: '我的帖子', url: '../myPost/myPost?', icon: '../../image/book.png', tips: '' },
      { text: '我的收藏', url: '../collection/collection?', icon: '../../image/star.png', tips: '' },
      { text: '关于我们', url: '../aboutUs/aboutUs', icon: '../../image/us.png', tips: '' }
    ],
    userinfo:{},
    extraData: { id: "35486"},
    openid:"",
    administrator1:"oK4or5MxodU-ds7srcJe0fUvB52E"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this 
    var info=app.globalData.userinfo;
    console.log(app.globalData.userinfo);
    that.setData({
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
var app=getApp()
var util = require('../../utils/util.js');
var API = require('../../utils/api.js');
Page({

  data: {
    username: null,
    studentNumber: null,
    phone: null,
    weChat: null,
    qq: null,
    college: null,
    studentClass: null,
    grade: null,
    nullString:"null"
  },

  onShow: function (options) {
    if (app.globalData.user == null ) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
        duration:1500
      })
    } else {
      this.getUserMesRequest()
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.onLoad();
  },
  //获取用户基本信息
  getUserMesRequest:function(){
    var that=this;
    wx.showLoading({
      title: "加载中...",
    })
    util.request(API.UserMsgUrl, {
      userId: app.globalData.user.userId
    }).then(function(res){
      that.setData({
        username: res.username,
        studentNumber: res.studentNumber,
        phone: res.phone,
        weChat: res.weChat,
        qq: res.qq,
        college: res.college,
        studentClass: res.studentClass,
        grade: res.grade
      })
      app.globalData.user=res
      wx.hideLoading()
    }).catch(function(err){
      wx.hideLoading()
      util.showErrModal()
    })
  },
  //跳转至完善信息页
  toWriteMes:function(){
    if (app.globalData.user == null ) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
        duration:1500
      })
    } else {
      wx.navigateTo({
        url: '../writeMes/writeMes?username='+this.data.username+'&studentNumber='+this.data.studentNumber
        +'&phone='+this.data.phone+'&weChat='+this.data.weChat+"&qq="+this.data.qq+"&college="+this.data.college
        +'&grade='+this.data.grade+'&studentClass='+this.data.studentClass
      })
    }
  },


})
// pages/usermes/usermes.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTime:0,
    username: null,
    studentNumber: null,
    phone: null,
    wechat: null,
    qq: null,
    college: null,
    studentClass: null,
    grade: null,
    nullString:"null"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.openid == null || app.globalData.openid == "" || app.globalData.openid == "null") {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else {
      this.getUserMesRequest()
    }
  },

  getUserMesRequest:function(){
    var that=this;
    wx.request({
      url: 'https://www.wubaotop.cn/personal/getUserMes',
      data: {
        userId: app.globalData.openid
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          username: res.data.username,
          studentNumber: res.data.studentNumber,
          phone: res.data.phone,
          wechat: res.data.wechat,
          qq: res.data.qq,
          college: res.data.college,
          studentClass: res.data.studentClass,
          grade: res.data.grade
        })
      },
      fail: function () {
        wx.showToast({
          title: '获取信息失败',
          icon:"none"
        })
        setTimeout(function(){
          wx.hideToast()
        },2000)
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var count=this.data.showTime
    this.setData({
      showTime:count+1
    })
    if(this.data.showTime>1){
      wx.startPullDownRefresh({
      })
    }
  },

  //跳转至完善信息页
  toWriteMes:function(){
    if (app.globalData.openid == null || app.globalData.openid == "" || app.globalData.openid == "null") {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else {
      wx.navigateTo({
        url: '../writeMes/writeMes?username='+this.data.username+'&studentNumber='+this.data.studentNumber
        +'&phone='+this.data.phone+'&wechat='+this.data.wechat+"&qq="+this.data.qq+"&college="+this.data.college
        +'&grade='+this.data.grade+'&studentClass='+this.data.studentClass
      })
    }
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  }

})
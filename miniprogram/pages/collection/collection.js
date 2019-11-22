// pages/collection/collection.js
var app=getApp()
var util = require('../../utils/util.js');
var API = require('../../utils/api.js');
Page({

  data: {
    thingList:[],
    isNoData: false
  },

  onLoad: function (options) {
    if (app.globalData.user == null) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
        duration:2000
      })
    } else {
      this.collectionRequest()
    }
  },
  onPullDownRefresh: function () {
    this.setData({
      isNoData:false
    })
    this.collectionRequest()
  },
  //获取我的收藏列表请求
  collectionRequest:function(){
    var that = this
    wx.showLoading({
      title: '加载中...'
    })
    util.request(API.CollectionListUrl, {
      userId: app.globalData.user.userId
    }).then(function(res){
      if(res.length==0){
        that.setData({
          isNoData: true
        })
      }
      that.setData({
        thingList: res
      })
      wx.hideLoading();
    }).catch(function(err){
      that.setData({
        isNoData: true
      })
      wx.hideLoading()
      util.showErrModal()
    })
  },
  //点击取消收藏时，确定用户是否要删除
  openConfirm: function (e) {
    var that = this
    var list = that.data.thingList
    console.log(e);
    wx.showModal({
      title: '取消收藏',
      content: '你确定要取消收藏吗？',
      confirmText: "确定",
      cancelText: "放弃操作",
      success: function (res) {
        //如果用户点击确定，则进行取消收藏操作
        if (res.confirm) {
          wx.showLoading({
            title: '删除中..',
          })
          util.request(API.RemoveCollectionUrl, {
            userId: app.globalData.user.userId,
            thingId: e.target.dataset.id
          }).then(function(res){
            list.splice(e.target.dataset.index, 1)
            console.log(list)
            that.setData({
              thingList: list
            })
            wx.hideLoading()
          }).catch(function(err){
            wx.hideLoading()
            util.showErrModal()
          })
        }
      }
    });
  },
  //查看详情
  toMore:function(e){
    console.log(e)
    wx.navigateTo({
      url: '../more/more?id=' + e.target.dataset.id
    })
  },
  //跳转至发布帖子页面
  post: function () {
    wx.navigateTo({
      url: '../post/post'
    })
  },



  
})
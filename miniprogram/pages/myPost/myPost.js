// pages/myPost/myPost.js
var app=getApp()
var util = require('../../utils/util.js');
var API = require('../../utils/api.js');
Page({

  data: {
    thingList:[],
    isNoData: false
  },

  onShow: function (options) {
    if (app.globalData.user==null){
      wx.showToast({
        title: '请先登录',
        icon:"none",
        duration:2000
      })
    }else{
      this.myPostRequest();
    }
  },
  onPullDownRefresh: function () {
    this.myPostRequest();
  },
  //获取我的帖子列表
  myPostRequest:function(){
    var that=this
    wx.showLoading({
      title: '加载中'
    })
    util.request(API.MyLostModelListUrl, {
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
      wx.hideLoading()
    }).catch(function(err){
      that.setData({
        isNoData: true
      })
      wx.hideLoading()
      util.showErrModal()
    })
  },
  //跳转至修改帖子的页面
  toUpdataPost:function(e){
    var data=JSON.stringify(e.target.dataset.thing)
    wx.navigateTo({
      url: '../updataPost/updataPost?data=' + data
    })  
  },
  //跳转至发布帖子页面
  post: function () {
    wx.navigateTo({
      url: '../post/post'
    })
  },
  //点击删除帖子时，确定用户是否要删除
  openConfirm: function (e) {
    var that=this
    var list=that.data.thingList
    wx.showModal({
      title: '删帖操作',
      content: '你确定要删除帖子吗？',
      confirmText: "确定",
      cancelText: "放弃删除",
      success: function (r) {
        if (r.confirm) {
          wx.showLoading({
            title: '删除中..',
          })
          util.request(API.RemoveModelUrl, {
            id: e.target.dataset.id
          }).then(function(res){
            var newList = list.splice(e.target.dataset.index, 1)
            that.setData({
              thingList: list
            })
            wx.hideLoading()
            wx.showToast({
              title: '删帖成功',
              duration: 1500
            })
          }).catch(function(err){
            wx.hideLoading()
            util.showErrModal()
          })
        }
      }
    });
  },
  //点击完成帖子时，确定用户是否要完成帖子
  haveFound:function(e){
    var that = this
    console.log(e);
    wx.showModal({
      title: '完成帖子',
      content: '你确定要完成该帖子吗？若完成帖子，则帖子状态将会变成"已找到"，且该操作无法撤销',
      success(res){
        if (res.confirm) {
          wx.showLoading({
            title: '操作中..',
          })
          util.request(API.HaveFoundUrl, {
            id: e.target.dataset.id
          }).then(function(res){
            wx.hideLoading()
            wx.showToast({
              title: '操作成功',
              duration: 2000
            })
          }).catch(function(err){
            wx.hideLoading()
            util.showErrModal()
          })
        }
      }
    });
  },

 
})
// pages/myPost/myPost.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thingList:[],
    showTime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    if (app.globalData.openid==null){
      wx.showToast({
        title: '请先登录',
        icon:"none"
      })
      setTimeout(function(){
        wx.hideToast()
      },2000)
    }else{
      that.myPostRequest();
    }
  },

  //页面显示的时候就刷新
  onShow: function () {
    var count=this.data.showTime
    this.setData({
      showTime:count+1
    })
    if(this.data.showTime>1){
      wx.startPullDownRefresh();
    }
    
  },

  //向服务器请求获得我的帖子
  myPostRequest:function(){
    var that=this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: 'https://www.wubaotop.cn/personal/myPost',
      data: {
        userId: app.globalData.openid
      },
      success: function (res) {
        that.setData({
          thingList: res.data
        })
        wx.hideLoading();
        console.log(that.data.thingList)
        console.log(res.data)
      },
      fail: function () {
        wx.showToast({
          title: '加载失败',
          icon: "none"
        })
        setTimeout(function () {
          wx, wx.hideToast()
        }, 2000)
      }
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
    console.log(e);
    wx.showModal({
      title: '删帖操作',
      content: '你确定要删除帖子吗？',
      confirmText: "确定",
      cancelText: "放弃删除",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          wx.request({
            url: 'https://www.wubaotop.cn/personal/removePost',
            data:{
              id: e.target.dataset.id
            },
            success:function(){
              var newList = list.splice(e.target.dataset.index, 1)
              console.log(newList)
              console.log(list)
              that.setData({
                thingList: list
              })
            },
            fail:function(){
              wx.showToast({
                title: '删帖失败',
                icon:"none"
              })
              setTimeout(function(){
                wx.hideToast()
              },2000)
            }
          })
        } else {
          console.log('放弃删帖')
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
      confirmText: "确定",
      cancelText: "放弃操作",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          wx.request({
            url: 'https://www.wubaotop.cn/personal/isFound',
            data: {
              id: e.target.dataset.id
            },
            success: function () {
              wx.showToast({
                title: '操作成功',
                icon: "success"
              })
              setTimeout(function () {
                wx.hideToast()
              }, 2000)
            },
            fail: function () {
              wx.showToast({
                title: '操作失败',
                icon: "none"
              })
              setTimeout(function () {
                wx.hideToast()
              }, 2000)
            }
          })
        } else {
          console.log('放弃完成帖子')
        }
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.myPostRequest();
  },
 

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }

  
})
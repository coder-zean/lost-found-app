// pages/collection/collection.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thingList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.openid == null) {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else {
      that.collectionRequest()
    }
  },


  //获取我的收藏列表请求
  collectionRequest:function(){
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: 'https://www.wubaotop.cn/personal/myCollection',
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
        console.log(res);
        //如果用户点击确定，则进行取消收藏操作
        if (res.confirm) {
          wx.request({
            url: 'https://www.wubaotop.cn/personal/removeCollection',
            data: {
              userId:app.globalData.openid,
              thingId: e.target.dataset.id
            },
            success: function () {
              list.splice(e.target.dataset.index, 1)
              console.log(list)
              that.setData({
                thingList: list
              })
            },
            fail: function () {
              wx.showToast({
                title: '取消收藏失败',
                icon: "none"
              })
              setTimeout(function () {
                wx.hideToast()
              }, 2000)
            }
          })
        } else {
          console.log('放弃取消收藏')
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.collectionRequest()
  }

  
})
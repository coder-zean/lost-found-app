// pages/searchResult/searchResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadCount:1,
    pageSize:15,
    thingList:[],
    campus:null,
    thingType:null,
    value:null,
    push:false
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      campus: options.campus,
      thingType: options.thingType,
      value: options.value
    })
    console.log(this.data.value)
    this.seachRequest()
  },

  //加载请求加载搜索结果
  seachRequest:function(){
    var that=this
    var list=that.data.thingList
    var count=that.data.loadCount
    wx.showLoading({
      title: '玩命记载中...',
    })
    wx.request({
      url: 'https://www.wubaotop.cn/lostModel/search',
      data: {
        campus: that.data.campus,
        thingType: that.data.thingType,
        value: that.data.value,
        loadCount: that.data.loadCount,
        pageSize:that.data.pageSize
      },
      success: function (res) {
        if(res.data.code==1){
          that.setData({
            thingList: list.concat(res.data.data),
            loadCount: count + 1
          })
          console.log(that.data.loadCount)
          console.log(that.data.thingList)
          if (that.data.loadCount <= 2 && res.data.data.length == 0) {
            wx.showModal({
              title: '搜索为空',
              content: '小程序中并无与搜索关键词有关帖子，请返回重新输入新关键词',
              showCancel:false
            })
          }
          if (res.data.data.length < 15) {
            that.setData({
              push: false
            })
          }
          wx.hideLoading()
        }else{
          wx.hideLoading()
          wx.showModal({
            title: '加载失败',
            content: '服务器出现异常，请重试并向管理人员反馈，谢谢',
            showCancel:false
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '加载失败',
          content: '网络出现异常，请检查网络并重试',
          showCancel: false
        })
        that.setData({
          searchResult: true
        })
      }
    })
  },


  //下拉刷新事件
  onPullDownRefresh: function () {
    this.setData({
      loadCount:1,
      searchResult:false,
      push: true,
      thingList: []
    })
    this.seachRequest()
  },

  onReachBottom: function () {
    this.seachRequest();
  },

  onShareAppMessage: function () {
  
  }
})
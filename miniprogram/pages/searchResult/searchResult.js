var util = require('../../utils/util.js');
var API = require('../../utils/api.js');
Page({

  data: {
    loadCount:1,
    pageSize:15,
    thingList:[],
    campus:null,
    thingType:null,
    value:null,
    push:false,
    isNoData:false
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
    util.request(API.SearchResultUrl,{
      campus: that.data.campus,
      thingType: that.data.thingType,
      value: that.data.value,
      loadCount: that.data.loadCount,
      pageSize: that.data.pageSize
    }).then(function(res){
      that.setData({
        thingList: list.concat(res),
        loadCount: count + 1
      })
      if (that.data.loadCount <= 2 && res.length == 0) {
        wx.showModal({
          title: '搜索为空',
          content: '搜索为空，请返回换关键词重新搜索',
          showCancel: false
        })
        that.setData({
          isNoData:true
        })
      }
      if (res.length < 15) {
        that.setData({
          push: false
        })
      }
      wx.hideLoading()
    }).catch(function(err){
      that.setData({
        isNoData: true
      })
      wx.hideLoading()
      util.showErrModal()
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
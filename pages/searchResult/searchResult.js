// pages/searchResult/searchResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadCount:1,
    pageSize:15,
    thingList:[],
    searchResult:false,     //结果为空的时候变为true，在页面显示为搜索结果为空
    campus:null,
    thingType:null,
    value:null,
    push:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      campus: options.campus,
      thingType: options.thingType,
      value: options.value
    })
    console.log(this.data.value)
    //请求加载数据
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
      url: 'https://www.wubaotop.cn/search/searchThing',
      data: {
        campus: that.data.campus,
        thingType: that.data.thingType,
        value: that.data.value,
        loadCount: that.data.loadCount,
        pageSize:that.data.pageSize
      },
      success: function (res) {
        that.setData({
          thingList: list.concat(res.data),
          loadCount:count+1
        })
        console.log(that.data.loadCount)
        console.log(that.data.thingList)
        if (that.data.loadCount<=2&&res.data.length == 0) {
          that.setData({
            searchResult: true
          })
        }
        if (res.data.length <15){
          that.setData({
            push: false
          })
        }
        wx.hideLoading()
      },
      fail: function () {
        wx.showToast({
          title: '搜索失败',
          icon: "none"
        }),
          setTimeout(function () {
            wx.hideToast();
          }, 2000)
        that.setData({
          searchResult: true
        })
        console.log(that.data.searchResult)
        wx.hideLoading()
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
    //重新请求加载数据
    this.seachRequest()
  },

  //页面上拉触底加载更多数据
  onReachBottom: function () {
    this.seachRequest();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
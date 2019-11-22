//获取应用实例
const app = getApp()
var util=require("../../utils/util.js")
var API = require("../../utils/api.js")
Page({
  data: {
    tabs: ["寻物启事", "失物招领"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    campus: 1,         //校区，0为肇庆，1为广州
    xwthingList: [],   //寻物启事列表
    swthingList: [],   //失物招领列表
    pageSize: 15,      //设置一次只加载15条数据
    loadCount: [1, 1],      //记录加载次数
    tabCount: 1,            //记录nav切换次数
    xwpush:true,            //用于判断上拉是否还有数据
    swpush:true,
    show: true
  },

  //请求获取帖子列表函数
  thingListRes: function () {
    var that = this;
    var countList = that.data.loadCount;
    var xwlist = that.data.xwthingList
    var swlist = that.data.swthingList
    var xwcount = "loadCount[0]"
    var swcount = "loadCount[1]"
    wx.showLoading({
      title: '玩命记载中...'
    })
    //请求获取寻物启事或失物招领数据
    util.request(API.LostModelListUrl, {
      thingType: that.data.activeIndex,
      campus: that.data.campus,
      pageSize: that.data.pageSize,
      loadCount: countList[that.data.activeIndex]
    }).then(function (res) {
      console.log(res)
      if (that.data.activeIndex == 0) {
        that.setData({
          xwthingList: xwlist.concat(res),
          [xwcount]: countList[0] + 1,
          //如果返回的数据长度少于15，证明已经没有更多数据
          xwpush: res.length < 15 ? false : true
        })
      } else {
        that.setData({
          swthingList: swlist.concat(res),
          [swcount]: countList[1] + 1,
          swpush: res.length < 15 ? false : true
        })
      }
      wx.hideLoading()
    }).catch(function (err) {
      wx.hideLoading()
      util.showErrModal()
    })
  },

  onLoad: function () {
    var that=this
    /*
  获取缓存看用户是否第一次打开该页面，
  若是则显示分享提醒，若不是则关闭分享提醒
*/
    wx.getStorage({
      key: 'two',
      success(res) {
        that.setData({
          show: false
        })
      },
      fail(err) {
        wx.setStorageSync("two", 1)
      }
    })
    that.thingListRes();
  },
  //隐藏蒙版
  hideview: function () {
    this.setData({
      show: false
    })
  },

  //下拉刷新事件
  onPullDownRefresh: function () {
    var xwcount="loadCount[0]"
    var swcount="loadCount[1]"
    if (this.data.activeIndex==0){
      this.setData({
        xwthingList:[],
        [xwcount]:1
      })
    }else{
      this.setData({
        swthingList: [],
        [swcount]: 1
      })
    }
    this.thingListRes()
  },

  //页面上拉触底加载更多数据
  onReachBottom: function () {
    if ((this.data.activeIndex == 0 && !this.data.xwpush) || (this.data.activeIndex == 1 && !this.data.swpush)){
      wx.showToast({
        title: '没有更多信息..',
        icon:"none",
        duration:1500
      })
    } else{
      this.thingListRes()
    }
  },

  //nav导航栏切换函数
  tabSelect: function (e) {
    console.log(e)
    this.setData({
      activeIndex: e.currentTarget.dataset.id
    });
    if (this.data.tabCount == 1) {
      //第一次切换都要重新请求获得数据
      this.thingListRes();
      this.setData({
        tabCount: 2
      })
    }
  },

  //以卡片的方式分享给微信联系人
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '广金寻物',
      path: "/pages/found/found"
    }
  },
  //跳转至详情页
  navToMore:function(e){
    console.log(e)
    wx.navigateTo({
      url: '../more/more?id=' + e.currentTarget.dataset.id,
    })
  },

  //跳转至发布帖子页面
  post: function () {
    wx.navigateTo({
      url: '../post/post'
    })
  },
})

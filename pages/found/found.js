
//获取应用实例
const app = getApp()

Page({
  data: {
    tabs: ["肇庆校区", "广州校区"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    thingType: 0,   //thingType用来记录该页面的物品类型，0为寻物，1为招领
    gzthingList: [],   //用来存放请求返回的广州物品数据对象
    zqthingList: [],   //用来存放请求返回的肇庆物品数据对象
    pageSize: 15,      //设置一次只加载15条数据
    loadCount: [1, 1],      //记录广州上拉加载的次数
    tabCount: 1,        //记录tab函数被触发次数，只被触发一次时，向服务器再请求一次thingList
    zqpush:true,           //用于判断上拉是否还有数据
    gzpush:true,
    zqsubPlace:[],
    gzsubPlace: []
  },

  onLoad: function () {
    //初次请求事件
    this.thingListRes();
    console.log(this.data.loadCount);
  },

  //下拉刷新事件
  onPullDownRefresh: function () {
    var zqcount="loadCount[0]"
    var gzcount="loadCount[1]"
    if (this.data.activeIndex==0){
      this.setData({
        zqthingList:[],
        [zqcount]:1
      })
    }else{
      this.setData({
        gzthingList: [],
        [gzcount]: 1
      })
    }
    console.log(this.data.loadCount)
    //初次请求事件
    this.thingListRes();
    
  },

  //跳转至发布帖子页面
  post: function () {
    wx.navigateTo({
      url: '../post/post'
    })
  },

  //页面上拉触底加载更多数据
  onReachBottom: function () {
    this.thingListRes()
  },

  //请求获取帖子列表函数
  thingListRes: function () {
    var that = this;
    var count = that.data.loadCount;
    var zqlist = that.data.zqthingList
    var gzlist = that.data.gzthingList
    var zqcount = "loadCount[0]"
    var gzcount = "loadCount[1]"
    console.log(count[that.data.activeIndex])
    wx.showLoading({
      title: '玩命记载中...',
    })
    //页面加载时加载数据
    wx.request({
      url: 'https://www.wubaotop.cn/show/thingList',
      data: {
        thingType: that.data.thingType,
        campus: that.data.activeIndex,
        pageSize: that.data.pageSize,
        loadCount: count[that.data.activeIndex]
      },
      success: function (res) {
        console.log(res)
        if (that.data.activeIndex == 0) {
          that.setData({
            zqthingList: zqlist.concat(res.data),
            [zqcount]: count[0] + 1
          })
          //如果返回的数据长度少于15，证明已经没有更多数据
          if (res.data.length < 15) {
            that.setData({
              zqpush: false
            })
          } else {
            that.setData({
              zqpush: true
            })
          }
        } else {
          that.setData({
            gzthingList: gzlist.concat(res.data),
            [gzcount]:count[1]+1
          })
          //如果返回的数据长度少于15，证明已经没有更多数据
          if (res.data.length < 15) {
            that.setData({
              gzpush: false
            })
          } else {
            that.setData({
              gzpush: true
            })
          }
        }
        console.log(that.data.loadCount)
        wx.hideLoading();
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '加载失败',
          icon: "none"
        })
        setTimeout(function () {
          wx.hideToast();
        }, 2000)
      }
    })
  },

  //nav导航栏切换函数
  tabClick: function (e) {
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
  }
})

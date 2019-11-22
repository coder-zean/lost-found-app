// pages/aboutUs/aboutUs.js
Page({

  data: {
    zanshang:true
  },

  onLoad: function (options) {
  
  },

  zan:function(){
    this.setData({
      zanshang:false
    })
  },

  //图片的预览
  previewImage:function(e){
    console.log(e)
    var urls = ["https://wubao-1256131373.cos.ap-guangzhou.myqcloud.com/xunwuImg/cord.jpg", "https://wubao-1256131373.cos.ap-guangzhou.myqcloud.com/xunwuImg/zanshang.jpg"]
    var current = urls[e.currentTarget.dataset.index]
    wx.previewImage({
      current: current,           // 当前显示图片的http链接
      urls:urls,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      zanshang:true
    })
  },

  onShareAppMessage: function () {
  
  }
})
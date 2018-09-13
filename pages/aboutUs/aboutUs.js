// pages/aboutUs/aboutUs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zanshang:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
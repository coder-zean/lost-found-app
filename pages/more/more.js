
var app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subContent:"",
    id:"",
    title:"",
    content:"",
    time:"",
    isFound:0,
    imgSrc:[],
    campus:"",
    thingType:"",
    contactType:0,
    contactNum:"",
    phone:"",
    place:"",
    found:false,
    contact:"微信",
    hidden:true,     //设置是否隐藏画板
    canvasPic:"",
    isCollect:false,
    nullString:"null",
    oString:""
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
      },1500)
    }
    console.log(app.globalData.openid)
    that.setData({
      id:options.id
    })
    console.log(that.data.id)
    //请求获取相应id的物品详细信息
    wx.request({
      url: 'https://www.wubaotop.cn/show/showThingInDetail',
      data:{
        id:options.id
      },
      success:function(res){
        var imgUrlList = that.data.imgSrc
        imgUrlList.push(res.data.imgSrc1)
        console.log(res.data)
        that.setData({
          subContent:res.data.subContent,
          title: res.data.title,
          content: res.data.content,
          time: res.data.time,
          isFound: res.data.isFound,
          contactType: res.data.contactType,
          contactNum: res.data.contactNum,
          phone: res.data.phone,
          place: res.data.place,
          campus:res.data.campus,
          thingType:res.data.thingType
        })
        if(res.data.imgSrc2!=null){
          imgUrlList.push(res.data.imgSrc2)
        }
        if (res.data.imgSrc3 != null) {
          imgUrlList.push(res.data.imgSrc3)
        }
        that.setData({
          imgSrc:imgUrlList
        })
        if(res.data.isFound==1){
          that.setData({
            found:true
          })
        }
        if (res.data.contactType == 1) {
          that.setData({
            contact:"QQ号"
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '获取失败',
          icon:"none"
        })
        setTimeout(function(){
          wx.hideToast()
        },2000)
      }
    })
    //如果已经登录，则查看该物品是否被收藏
    if (app.globalData.openid!=null){
      wx.request({
        url: 'https://www.wubaotop.cn/show/isCollect',
        data:{
          userId: app.globalData.openid,
          thingId:that.data.id,
          campus:that.data.campus,
          thingType:that.data.thingType
        },
        success:function(res){
          console.log(res)
          if(res.data==false){
            that.setData({
              isCollect:false
            })
          }else{
            that.setData({
              isCollect:true
            })
          }
          console.log("isCollect" + that.data.isCollect)
        }
      })
    }
  },

  //图片预览
  previewImg:function(e){
    console.log(e)
    var urls=this.data.imgSrc
    var current = urls[e.currentTarget.dataset.index]
    wx.previewImage({
      current: current,           // 当前显示图片的http链接
      urls: urls,
    })
  },

  //返回首页
  returnIndex:function(){
    wx.reLaunch({
      url: '../found/found',
      fail: function () {
        console.log("跳转失败")
      }
    })
  },

  //以卡片的方式分享给微信联系人
  onShareAppMessage:function(){
    var that=this;
    return {
      title: '广金寻物',
      desc: that.data.title,
      path: "/pages/more/more?id="+that.data.id,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  //收藏功能的实现
  collect:function(){
    var that=this;
    //判断是否登录，若无登录则提示先登录
    if (app.globalData.openid==null){
      wx.showToast({
        title: "请先登录",
        icon:"none"
      })
      setTimeout(function(){
        wx.hideToast();
      },1500)
    }else{
      wx.request({
        url: 'https://www.wubaotop.cn/show/collect',
        data:{
          userId: app.globalData.openid,
          thingId:that.data.id,
          campus: that.data.campus,
          thingType: that.data.thingType
        },
        success:function(){
          that.setData({
            isCollect:true
          })
          wx.showToast({
            title: '收藏成功',
            icon: "success"
          })
          setTimeout(function () {
            wx.hideToast()
          }, 1500)
        },
        fail:function(){
          wx.showToast({
            title: '收藏失败',
            icon:"none"
          })
          setTimeout(function(){
            wx.hideToast()
          },1500)
        }
      })
    }
  },

  //以生成图片的方式分享给群或朋友圈
  sharePic:function(){
    wx.showLoading({
      title: '生成图片中...',
      mask:true
    })
    var that=this
    var imgSrc = that.data.imgSrc
    var ctx = wx.createCanvasContext('share')
    var path=""
    that.setData({
      hidden:false
    })
    wx.request({
      url: 'https://www.wubaotop.cn/show/qrcord',
      data: {
        scene: that.data.id
      },
      success: function (res) {
        console.log(res.data)
        wx.getImageInfo({
          src: res.data,
          success: function (res2) {
            ctx.setFillStyle('white')
            ctx.fillRect(0, 0, 310, 570)
            ctx.setFillStyle("#2095F1")
            ctx.setFontSize(25)
            ctx.setTextAlign('center')
            if (that.data.thingType == 0) {
              ctx.fillText("寻 物 启 事", 155, 260)
            } else {
              ctx.fillText("失 物 招 领", 155, 260)
            }

            ctx.setFillStyle("black")
            ctx.setFontSize(16)
            ctx.fillText(that.data.title, 155, 287)

            var strlength = that.data.subContent.length
            var strCount = strlength / 21 + 1
            var pageHeight = 0
            for (var a = 0; a < strCount; a++) {
              var subStr = that.data.subContent.substring(21 * a, 21 * (a + 1))
              ctx.setFillStyle("rgb(175,175,175)")  // 文字颜色：黑色
              ctx.setFontSize(11)         // 文字字号：22px
              ctx.fillText(subStr, 155, 316 + a * 20)
              pageHeight = 316 + a * 20
            }

            if (that.data.campus == 0) {
              ctx.fillText("place：肇庆校区" + that.data.place, 155, pageHeight)
            } else {
              ctx.fillText("place：广州校区" + that.data.place, 155, pageHeight)
            }
            
            if (that.data.phone != null && that.data.phone != "null" && that.data.phone != ""){
              ctx.fillText("phone：" + that.data.phone, 155, pageHeight + 20)
              pageHeight=pageHeight+20
            }
            
            if (that.data.contactType == 0) {
              ctx.fillText("wechat：" + that.data.contactNum, 155, pageHeight + 20)
            } else {
              ctx.fillText("qq：" + that.data.contactNum, 155, pageHeight + 20)
            }

            ctx.drawImage(res2.path, 110, pageHeight + 30, 90, 90)
            ctx.setFillStyle("#2095F1")
            ctx.fillText("扫一扫  看详情  帮转发", 155, pageHeight + 140)

            ctx.setFillStyle("rgb(175,175,175)")
            ctx.fillText("广金寻物  帮您寻物", 155, pageHeight + 160)

            wx.getImageInfo({
              src: imgSrc[0],
              success:function(res3){
                console.log(res3)
                ctx.drawImage(res3.path,0,0,310,230)

                ctx.draw(true, function () {
                  console.log("开始画画")
                  setTimeout(function () {
                    wx.canvasToTempFilePath({
                      canvasId: "share",
                      success: function (res4) {
                        console.log(res4.tempFilePath)
                        wx.saveImageToPhotosAlbum({
                          filePath: res4.tempFilePath,
                          success: function () {
                            wx.hideLoading()
                            wx.showToast({
                              title: '保存成功',
                              icon: "success"
                            })
                            that.setData({
                              hidden: true
                            })
                            setTimeout(function () {
                              wx.hideToast()
                            }, 1500)
                          },
                          fail: function () {
                            wx.hideToast()
                            wx.showToast({
                              title: '保存失败',
                              icon: "none"
                            })
                            that.setData({
                              hidden: true
                            })
                            setTimeout(function () {
                              wx.hideToast()
                            }, 1000)
                          }
                        })
                      },
                      fail: function () {
                        wx.hideToast()
                        wx.showToast({
                          title: '保存失败',
                          icon: "none"
                        })
                        that.setData({
                          hidden: true
                        })
                        setTimeout(function () {
                          wx.hideToast()
                        }, 1000)
                      }
                    })
                  }, 200)
                })
              },
              fail:function(){
                wx.hideToast()
                wx.showToast({
                  title: '请检查网络',
                  icon: "none"
                })
                that.setData({
                  hidden: true
                })
                setTimeout(function () {
                  wx.hideToast()
                }, 1000)
              }
            })
          },
          fail: function () {
            wx.hideToast()
            wx.showToast({
              title: '请检查网络',
              icon: "none"
            })
            that.setData({
              hidden: true
            })
            setTimeout(function () {
              wx.hideToast()
            }, 1000)
          }
        })
      },
      fail: function () {
        wx.hideToast()
        wx.showToast({
          title: '请检查网络',
          icon: "none"
        })
        that.setData({
          hidden: true
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
      }
    })                
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
 
})
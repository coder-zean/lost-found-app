var app = getApp();
var util = require('../../utils/util.js');
var API = require('../../utils/api.js');
Page({

  data: {
    id: "",
    time: "",
    imgSrc: [],
    found: false,
    contact: "微信",
    hidden: true, //设置是否隐藏画板
    canvasPic: "",
    isCollect: false,
    nullString: "null",
    oString: "",
    show: true
  },

  onLoad: function (options) {
    var that = this
    /*
      获取缓存看用户是否第一次打开该页面，
      若是则显示分享提醒，若不是则关闭分享提醒
    */
    wx.getStorage({
      key: 'one',
      success(res) {
        that.setData({
          show: false
        })
      },
      fail(err) {
        wx.setStorageSync("one", 1)
      }
    })
    var scene = decodeURIComponent(options.scene)
    if (app.globalData.user == null) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
        duration: 1500
      })
    }

    if (scene != undefined && scene != null) {
      that.setData({
        id: scene
      })
      wx.showLoading({
        title: '加载中....',
      })
      util.request(API.LostModelUrl, {
        id: scene
      }).then(function (res) {
        var imgUrlList = []
        if (res.imgSrc1 != null) {
          imgUrlList.push(res.imgSrc1)
        }
        if (res.imgSrc2 != null) {
          imgUrlList.push(res.imgSrc2)
        }
        if (res.imgSrc3 != null) {
          imgUrlList.push(res.imgSrc3)
        }
        that.setData({
          imgSrc: imgUrlList,
          model: res,
          time: new Date(res.createTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(res.createTime).toTimeString().substr(0, 8)
        })
        wx.hideLoading()
      }).catch(function (err) {
        console.log(err)
        wx.hideLoading()
        util.showErrModal()
      })
      //如果已经登录，则查看该物品是否被收藏
      if (app.globalData.user != null) {
        console.log(app.globalData.user.userId)
        util.request(API.IsCollectUrl, {
          userId: app.globalData.user.userId,
          thingId: that.data.id,
        }).then(function (res) {
          that.setData({
            isCollect: res
          })
        }).catch(function (err) {
          util.showErrModal()
        })
      }
    }
  },
  //隐藏蒙版
  hideview: function () {
    this.setData({
      show: false
    })
  },
  //图片预览
  previewImg: function (e) {
    console.log(e)
    var urls = this.data.imgSrc
    var current = urls[e.currentTarget.dataset.index]
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls,
    })
  },
  //返回首页
  returnIndex: function () {
    wx.reLaunch({
      url: '../found/found'
    })
  },
  //以卡片的方式分享给微信联系人
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '广金寻物',
      desc: that.data.title,
      path: "/pages/more/more?id=" + that.data.id
    }
  },
  //收藏功能的实现
  collect: function () {
    var that = this;
    //判断是否登录，若无登录则提示先登录
    if (app.globalData.user == null) {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        duration: 1500
      })
    } else {
      wx.showLoading({
        title: '收藏中..',
      })
      util.request(API.CollectUrl, {
        userId: app.globalData.user.userId,
        thingId: that.data.id,
      }).then(function (res) {
        that.setData({
          isCollect: true
        })
        wx.hideLoading()
        wx.showToast({
          title: '收藏成功',
          duration: 1500
        })
      }).catch(function (err) {
        wx.hideLoading()
        util.showErrModal()
      })
    }
  },
  //以生成图片的方式分享给群或朋友圈
  sharePic: function () {
    wx.showLoading({
      title: '生成图片中...',
      mask: true
    })
    var that = this
    var imgSrc = that.data.imgSrc
    var ctx = wx.createCanvasContext('share')
    var path = ""
    var model = that.data.model
    that.setData({
      hidden: false
    })
    util.request(API.QRCordUrl, {
      scene: that.data.id
    }).then(function (res) {
      wx.getImageInfo({
        src: res,
        success: function (res2) {
          ctx.setFillStyle('white')
          ctx.fillRect(0, 0, 310, 570)
          ctx.setFillStyle("#2095F1")
          ctx.setFontSize(25)
          ctx.setTextAlign('center')
          if (model.thingType == 0) {
            ctx.fillText("寻 物 启 事", 155, 260)
          } else {
            ctx.fillText("失 物 招 领", 155, 260)
          }
          ctx.setFillStyle("black")
          ctx.setFontSize(16)
          ctx.fillText(model.title, 155, 287)
          var subString = model.content.substr(0, 49) + "..."
          var strlength = Math.max(subString.length, 52)
          var strCount = strlength / 21 + 1
          var pageHeight = 0
          for (var a = 0; a < strCount; a++) {
            var subStr = subString.substring(21 * a, 21 * (a + 1))
            ctx.setFillStyle("rgb(175,175,175)") // 文字颜色：黑色
            ctx.setFontSize(11) // 文字字号：22px
            ctx.fillText(subStr, 155, 316 + a * 20)
            pageHeight = 316 + a * 20
          }
          ctx.fillText("place：" + (model.campus == 0 ? "肇庆" : "广州") + "校区" + model.place, 155, pageHeight)
          if (model.phone != null && model.phone != "null" && model.phone != "") {
            ctx.fillText("phone：" + model.phone, 155, pageHeight + 20)
            pageHeight = pageHeight + 20
          }
          ctx.fillText((model.contactType == 0 ? "wechat：" : "qq：") + model.contactNum, 155, pageHeight + 20)

          ctx.drawImage(res2.path, 110, pageHeight + 30, 90, 90)
          ctx.setFillStyle("#2095F1")
          ctx.fillText("扫一扫  看详情  帮转发", 155, pageHeight + 140)

          ctx.setFillStyle("rgb(175,175,175)")
          ctx.fillText("广金寻物  帮您寻物", 155, pageHeight + 160)

          wx.getImageInfo({
            src: imgSrc.length == 0 ? "https://wubao-1256131373.cos.ap-guangzhou.myqcloud.com/xunwu/xunwu.png" : imgSrc[0],
            success: function (res3) {
              console.log(res3)
              ctx.drawImage(res3.path, 0, 0, 310, 230)
              ctx.draw(true, function () {
                setTimeout(function () {
                  wx.canvasToTempFilePath({
                    canvasId: "share",
                    success: function (res4) {
                      wx.saveImageToPhotosAlbum({
                        filePath: res4.tempFilePath,
                        success: function () {
                          wx.hideLoading()
                          wx.showToast({
                            title: '保存成功',
                            duration: 1500
                          })
                          that.setData({
                            hidden: true
                          })
                        }
                      })
                    },
                    fail: function () {
                      wx.hideLoading()
                      console.log("canvas生成图片失败")
                      util.showErrModal()
                      that.setData({
                        hidden: true
                      })
                    }
                  })
                }, 200)
              })
            },
            fail: function (err) {
              console.log(err)
              console.log("获取顶部图片详情失败")
              wx.hideLoading()
              util.showErrModal()
              that.setData({
                hidden: true
              })
            }
          })
        },
        fail: function (err) {
          console.log(err)
          console.log("获取小程序码图片详情失败")
          wx.hideLoading()
          util.showErrModal()
          that.setData({
            hidden: true
          })
        }
      })
    }).catch(function (err) {
      that.setData({
        hidden: true
      })
      wx.hideLoading()
      util.showErrModal()
    })
  },
})
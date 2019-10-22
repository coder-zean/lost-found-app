var app = getApp();
var util = require('../../utils/util.js');
Page({

  data: {
    id: "",
    title: "",
    content: "",
    time: "",
    isFound: 0,
    imgSrc: [],
    campus: "",
    thingType: "",
    contactType: 0,
    contactNum: "",
    phone: "",
    place: "",
    found: false,
    contact: "微信",
    hidden: true,     //设置是否隐藏画板
    canvasPic: "",
    isCollect: false,
    nullString: "null",
    oString: "",
    show: true
  },

  onLoad: function (options) {

    var scene = decodeURIComponent(options.scene)
    var that = this
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
      console.log(that.data.id)
      //请求获取相应id的物品详细信息
      wx.showLoading({
        title: '加载中....',
      })
      wx.request({
        url: 'https://www.wubaotop.cn/lostModel/getLostModel',
        data: {
          id: scene
        },
        success: function (res) {
          console.log(res)
          var imgUrlList = that.data.imgSrc
          if (res.data.code == 1) {
            that.setData({
              title: res.data.data.title,
              content: res.data.data.content,
              time: new Date(res.data.data.createTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(res.data.data.createTime).toTimeString().substr(0, 8),
              isFound: res.data.data.isFound,
              contactType: res.data.data.contactType,
              contactNum: res.data.data.contactNum,
              phone: res.data.data.phone,
              place: res.data.data.place,
              campus: res.data.data.campus,
              thingType: res.data.data.thingType
            })
            if (res.data.data.imgSrc1 != null) {
              imgUrlList.push(res.data.data.imgSrc1)
            }
            if (res.data.data.imgSrc2 != null) {
              imgUrlList.push(res.data.data.imgSrc2)
            }
            if (res.data.data.imgSrc3 != null) {
              imgUrlList.push(res.data.data.imgSrc3)
            }
            that.setData({
              imgSrc: imgUrlList
            })
            if (res.data.data.isFound == 1) {
              that.setData({
                found: true
              })
            }
            if (res.data.data.contactType == 1) {
              that.setData({
                contact: "QQ号"
              })
            }
            wx.hideLoading()
          } else {
            wx.hideLoading()
            wx.showModal({
              title: '加载失败',
              content: '服务器出现异常，请重试并向管理人员反馈，谢谢',
              showCancel: false
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
        }
      })
      //如果已经登录，则查看该物品是否被收藏
      if (app.globalData.user != null) {
        console.log(app.globalData.user.userId)
        wx.request({
          url: 'https://www.wubaotop.cn/lostAppUser/isCollect',
          data: {
            userId: app.globalData.user.userId,
            thingId: that.data.id,
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == 1) {
              that.setData({
                isCollect: res.data.data
              })
            } else {
              wx.showModal({
                title: '加载状态失败',
                content: '加载收藏状态失败，服务器出现异常，请重试并向管理人员反馈，谢谢',
                showCancel: false
              })
            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '加载失败',
        content: '请返回首页重试',
        showCancel: false,
        success: function () {
          wx.navigateBack()
        }
      })
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
      current: current,           // 当前显示图片的http链接
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
      wx.request({
        url: 'https://www.wubaotop.cn/lostAppUser/addCollection',
        data: {
          userId: app.globalData.user.userId,
          thingId: that.data.id,
        },
        success: function (res) {
          if (res.data.code == 1) {
            that.setData({
              isCollect: true
            })
            wx.showToast({
              title: '收藏成功',
              icon: "success",
              duration: 1500
            })
          } else {
            wx.showModal({
              title: '收藏失败',
              content: '服务器出现异常，请重试并向管理人员反馈，谢谢',
              showCancel: false
            })
          }
        },
        fail: function () {
          wx.showModal({
            title: '收藏失败',
            content: '网络异常，请检查网络并重试',
            showCancel: false
          })
        }
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
    that.setData({
      hidden: false
    })
    wx.request({
      url: 'https://www.wubaotop.cn/lostModel/qrCode',
      data: {
        scene: that.data.id
      },
      success: function (res) {
        console.log(res.data.data)
        if (res.data.code == 1) {
          wx.getImageInfo({
            src: res.data.data,
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
              var strlength = Math.max(that.data.content.length, 52)
              var strCount = strlength / 21 + 1
              var pageHeight = 0
              for (var a = 0; a < strCount; a++) {
                var subStr = that.data.content.substring(21 * a, 21 * (a + 1))
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
              if (that.data.phone != null && that.data.phone != "null" && that.data.phone != "") {
                ctx.fillText("phone：" + that.data.phone, 155, pageHeight + 20)
                pageHeight = pageHeight + 20
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
                src: imgSrc.length == 0 ? "https://wubao-1256131373.cos.ap-guangzhou.myqcloud.com/xunwu/xunwu.png" : imgSrc[0],
                success: function (res3) {
                  console.log(res3)
                  ctx.drawImage(res3.path, 0, 0, 310, 230)
                  ctx.draw(true, function () {
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
                                duration: 1500
                              })
                              that.setData({
                                hidden: true
                              })
                            },
                            fail: function () {
                              wx.hideLoading()
                              wx.showToast({
                                title: '保存失败',
                                icon: "none",
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
                          wx.showToast({
                            title: '保存失败',
                            icon: "none",
                            duration: 1500
                          })
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
                  wx.showToast({
                    title: '生成图片失败',
                    icon: "none",
                    duration: 1500
                  })
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
              wx.showToast({
                title: '请检查网络',
                icon: "none",
                duration: 1500
              })
              that.setData({
                hidden: true
              })
            }
          })
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '生成图片失败',
            content: '服务器出现异常，请重试并向管理人员反馈，谢谢',
            showCancel: false
          })
        }
      },
      fail: function () {
        console.log("生成小程序码请求失败")
        wx.hideLoading()
        wx.showModal({
          title: '生成图片失败',
          content: '网络出现异常，请检查网络并重试',
          showCancel: false
        })
        that.setData({
          hidden: true
        })
      }
    })
  },
})
var util = require('../../utils/util.js');
var app=getApp();

Page({
  data: {
    showTopTips: false,
    showTopMsg:"",      //错误信息
    avatarUrl: [],      //图片地址
    contentCount: 0,    //正文字数
    imgRealPath:[],     //存储图片地址

    radioItems: [
      { name: '寻物启事', value: '0', checked: true},
      { name: '失物招领', value: '1' }
    ],

    countryCodes: ["+86"],
    countryCodeIndex: 0,

    countries: ["肇庆校区", "广州校区"],
    countryIndex: 0,

    accounts: ["微信", "QQ号"],
    accountIndex: 0,

    title:"",
    place:"",
    content:"",
    phone:"",
    contactNum:"",
    weChat:"",
    qq:"",
    disabled:false    //设置按钮的禁用、启用

  },

  onLoad:function(){
    if (app.globalData.user == null) {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1500)
    }else{
      var that = this;
      wx.request({
        url: 'https://www.wubaotop.cn/lostAppUser/getUser',
        data: {
          userId: app.globalData.user.userId
        },
        success: function (res) {
          console.log(res.data.data)
          if(res.data.code==1){
            that.setData({
              weChat: res.data.data.weChat,
              qq: res.data.data.qq
            })
          }
          var weixin = that.data.weChat
          var tqq=that.data.qq
          if (weixin != null && weixin != "" &&  weixin !="null"){
            that.setData({
              contactNum:weixin
            })
            console.log("weixin")
            console.log(weixin)
          } else if (tqq != null &&  tqq != "" &&  tqq != "null"){
            that.setData({
              contactNum:tqq,
              accountIndex: 1
            })
            console.log("qq")
          }
        },
        fail: function () {
          wx.showToast({
            title: '获取信息失败',
            icon: "none"
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
      })
    }
  },

  //下拉刷新事件
  onPullDownRefresh: function () {
    this.onLoad()
  },
 
  //电话号码前缀
  bindCountryCodeChange: function (e) {
    console.log('电话号码前缀发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },

  //联系方式
  bindAccountChange: function (e) {
    console.log('联系方式发生选择改变，携带值为', e.detail.value);
    this.setData({
      accountIndex: e.detail.value
    })
  },

  //图片选择
  chooseImg:function(e){
    var that = this;
    wx.chooseImage({
      count: 3,
      success: function (res) {
        // 获取成功,将获取到的地址赋值给临时变量
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        that.setData({
          avatarUrl: tempFilePaths
        })
      },
      fail: function () {
        console.log('未选择图片');
      }
    })
  },

  //图片预览(单击图片出现大图预览)
  previewImage: function (e) {
    var current = this.data.avatarUrl[e.target.dataset.index];  //获取当前下标所指向的图片url
    wx.previewImage({
      current: current,           // 当前显示图片的http链接
      urls: this.data.avatarUrl   // 需要预览的图片http链接列表
    })
  },

  //计算详细描述字数
  handleContentInput(e) {
    var value = e.detail.cursor   //获得已输入字数
    this.setData({
      contentCount: value   //计算已输入的正文字数
    })
  },

  //多张图片上传,并在上传完图片之后，进行表单数据的提交
  uploadimg:function(data){
    var that = this;
    var i=data.i ? data.i : 0;                    //当前上传的哪张图片
    var success=data.success ? data.success : 0;  //上传成功的个数
    var fail=data.fail ? data.fail : 0;           //上传失败的个数
    console.log(data.path[0])
    wx.uploadFile({
      url:data.url,
      filePath: data.path[i],
      name: 'img',
      success: (res) => {
        var realData=JSON.parse(res.data)
        if (realData.code == 1) {
          that.data.imgRealPath.push(realData.data);
          success++;                    //图片上传成功，图片上传成功的变量+1
          }else{
            that.data.imgRealPath.push("null");
          }
        console.log(res)
        console.log(i);
        console.log(that.data.imgRealPath);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        that.data.imgRealPath.push("null");
        fail++;                         //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
        console.log(that.data.imgRealPath);
      },
      complete: () => {
        console.log(i);
        i++;                          //这个图片执行完上传后，开始上传下一张
        console.log(that.data.imgRealPath);
        //当图片传完时，停止调用，并开始上传普通表单数据
        if (i == data.path.length) {             
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          console.log(that.data.imgRealPath);
          if(fail==0){
            that.formRequest(data.formEvent)   
          }else{
            wx.showToast({
              title: '请重新选择图片',
              icon:"none"
            })
            that.setData({
              avatarUrl: [],
              imgRealPath: [],
              disabled: false
            })
            setTimeout(function(){
              wx.hideToast()
            },1500)
          }
        } else {//若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },

  //发送提交表单请求到服务器
  formRequest:function(e){
    var that=this
    var content = e.detail.value.content;
    var thingType=0
    var campus=0
    wx.showToast({
      title: '请选择校区',
      icon: "none",
      duration: 1000
    })
    wx.showActionSheet({
      itemList: ['肇庆校区', '广州校区'],
      success(res) {
        campus=res.tapIndex
        wx.showToast({
          title: '请选择类型',
          icon: "none",
          duration: 1000
        })
        wx.showActionSheet({
          itemList: ['寻物启事', '失物招领'],
          success(res1) {
            thingType=res1.tapIndex
            //将表单数据提交给服务器
            wx.request({
              url: 'https://www.wubaotop.cn/lostModel/add',
              data: {
                userId: app.globalData.user.userId,                          
                title: e.detail.value.title,                    //标题
                place: e.detail.value.place,                    //地点
                content: content,                               //内容
                phone: e.detail.value.phone,                    //手机号码
                contactType: e.detail.value.contactType,        //联系方式
                contactNum: e.detail.value.contactNum,          //联系号码
                thingType: thingType,            //物品丢失类型，招领还是寻物
                campus: campus,                  //掉落校区
                formId: e.detail.formId,         //上传formId
                imgSrc: that.data.imgRealPath    //物品图片链接
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
              },
              success: function (res) {
                console.log(res.data);
                if(res.data.code==1){
                  wx.hideLoading()
                  wx.showToast({
                    title: '上传成功',
                    icon: "success"
                  })
                  that.setData({
                    title: "",
                    place: "",
                    content: ""
                  })
                }else{
                  wx.hideLoading()
                  wx.showModal({
                    title: '上传失败',
                    content: '服务器出现异常，请重试并向管理人员反馈，谢谢',
                    showCancel:false
                  })
                }
              },
              fail: function () {
                wx.hideLoading()
                wx.showModal({
                  title: '上传失败',
                  content: '网络出现异常，请检查网络并重试',
                  showCancel:false
                })
              },
              complete: function () {
                that.setData({
                  avatarUrl: [],
                  imgRealPath: [],
                  disabled: false
                })
              }
            })
          },
          fail(res) {
            console.log(res.errMsg)
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })

  },


  //表单提交
  formSubmit:function(e){
    console.log(e)
    var that=this;
    if (app.globalData.user == null){
      that.setData({
        showTopTips: true,
        showTopMsg: "请先登录"
      })
      setTimeout(function () {
        that.setData({
          showTopTips: false
        })
      }, 2000)
    }
    else if (e.detail.value.title.length == 0 || e.detail.value.place.length == 0){
      that.setData({
        showTopTips:true,
        showTopMsg:"标题或地点不能为空"
      })
      setTimeout(function(){
        that.setData({
          showTopTips: false
        })
      },2000)
    }else if(e.detail.value.content.length==0){
      that.setData({
        showTopTips: true,
        showTopMsg: "详细描述不能为空"
      })
      setTimeout(function () {
        that.setData({
          showTopTips: false
        })
      }, 2000)
    } 
    else if (e.detail.value.phone.length!=0 && e.detail.value.phone.length !=11) {
      that.setData({
        showTopTips: true,
        showTopMsg: "请输入正确的手机号码"
      })
      setTimeout(function () {
        that.setData({
          showTopTips: false
        })
      }, 2000)
    } 
    else if (e.detail.value.contactNum.length==0) {
      that.setData({
        showTopTips: true,
        showTopMsg: "请输入微信号或qq号"
      })
      setTimeout(function () {
        that.setData({
          showTopTips: false
        })
      }, 2000)
    } else if (typeof (that.data.avatarUrl) == undefined || that.data.avatarUrl.length==0) {
      wx.showLoading({
        title: '正在上传...',
        mask: true
      })
      that.setData({
        disabled: true
      })
      that.formRequest(e)
    }else{
      wx.showLoading({
        title: '正在上传...',
        mask:true
      })
      that.setData({
        disabled:true
      })
      //上传图片并将表单数据提交
      that.uploadimg({
        url:"https://www.wubaotop.cn/lostModel/upload",
        path: that.data.avatarUrl,
        formEvent:e
      });   
    }
  }
});

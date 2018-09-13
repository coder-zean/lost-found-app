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
    wechat:"",
    qq:"",
    disabled:false    //设置按钮的禁用、启用

  },

  onLoad:function(){
    if (app.globalData.openid == null) {
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
        url: 'https://www.wubaotop.cn/personal/getUserMes',
        data: {
          userId: app.globalData.openid
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            wechat: res.data.wechat,
            qq: res.data.qq
          })
          var weixin = that.data.wechat
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

  
  //判断发布类型为寻物还是招领
  radioChange: function (e) {
    console.log('发帖类型radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
  },
 
  //电话号码前缀
  bindCountryCodeChange: function (e) {
    console.log('电话号码前缀发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },

  //校区选择
  bindCountryChange: function (e) {
    console.log('校区选择发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryIndex: e.detail.value
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
      // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时就不在是单个变量了,
      count: 3,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // 获取成功,将获取到的地址赋值给临时变量
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        that.setData({
          //将临时变量赋值给已经在data中定义好的变量
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
        if (res.statusCode == 200) {
          that.data.imgRealPath.push(res.data);
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
    //对内容进行切割
    var subContent = content.substring(0, 52) + "......";
    var openid = app.globalData.openid
    console.log(subContent);
    console.log(openid);
    //将表单数据提交给服务器
    wx.request({
      url: 'https://www.wubaotop.cn/upload/form',
      data: {
        userId: openid,                                 //用户的openid，也就是唯一标识
        title: e.detail.value.title,                    //标题
        place: e.detail.value.place,                    //地点
        content: content,                               //内容
        subContent: subContent,                         //内容切割，用于展示在首页
        time: util.formatTime(new Date()),              //时间
        phone: e.detail.value.phone,                    //手机号码
        contactType: e.detail.value.contactType,        //联系方式
        contactNum: e.detail.value.contactNum,          //联系号码
        thingType: e.detail.value.thingType,            //物品丢失类型，招领还是寻物
        campus: e.detail.value.campus,                  //掉落校区
        formId: e.detail.formId,                        //上传formId
        imgSrc: that.data.imgRealPath                     //物品图片链接
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '上传成功',
          icon: "success"
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        console.log(res.data);
        that.setData({
          title: "",
          place: "",
          content: ""
        })
      },
      fail: function () {
        console.log("上传失败")
        wx.showToast({
          title: '上传失败',
          icon: "none"
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
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


  //表单提交
  formSubmit:function(e){
    console.log(e)
    var that=this;
    if (app.globalData.openid == null){
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
        url:"https://www.wubaotop.cn/upload/image",
        path: that.data.avatarUrl,
        formEvent:e
      });   
    }
  }
});

// pages/updataPost/updataPost.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    showTopMsg: "",

    avatarUrl: [],      //图片地址
    contentCount: 0,    //正文字数
    imgRealPath: [],     //存储图片地址

    radioItems: [
      { name: '寻物启事', value: '0', checked: true },
      { name: '失物招领', value: '1' }
    ],

    countryCodes: ["+86"],
    countryCodeIndex: 0,

    countries: ["肇庆校区", "广州校区"],
    countryIndex: 0,

    accounts: ["微信号", "QQ号"],
    accountIndex: 0,

    id:"",
    title:"",
    place:"",
    content:"",
    phone:"",
    contactNum:"",
    changeImg:false   //记录是否改变了图片，若为true，则进行上传，若为false，则直接上传表单数据
    
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
  chooseImg: function (e) {
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
          avatarUrl: tempFilePaths,
          changeImg:true
        })
      },
      fail: function (res) {
        // fail
        console.log('选择失败');
        // console.log(!that.avatarUrl);
      },
      complete: function (res) {
        // complete
      }
    })
  },

  //图片预览(单击图片出现大图预览)
  previewImage: function (e) {
    var current = this.data.avatarUrl[e.target.dataset.index];  //获取当前下标所指向的图片url
    wx.previewImage({
      current: current,  // 当前显示图片的http链接
      urls: this.data.avatarUrl // 需要预览的图片http链接列表
    })
  },

  //计算详细描述字数
  handleContentInput(e) {
    var value = e.detail.cursor   //获得已输入字数
    this.setData({
      contentCount: value   //计算已输入的正文字数
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var item=JSON.parse(options.data)
    var imgUrlList = that.data.avatarUrl
    imgUrlList.push(item.imgSrc1)
    console.log(item)
    that.setData({
      id:item.id,
      title:item.title,
      place:item.place,
      content:item.content,
      phone:item.phone,
      contactNum:item.contactNum,
      countryIndex:item.campus,           //记录校区
      contentCount: item.content.length,  //设置正文数字
      accountIndex:item.contactType       //记录联系方式
    })
    if(item.imgSrc2!=null){
      imgUrlList.push(item.imgSrc2)
    }
    if (item.imgSrc3 != null) {
      imgUrlList.push(item.imgSrc3)
    }
    that.setData({
      avatarUrl:imgUrlList
    })
    console.log(imgUrlList)
    if(item.thingType==0){
      that.setData({
        radioItems: [
          { name: '寻物启事', value: '0', checked: true },
          { name: '失物招领', value: '1' }
        ]
      })
    }else{
      that.setData({
        radioItems: [
          { name: '寻物启事', value: '0' },
          { name: '失物招领', value: '1', checked: true }
        ]
      })
    }
  },

  //修改了触发了选择图片函数的时候才要调用
  //多张图片上传,并在上传完图片之后，进行表单数据的提交
  uploadimg: function (data) {
    var that = this;
    var i = data.i ? data.i : 0;//当前上传的哪张图片
    var success = data.success ? data.success : 0;//上传成功的个数
    var fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'img',
      success: (res) => {
        if (res.statusCode == 200) {
          that.data.imgRealPath.push(res.data);
          success++;        //图片上传成功，图片上传成功的变量+1
        } else {
          that.data.imgRealPath.push("null");
        }
        console.log(res)
        console.log(i);
        console.log(that.data.imgRealPath);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        that.data.imgRealPath.push("null");
        fail++;       //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
        console.log(that.data.imgRealPath);
      },
      complete: () => {
        console.log(i);
        i++;      //这个图片执行完上传后，开始上传下一张
        console.log(that.data.imgRealPath);
        if (i == data.path.length) {   //当图片传完时，停止调用，并开始上传普通表单数据          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          console.log(that.data.imgRealPath);

          //将表单数据提交给服务器
          that.updataRequest({
            formEvent:data.formEvent,
            imageList:that.data.imgRealPath
          })

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

  //发出更新帖子的请求
  updataRequest:function(data){
    var that=this
    var content = data.formEvent.detail.value.content;
    var subContent = content.substring(0, 52) + "......";
    wx.request({
      url: 'https://www.wubaotop.cn/personal/update',
      data: {
        id: that.data.id,
        title: data.formEvent.detail.value.title,      //标题
        place: data.formEvent.detail.value.place,      //地点
        content: content,  //内容
        subContent: subContent, //内容切割，用于展示在首页
        phone: data.formEvent.detail.value.phone,      //手机号码
        contactType: data.formEvent.detail.value.contactType,    //联系方式
        contactNum: data.formEvent.detail.value.contactNum,      //联系号码
        thingType: data.formEvent.detail.value.thingType,        //物品丢失类型，招领还是寻物
        campus: data.formEvent.detail.value.campus,              //掉落校区
        formId:data.formEvent.detail.formId,
        imgSrc: data.imageList               //物品图片链接
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
        //提交成功后，返回到我的帖子的页面
        wx.navigateBack({})
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
          imgRealPath: []
        })
      }
   })
 },     

  //表单提交
  formSubmit: function (e) {
    var that = this;
    console.log(e);
    if (e.detail.value.title.length == 0 || e.detail.value.place.length == 0) {
      that.setData({
        showTopTips: true,
        showTopMsg: "标题或地点不能为空"
      })
      setTimeout(function () {
        that.setData({
          showTopTips: false
        })
      }, 2000)
    } else if (e.detail.value.content.length == 0) {
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
    else if (e.detail.value.phone.length !=0&&e.detail.value.phone.length != 11) {
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
    else if (e.detail.value.contactNum.length == 0) {
      that.setData({
        showTopTips: true,
        showTopMsg: "请输入微信号或qq号"
      })
      setTimeout(function () {
        that.setData({
          showTopTips: false
        })
      }, 2000)
    } else if (typeof (that.data.avatarUrl) == undefined || that.data.avatarUrl.length == 0) {
      wx.showLoading({
        title: '正在上传...',
        mask: true
      })
      that.updataRequest({
        formEvent: e,
        imageList: that.data.avatarUrl
      })
    } else {
      wx.showLoading({
        title: '正在上传...',
        mask: true
      })
      that.updataRequest({
        formEvent: e,
        imageList: that.data.avatarUrl
      })
      //如果用户修改了图片，则先将图片上传，再提交数据
      if(that.data.changeImg){
        //上传图片并将表单数据提交
        that.uploadimg({
          url: "https://www.wubaotop.cn/upload/image",
          path: that.data.avatarUrl,
          formEvent: e
        });
      }else{//若无修改图片，则将原先的图片地址上传
        that.updataRequest({
          formEvent: e,
          imageList: that.data.avatarUrl
        })
      }
    }
  }


})
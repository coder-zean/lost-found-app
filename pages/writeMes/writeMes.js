// pages/writeMes/writeMes.js
var app=getApp()
Page({
  data: {
    showTopTips: false,
    showTopMes:"",

    countries: ["未选择","保险学院", "工商学院", "公共管理学院","法学院","会计学院","信用管理学院","财经与新媒体","国贸学院","金融与投资学院","外国语学院","互金与信息工程学院","数学与统计学院"],
    countryIndex: 0,
    
    username:"",
    studentNumber:"",
    phone:"",
    wechat:"",
    qq:"",
    grade:"",
    studentClass:"",
    nullString:"null"
  },

  //
  onLoad: function (options){
    console.log(options)
    this.setData({
      username: options.username,
      studentNumber: options.studentNumber,
      phone: options.phone,
      wechat: options.wechat,
      qq: options.qq,      
      grade:options.grade,
      studentClass: options.studentClass
    })
    if(options.college=="null"||options.college==""){
      this.setData({
        countryIndex:0
      })
    }else if(options.college=="保险学院"){
      this.setData({
        countryIndex:1
      })
    } else if (options.college == "工商学院") {
      this.setData({
        countryIndex: 2
      })
    } else if (options.college == "公共管理学院") {
      this.setData({
        countryIndex: 3
      })
    } else if (options.college == "法学院") {
      this.setData({
        countryIndex: 4
      })
    } else if (options.college == "会计学院") {
      this.setData({
        countryIndex: 5
      })
    } else if (options.college == "信用管理学院") {
      this.setData({
        countryIndex: 6
      })
    } else if (options.college == "财经与新媒体") {
      this.setData({
        countryIndex: 7
      })
    } else if (options.college == "国贸学院") {
      this.setData({
        countryIndex: 8
      })
    } else if (options.college == "金融与投资学院") {
      this.setData({
        countryIndex: 9
      })
    } else if (options.college == "外国语学院") {
      this.setData({
        countryIndex: 10
      })
    } else if (options.college == "互金与信息工程学院") {
      this.setData({
        countryIndex: 11
      })
    }else{
      this.setData({
        countryIndex: 12
      })
    } 
    console.log(this.data.countryIndex)
  },


  //用户修改学院信息时的函数
  bindCountryChange: function (e) {
    console.log('2picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryIndex: e.detail.value
    })
  },
 
  formSubmit:function(e){
    var that=this
    var college=that.data.countries
    console.log(e)
    if (that.data.countryIndex==0){
      college[0]=null
    }
    console.log(college[0])
    console.log(college[that.data.countryIndex])
    if (e.detail.value.phone != "" && e.detail.value.phone.length!=11){
      that.setData({
        showTopTips:true,
        showTopMes:"请输入正确格式的手机号码"
      })
      setTimeout(function(){
        that.setData({
          showTopTips:false
        })
      },2300)
    }else{
      var index = that.data.countryIndex
      console.log(college[index])
      wx.request({
        url: 'https://www.wubaotop.cn/personal/updateUser',
        data:{
          userId: app.globalData.openid,
          username:e.detail.value.username,
          studentNumber: e.detail.value.studentNumber,
          phone: e.detail.value.phone,
          wechat: e.detail.value.wechat,
          qq: e.detail.value.qq,
          grade: e.detail.value.grade,
          studentClass: e.detail.value.studentClass,
          college: college[index]
        },
        success:function(){
          wx.navigateBack({
          })
        },
        fail:function(){
          wx.showToast({
            title: '修改失败',
            icon:"none"
          })
          setTimeout(function(){
            wx.hideToast()
          },2000)
        }
      })
    }
  },


});
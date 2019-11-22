var app=getApp()
var util = require('../../utils/util.js');
var API = require('../../utils/api.js');
Page({
  data: {
    showTopTips: false,
    showTopMes:"",

    countries: ["未选择","保险学院", "工商学院", "公共管理学院","法学院","会计学院","信用管理学院","财经与新媒体","经济与国际贸易学院","金融与投资学院","外国语学院","互金与信息工程学院","数学与统计学院"],
    countryIndex: 0,
    
    username:"",
    studentNumber:"",
    phone:"",
    weChat:"",
    qq:"",
    grade:"",
    studentClass:"",
    nullString:"null"
  },

  onLoad: function (options){
    console.log(options)
    this.setData({
      username: options.username,
      studentNumber: options.studentNumber,
      phone: options.phone,
      weChat: options.weChat,
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
    } else if (options.college == "经济与国际贸易学院") {
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
  },
  //用户修改学院信息时的函数
  bindCountryChange: function (e) {
    this.setData({
      countryIndex: e.detail.value
    })
  },
  //更新信息提交
  formSubmit:function(e){
    var that=this
    var college=that.data.countries
    if (that.data.countryIndex==0){
      college[0]=null
    }
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
      wx.showLoading({
        title: '上传中...',
      })
      util.request(API.UpdateUserMsgUrl, {
        userId: app.globalData.user.userId,
        username: e.detail.value.username,
        studentNumber: e.detail.value.studentNumber,
        phone: e.detail.value.phone,
        weChat: e.detail.value.weChat,
        qq: e.detail.value.qq,
        grade: e.detail.value.grade,
        studentClass: e.detail.value.studentClass,
        college: college[index]
      }).then(function(res){
        wx.hideLoading()
        wx.showToast({
          title: '更新成功',
          duration: 1500
        })
        wx.navigateBack()
      }).catch(function(err){
        wx.hideLoading()
        util.showErrModal()
      })
    }
  },


});
// 1 导入js文件
var WxSearch = require('../../components/wxSearchView/wxSearchView.js');

Page({
  data: {
    scope:[["肇庆","广州"],["寻物启示","失物招领"]],
    objectScope:[
      [
        {
          id:0,
          name:"肇庆"
        },
        {
          id:1,
          name:"广州"
        }
      ],
      [
        {
          id:0,
          name:"寻物启示"
        },
        {
          id:1,
          name:"失物招领"
        }
      ]
    ],
    scopeIndex:[0,0]
  },
  //picker变换函数
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      scopeIndex: e.detail.value
    })
    console.log(this.data.scopeIndex)
  },

  onLoad: function () {

    // 2 搜索栏初始化
    var that = this;
    WxSearch.init(
      that,  // 本页面一个引用
      ['钥匙', '校园卡', "水杯", "证件", '书本', '手表'], // 热点搜索推荐，[]表示不使用
      [],// 搜索匹配，[]表示不使用
      that.mySearchFunction, // 提供一个搜索回调函数
      that.myGobackFunction //提供一个返回回调函数
    );

  },

  // 3 转发函数，固定部分，直接拷贝即可
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 4 搜索回调函数  
  mySearchFunction: function (value) {
    var index=this.data.scopeIndex
    var campus = index[0]
    console.log(campus)
    var thingType = index[1]
    //跳转至搜索结果页面
    wx.navigateTo({
      url: '../searchResult/searchResult?campus='+campus+"&thingType="+thingType+"&value="+value,
    })
  },

  // 5 返回回调函数
  myGobackFunction: function () {
    // 返回
    wx.reLaunch({
      url: "../found/found",
      fail:function(){
        console.log("跳转失败")
      }
    })
  }

})
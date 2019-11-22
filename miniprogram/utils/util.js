const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') 
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET", header= {
  'Content-Type': 'application/json',
}) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header,
      success:res=>{
        console.log(res);
        if (res.data.code == 1) {
          resolve(res.data.data);
        } else {
          reject(res.data.msg);
        }
      },
      fail: err=>{
        reject(err)
        console.log("failed")
      }
    })
  });
}

/**
 * 请求异常时提示用户操作
 */
function showErrModal(){
  wx.showModal({
    title: '加载失败',
    content: '服务器出现异常，请重试并向管理人员反馈，谢谢',
    showCancel: false
  })
}

module.exports = {
  formatTime: formatTime,
  request: request,
  showErrModal: showErrModal
}

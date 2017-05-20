//app.js

console.log(wx);

App({
  onLaunch: function (params) {
    //调用API从本地缓存中获取数据
    console.log(params.path);    
    console.log(params.query);
    console.log(params.scene);
    console.log(params.shareTicket);
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorageSync('scene', params.scene)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })



    }
  },
  globalData:{
    userInfo:null,
    windowWidth: null,
    windowHeight: null
  }
})







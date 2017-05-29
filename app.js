//app.js
const Event = require('./utils/event.js').Event;

// LeanCloud 应用的 ID 和 Key

App({
    event: new Event(),
    onLaunch: function(params) {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        wx.setStorageSync('logs', logs)
        wx.setStorageSync('scene', params.scene);
        console.log(this.event._cbs);
    },
    getUserInfo: function(cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function() {
                    wx.getUserInfo({
                        success: function(res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    globalData: {
        userInfo: null,
        windowWidth: null,
        windowHeight: null,
        imagesArray: null ,
        imgCurrentIndex: 0,
        word: null
        // indexTitle: null,
    }
})
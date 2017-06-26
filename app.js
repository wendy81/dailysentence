//app.js
const config = require('./config.js');
const host = config.host;
App({
    onLaunch: function(e) {
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.windowHeight = res.windowHeight;
                this.globalData.windowWidth = res.windowWidth;
                var system = res.system;
                var isAndroid = system.indexOf("Android");
                var isIos = system.indexOf("iOS");
                if (isAndroid === 0) {
                    this.globalData.system = 'Android'
                }
                if (isIos === 0) {
                    this.globalData.system = 'iOS'
                }
            }
        })
    },
    globalData: {
        windowHeight: null,
        windowWidth: null
    }
})
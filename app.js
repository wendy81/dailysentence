//app.js
const Event = require('./utils/event.js').Event;

// LeanCloud 应用的 ID 和 Key

function getInitData(that) {
    wx.request({
        url: 'http://127.0.0.1:8080/getInitData',
        // url: 'https://learnabc.cloudno.de/getInitData',
        method: 'GET',
        header: {
            'content-type': 'applicatin/json'
        },
        success: (res) => {
            that.globalData.total = res.data.total;
            that.globalData.showNumber = res.data.showNumber;
            that.globalData.requestServer = true;
            wx.reLaunch({
                url: '/pages/index/index'
            })
        },
        fail: (e) => {
            console.log(e)
        }
    })
}

App({
    event: new Event(),
    onLoad: function(e) {
    },
    onLaunch: function(params) {
        // --------- 发送凭证 ------------------
        wx.login({
            success: function(res) {
                var code = res.code;
                var myDate = new Date()
                if (code) {
                    console.log('获取用户登录凭证：' + code);
                    // --------- 发送凭证 ------------------
                    // wx.request({
                    //         url: 'https://nsquare.cn/wxlogin',
                    //         // url: 'http://learnabc.cloudno.de/wxlogin',
                    //         // url: 'http://abcsev.nsquare.cn/wxlogin',
                    //         data: {
                    //             code: code,
                    //             logintime: myDate
                    //         },
                    //         method: 'POST',
                    //         header: {
                    //             'content-type': 'application/json'
                    //         },
                    //         success: function(res) {
                    //             console.log(res)
                    //             let session_id = res.data;
                    //             wx.setStorageSync('session_database_id', session_id);
                    //         }
                    //     })
                    // ------------------------------------
                } else {
                    console.log('获取用户登录态失败：' + res.errMsg);
                }
            }
        });
        //调用API从本地缓存中获取数据
        // var logs = wx.getStorageSync('logs') || []
        // wx.setStorageSync('logs', logs)
        // wx.setStorageSync('scene', params.scene);
        // console.log(this.event._cbs);
    },
    onShow: function(e) {
        wx.getNetworkType({
            success: (resGetNetType) => {
                // 返回网络类型, 有效值：
                // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
                var networkType = resGetNetType.networkType
                if (networkType !== 'wifi') {
                    console.log('9999')
                    wx.showModal({
                        title: 'Warning',
                        content: 'Not WIFI,Continue?',
                        cancelText: 'No',
                        confirmText: 'Yes',
                        success: (res) => {
                            if (res.confirm) {
                                /*
                                 * 定义变量requestServer  重加载  去服务器取数据
                                 */
                                let that = this;
                                getInitData(that);
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        },
                        fail: function(e) {
                            console.log(e.errMsg)
                        }
                    })
                } else {
                    let that = this;
                    /*
                     * 定义变量requestServer  重加载  去服务器取数据
                     */
                    getInitData(that)
                }
            },
            fail: function(e) {
                console.log(e.errMsg)
            }
        })
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
        requestServer: false,
        total: '',
        showNumber: '',
        winHeight: '',
        currentWord: ''
    }
})
//personal.js
//获取应用实例
var app = getApp();
Page({
    data: {
        session_id_isvalid: false
    },
    onLoad: function(e) {
        let session_database_id = wx.getStorageSync('session_database_id')
        wx.request({
            url: 'http://127.0.0.1:8080/sessionIdIsValid',
            // url: 'http://learnabc.cloudno.de/sessionIdIsValid',
            // url: 'http://abcsev.nsquare.cn/sessionIdIsValid',
            data: {
                session_database_id: session_database_id
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                console.log(res);
                let session_id_isvalid = res.data.session_id_isvalid;
                if (session_id_isvalid && session_database_id === res.data.session_database_id) {
                    this.setData({
                        session_id_isvalid: session_id_isvalid
                    })
                }
            }
        })
    },
    switchTab: function(e) {
        // wx.switchTab({
        //         url: '/pages/addimgs/addimgs',
        //         success: function(res) {
        //             console.log(app);
        //         }
        //     })
        wx.redirectTo({
            url: '/pages/addimgs/addimgs'
        })
    }
})
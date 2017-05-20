function getData() {
    // wx.request({
    //     url: 'https://www.abc.com/pages/data/data.json', //仅为示例，并非真实的接口地址
    //     success: function(res) {
    //         console.log(res.data)
    //     },
    //     fail: function(error) {
    //     	console.log(error)
    //     }
    // })
    wx.request({
        url: 'https://raw.githubusercontent.com/jiangzy27/how_to_react/master/score.json',
        header: {
            "Content-Type": "application/json"
        },
        data: {},
        success: function(res) {
            that.setData({
                removeData: res.data.data
            });
        },
    })
}

exports.getData = getData;
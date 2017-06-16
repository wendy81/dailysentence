var topEvent = {
    homeEvent: function(e) {
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
    searchEvent: function(e) {
        wx.reLaunch({
            url: '/pages/query/query?winHeight=' + this.data.winHeight
        })
    }
}

module.exports.topEvent = topEvent;
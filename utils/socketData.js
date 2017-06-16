function socketData(params) {
    /*
     * wx.connectSocket 通过websocket接口从服务器取回数据
     */
    // wx.connectSocket({
    //         url: 'ws://www.abc.com:8001',
    //         header: {
    //             'content-type': 'application/json'
    //         },
    //         method: "GET"
    //     })
    //     //连接成功
    // wx.onSocketOpen(function() {
    //     wx.sendSocketMessage({
    //         data: 'connect successfully!',
    //     })
    // })
    // wx.onSocketError(function(res) {
    //     console.log('WebSocket连接打开失败，请检查！')
    // })
    // wx.onSocketMessage((res) => {
    //     let data = JSON.parse(res.data);
    //     // app.globalData.imagesArray = data;
    //     params.setData({
    //         images: data
    //     })
    //     console.log(data);
    //     // let images = this.data.images;
    //     // images.map((v, i) => {
    //     //     if( this.data.imgCurrentIndex ===i ) {
    //     //         getWordInfo.getWordInfo(this, v.key);
    //     //     }
    //     // })
    // })

    /*
     * wx.request 通过requeset直接从网络地址获取数据
     */

    let currentData = Date.now();
    wx.request({
        url: 'http://abc.nsquare.cn/imagesJson?' + currentData,
        success: res => {
            console.log(res.data);
            let data = res.data;
            params.setData({
                images: data
            })            
        },
        fail: e => {
            console.error(e.errMsg);
        }
    });
}

exports.socketData = socketData;
function getData(params) {
    wx.request({
        url: 'https://raw.githubusercontent.com/wendy81/Learn-English-By-Picture/master/pages/data/data.json',
        success: res => {
            try {
                wx.setStorageSync('imagesUrl', res.data)
            } catch (e) {
                console.error(e);
            }

            try {
                var value = wx.getStorageSync('imagesUrl');
                if (value !== []) {
                    params.setData({
                        images: value
                    });
                }
            } catch (e) {
                console.error(e);
            }
        },
        fail: e => {
        	console.error(e.errMsg);
        }
    });
}

exports.getData = getData;
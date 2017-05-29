//index.js
//获取应用实例
var app = getApp();

Page({
    data: {
        imageInfo: null,
        imageURL: null,
    },
    onLoad: function(e) {

    },
    formSubmit: function(e) {
        let value = e.detail.value;
        wx.request({
            url: 'https://www.abc.com/upload',
            method: 'POST',
            data: {
                key: e.detail.value.word
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                let data = res.data;
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: (res) => {
                wx.showToast({
                    title: '失败',
                    icon: 'fail',
                    duration: 2000
                })
            }
        })
    },
    getImagesInfo: function() {
        this.setData({
            imageInfo: e.detail.value
        })
    },
    formReset: function(e) {

    },
    chooseImg: function(e) {
        /*
         * @Function wx.chooseImage 从本地相册选择图片或使用相机拍照
         */
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                this.setData({
                    imageUrl: tempFilePaths
                });
                /*
                 * @Function wx.getSystemInfo 得到系统信息
                 * @params windowWidth可使用窗口宽度  windowHeight可使用窗口高度
                 */
                wx.getSystemInfo({
                    success: (resSystem) => {
                        // 窗口的宽高
                        var windowWidth = resSystem.windowWidth;
                        var windowHeight = resSystem.windowHeight;
                        /*
                         * @Function wx.getImageInfo 获取图片信息
                         * @String src图片路径
                         */
                        wx.getImageInfo({
                            src: res.tempFilePaths[0],
                            success: (res) => {
                                this.setData({
                                    imageWidth: (windowWidth - 200),
                                    imageheight: (windowWidth - 200)
                                })
                            }
                        });
                    }
                });
            }
        })
    }

})
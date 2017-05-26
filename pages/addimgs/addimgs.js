//index.js
//获取应用实例
var app = getApp();

Page({
    data: {
        imageInfo: null,
        imageUrl: null,
    },
    onLoad: function(e) {
        wx.request({
            url: 'https://www.abc.com/token',
            method: 'GET',
            success: (res) => {
                let  data = res.data;
                this.token = data; //默认返回一个token，赋值给已经有的token属性。这里只是示例，具体根据需求可自行设定。
                try {
                    wx.setStorageSync('token', this.token)
                } catch (e) {}
            },
            fail: (res) => {
                console.log(res)
            }
        })
    },
    formSubmit: function(e) {
        //建立连接
        wx.connectSocket({
                url: "ws://www.abc.com:8001",
            })
            //连接成功
        wx.onSocketOpen(function() {
            console.log(e.detail.value);
            var value = JSON.stringify(e.detail.value);
            wx.sendSocketMessage({
                data: value
            })
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

                wx.uploadFile({
                    url: 'https://www.abc.com/upload?=' + wx.getStorageSync('token'), //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    // formData: {
                    //     'token': wx.getStorageSync('token')
                    // },
                    header: {
                        "Content-Type": "multipart/form-data"
                    },
                    success: function(resUpload) {
                        console.log(resUpload.data);
                        var data = resUpload.data
                        res.data=JSON.parse(resUpload.data); 
                            //do something
                    },
                    complete: function(resUpload) {
                        console.log(resUpload);
                    }
                })

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
                                    imageWidth: (windowWidth - 30),
                                    imageheight: (windowWidth - 30)
                                })
                            }
                        });
                    }
                });

            }

        })
    }

// {"access_token":"d8OiJHfGgRtijsPIC9H1jZS3-cFC_hj7CpRENJXdVGXH7_76aQm5bfnoV8VU4OAVe9a_vVuE5cR8uoFuiw6GY7wD-Gtfx8pehZx3vGhGJC5-TNXTAJzsdu39Yqw0i34VJNEgAHAQUL","expires_in":7200}  

})
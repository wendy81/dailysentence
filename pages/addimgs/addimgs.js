//index.js
//获取应用实例
var app = getApp();
var getWordInfo = require('../..//utils/word.js');

// function encodeImageFileAsURL(element) {
//     var file = element.files[0];
//     var reader = new FileReader();
//     reader.onloadend = function() {
//         console.log('RESULT', reader.result)
//     }
//     reader.readAsDataURL(file);
// }

Page({
    data: {
        imageInfo: null,
        imageURL: null,
        word: null
    },
    onLoad: function(e) {

    },
    formSubmit: function(e) {
        /*
         * @Function getWordInfo  提交form,并后台写数据
         */
        getWordInfo.getWordInfo(this, e.detail.value.word, e.detail.value.url);
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
                console.log(res)
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


                wx.request({
                    url: 'http://127.0.0.1:8080/upload',
                    method: 'POST',
                    /*
                     * JSON.stringify(wordObj)
                     */
                    data: {
                        // key: currentTargetWord,
                        // translator: JSON.stringify(wordObj),
                        imagesData: tempFilePaths[0]
                    },
                    header: {
                        'content-type': 'multipart/form-data'
                            // 'content-type': 'application/json'
                    },
                    success: (res) => {
                        console.log(res)
                        let data = res.data;
                        wx.showToast({
                            title: '成功',
                            icon: 'success',
                            duration: 2000
                        })
                    },
                    fail: (res) => {
                        console.log(res)
                        wx.showToast({
                            title: '失败',
                            icon: 'fail',
                            duration: 2000
                        })
                    }
                })



            }
        })
    },
    backEvent: function(e) {
        wx.navigateBack({
            delta: 2
        })
    }

})
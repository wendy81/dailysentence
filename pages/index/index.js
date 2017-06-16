//index.js
//获取应用实例
const imagesWh = require('../../utils/imagesWh.js');
const topEvent = require('../../utils/top.js');
const app = getApp();

function getRequest(dataValue, that) {
    wx.request({
        // url: 'https://learnabc.cloudno.de/show',
        url: 'http://127.0.0.1:8080/show',
        method: 'POST',
        header: {
            'content-type': 'application/json'
        },
        data: {
            'reqNum': dataValue
        },
        success: (requestres) => {
            let dataVal = requestres.data;
            /*
             * 如果为[],则强制重新加载,出现[],还不清楚？？？
             */
            if (dataVal.length === 0) {
                wx.reLaunch({
                    url: '/pages/index/index'
                })
            } else if (dataVal[0]._id) {
                wx.hideNavigationBarLoading()
                let imgCurrentIndex = that.data.imgCurrentIndex;
                that.setData({
                    images: dataVal,
                    currentAudio: dataVal[imgCurrentIndex].translator.AmEmp3
                })
            } else {
                wx.showNavigationBarLoading()
            }
        },
        fail: (e) => {
            console.log(e.errMsg)
        }
    })
}
Page({
    data: {
        images: null,
        loadedImages: [],
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        imageWidth: null,
        imageheight: null,
        winHeight: null,
        imgCurrentIndex: 0,
        currentAudio: null,
        allAudioId: [],
        audioBtnClass: 'fa-play-circle',
        audioBtnEvent: 'startPlay',
        topTemplate: {
            topHomeActive: 'top-active',
            homeEvent: ''
        }
    },
    onShareAppMessage: function(res) {
        console.log(res)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '自定义转发标题',
            path: '/page/user?id=123',
            success: function(res) {
                console.log('success')
            },
            fail: function(res) {
                console.log('fail')
            }
        }
    },
    onShow: function(e) {
        if (app.globalData.requestServer) {
            let appCurrentWord = app.globalData.currentWord;
            if (appCurrentWord[0]) {
                this.setData({
                        images: appCurrentWord,
                        currentAudio: appCurrentWord[0].translator.AmEmp3
                    })
                    /*
                     * 从搜索显示过后,再把app变量currentWord还原
                     */
                app.globalData.currentWord = '';
            } else {
                // --------- 取得数据 ------------------
                wx.getStorage({
                        key: 'reqNum',
                        success: (res) => {
                            console.log(res.data)
                            let total = app.globalData.total;
                            let showNumber = app.globalData.showNumber;
                            let dataValue = res.data;
                            let that = this;
                            let reqNumMax = Math.ceil(total / showNumber);
                            if (dataValue < reqNumMax) {
                                dataValue++
                            } else {
                                dataValue = 1;
                            }
                            getRequest(dataValue, that);
                            wx.setStorage({
                                key: "reqNum",
                                data: dataValue,
                                success: (setRes) => {
                                    console.log(setRes)
                                }
                            })
                        },
                        fail: (e) => {
                            let dataValue = 1;
                            let that = this;
                            getRequest(dataValue, that);
                            wx.setStorage({
                                key: "reqNum",
                                data: 1,
                                success: function(setRes) {
                                    console.log(setRes)
                                }
                            })
                        }
                    })
                    // --------- 取得数据 ------------------
            }
        }
        this.setData({
            topTemplate: {
                topHomeActive: 'top-active',
                homeEvent: this.homeEvent
            }
        })
    },
    onReady: function(e) {
        /*
         * @Function loadCurrenAmes加载当前的e.detail.current的音频文件
         */
        this.audioCtx = wx.createAudioContext('myAudio');
    },
    imagebindload: function(e) {
        /*
         * 获得数据中第一个图片的宽,高  赋值给 {imageWidth: ,imageheight}
         */
        let imagesData = this.data.images;
        let imagesZero = (this.data.images)[0];
        if (imagesZero) {
            this.setData(imagesWh.imagesWh(e));
        }
    },
    imageError: function(e) {
        console.log(e.detail);
    },
    swiperChange: function(e) {

        /*
         * 切换swiper之后 硬性规定audioPlay为false,即不播放
         * @Function loadCurrenAmes加载当前的e.detail.current的音频文件
         */
        let data = this.data.images;
        this.setData({
            audioBtnClass: 'fa-play-circle',
            audioBtnEvent: 'startPlay',
            currentAudio: data[e.detail.current].translator.AmEmp3
        });
        this.audioCtx.pause();
    },
    startPlay: function(e) {
        this.audioCtx.play();
        this.setData({
            audioBtnClass: 'fa-pause-circle',
            audioBtnEvent: 'stopPlay'
        })
    },
    stopPlay: function(e) {
        this.audioCtx.pause()
        this.setData({
            audioBtnClass: 'fa-play-circle',
            audioBtnEvent: 'startPlay'
        })
    },
    audioEndEvent: function(e) {
        this.setData({
            audioBtnClass: 'fa-play-circle',
            audioBtnEvent: 'startPlay'
        })
    },
    homeEvent: topEvent.topEvent.homeEvent,
    searchEvent: topEvent.topEvent.searchEvent,
    detailsEvent: function(e) {
        let currentImgId = e.target.id;
        let images = this.data.images;
        images.map((v, i) => {
            if (v._id === currentImgId) {
                const translator = [];
                translator.push(v.translator);
                app.globalData.currentWordTrans = translator[0];
                wx.navigateTo({
                    url: '/pages/detail/detail?word=' + v.key
                })
            }
        })
    }
})
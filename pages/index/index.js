//index.js
//获取应用实例
var imagesWh = require('../..//utils/imagesWh.js');
var getWordInfo = require('../..//utils/word.js');
var getData = require('../..//utils/getData.js');
var app = getApp();

Page({
    data: {
        title: null,
        images: null,
        word: null,
        indicatorDots: false,
        autoplay: false,
        audioPlay: false,
        interval: 5000,
        duration: 1000,
        imageWidth: null,
        imageheight: null,
        imgCurrentIndex: app.globalData.imgCurrentIndex
    },
    onUnload: function() {},
    onLaunch: function() {
        wx.login({
            success: function(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxb027102652cf89b8&secret=e17f5419ac7b9cbf41bc977917c027aa&js_code=JSCODE&grant_type=authorization_code',
                        data: {
                            code: res.code
                        }
                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    },
    onLoad: function(e) {
        wx.connectSocket({
            url: 'ws://www.abc.com:8001',
            header: {
                'content-type': 'application/json'
            },
            method: "GET"
        })

        //连接成功
        wx.onSocketOpen(function() {
            wx.sendSocketMessage({
                data: 'connect successfully!',
            })
        })

        wx.onSocketError(function(res) {
            console.log('WebSocket连接打开失败，请检查！')
        })

        wx.onSocketMessage((res) => {
                let data = JSON.parse(res.data);
                app.globalData.imagesArray = data;
                this.setData({
                    images: data
                })
                let images = this.data.images;
                images.map((v, i) => {
                    if( this.data.imgCurrentIndex ===i ) {
                        getWordInfo.getWordInfo(this, v.key, app.globalData.imagesArray);
                    }
                })
            })
        /*
         * 初始化 单词数据  默认为this.data.currentWord ＝ 'ally'
         *  手机浏览  现在websocket没有配置 手机端不能访问
         */

        // wx.request({
        //     url: 'https://www.abc.com/imagesArry', //仅为示例，并非真实的接口地址
        //     method: 'GET',
        //     header: {
        //         'content-type': 'application/json'
        //     },
        //     success: (res) => {
        //         console.log(res)
        //         // let data = JSON.parse(res.data);
        //         // this.setData({
        //         //     images: data,
        //         //     currentWord: data[0].key
        //         // })
        //         // getWordInfo.getWordInfo(this, this.data.currentWord);

        //     }
        // })

    },
    onShow: function(e) {
        this.setData({
            imgCurrentIndex: app.globalData.imgCurrentIndex
        })
    },
    recordEvent: function(e) {
        wx.startRecord({
            success: function(res) {
                var tempFilePath = res.tempFilePath;
                wx.playVoice({
                    filePath: tempFilePath,
                    complete: function() {

                    }
                })
            },
            fail: function(res) {
                //录音失败
            }
        })
        setTimeout(function() {
            //结束录音  
            wx.stopRecord()
        }, 10000)
    },
    imagebindload: function(e) {
        this.setData(imagesWh.imagesWh(e));
    },
    imageError: function(e) {
        console.log(e.detail);
    },
    swiperChange: function(e) {
        var imagesData = this.data.images;
        /*
         * 切换swiper之后 硬性规定audioPlay为false,即不播放
         */
        this.setData({
            audioPlay: false
        });
        imagesData.map((v, i) => {
            /*
             * 当前current(表示swiper当前下标)变化时,会触发bindChange函数
             * e.detail.current 表示当前下标值,当前是第几张图,显示对应的单词信息
             */
            if (i === e.detail.current) {
                getWordInfo.getWordInfo(this, v.key, app.globalData.imagesArray);
            }
        })
    },
    /*
     * 操作音频效果
     */
    onReady: function(e) {
        // 使用 wx.createAudioContext 获取 audio 上下文 context
        this.audioCtx = wx.createAudioContext('myAudio');
    },
    /*
     * 点击play和pause切换
     */
    audioPlayorPause: function(e) {
        if (!this.data.audioPlay) {
            this.audioCtx.play();
        } else {
            this.audioCtx.pause();
        }
        this.setData({
            audioPlay: !this.data.audioPlay
        });
    }
})
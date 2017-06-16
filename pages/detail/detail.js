//query.js
//查询数据信息
var app = getApp();
var socketData = require('../..//utils/socketData.js');

Page({
    data: {
        currentWord: null,
        translator: null,
        indicatorDots: false,
        autoplay: false,
        audioPlay: false,
        interval: 5000,
        duration: 1000,
        currentAudio: null,
        imgCurrentIndex: 0,
        swiperTotal: null,
        audioBtnClass: 'fa-play-circle',
        audioBtnEvent: 'startPlay',
        swiperHeight: null,
        windowWidth: null,
        nextBtnDisabled: null,
        prevBtnDisabled: null
    },
    onLoad: function(option) {
        var windowWidth, windowHeight;
        wx.getSystemInfo({
                success: (res) => {
                    // 窗口的宽高
                    windowWidth = res.windowWidth;
                    windowHeight = res.windowHeight;
                    //swiper的高度
                    this.setData({
                        swiperHeight: windowHeight - 281,
                        windowWidth: windowWidth - 30
                    })
                    console.log(res)
                }
            })
            /*
             * '/pages/detail/detail?word=ally'
             * option= {word: 'ally'}
             */
        let translator = app.globalData.currentWordTrans;
        let sams = translator.sams;
        this.setData({
                currentWord: option.word,
                translator: translator,
                currentAudio: sams[this.data.imgCurrentIndex].mp3Url,
                swiperTotal: sams.length
            })
        /*
         * 初始化左按钮disable
         */
        if (this.data.imgCurrentIndex === 0) {
            this.setData({
                prevBtnDisabled: 'disabled'
            })
        }
    },
    onReady: function(e) {
        this.audioCtx = wx.createAudioContext('myAudio');
    },
    swiperChange: function(e) {
        /*
         * 切换swiper之后 硬性规定audioPlay为false,即不播放
         * @Function loadCurrenAmes加载当前的e.detail.current的音频文件
         */
        let currentIndex = e.detail.current;
        let translator = app.globalData.currentWordTrans;
        let sams = translator.sams;
        this.setData({
            currentAudio: sams[currentIndex].mp3Url,
            audioBtnClass: 'fa-play-circle',
            audioBtnEvent: 'startPlay',
            imgCurrentIndex: currentIndex
        })
        /*
        * swiperChange时跟 prev,next关联起来
        */
        if (currentIndex !== 0) {
            this.setData({
                prevBtnDisabled: ''
            })            
        } else {
            this.setData({
                prevBtnDisabled: 'disabled'
            })             
        }
        if (currentIndex !== sams.length -1) {
            this.setData({
                nextBtnDisabled: ''
            })            
        }else {
             this.setData({
                nextBtnDisabled: 'disabled'
            })            
        }
    },
    startPlay: function(e) {
        this.audioCtx.seek(0);
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
    audioBtnPreEvent: function(e) {
        let imgCurrentIndex = this.data.imgCurrentIndex;
        let translator = app.globalData.currentWordTrans;
        let sams = translator.sams;
        if (imgCurrentIndex > 0) {
            imgCurrentIndex--;
            this.setData({
                imgCurrentIndex: imgCurrentIndex,
                currentAudio: sams[imgCurrentIndex].mp3Url,
                audioBtnClass: 'fa-play-circle',
                audioBtnEvent: 'startPlay',
                nextBtnDisabled: ''
            })
            if (imgCurrentIndex === 0) {
                this.setData({
                    prevBtnDisabled: 'disabled'
                })
            }
        }
    },
    audioBtnNextEvent: function(e) {
        let imgCurrentIndex = this.data.imgCurrentIndex;
        let translator = app.globalData.currentWordTrans;
        let sams = translator.sams;
        if (imgCurrentIndex < sams.length - 1) {
            imgCurrentIndex++;
            this.setData({
                imgCurrentIndex: imgCurrentIndex,
                currentAudio: sams[imgCurrentIndex].mp3Url,
                audioBtnClass: 'fa-play-circle',
                audioBtnEvent: 'startPlay',
                prevBtnDisabled: '',
            })
            if (imgCurrentIndex === sams.length - 1) {
                this.setData({
                    nextBtnDisabled: 'disabled'
                })
            }
        }
    }
})
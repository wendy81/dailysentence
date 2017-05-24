//index.js
//获取应用实例
var app = getApp();

var imagesWh = require('../..//utils/imagesWh.js');
var getWordInfo = require('../..//utils/word.js');
var getData = require('../..//utils/getData.js'); 

Page({
    data: {
        images: null,
        word: null,
        indicatorDots: false,
        autoplay: false,
        audioPlay: false,
        interval: 5000,
        duration: 1000,
        imageWidth: null,
        imageheight: null,
        currentWord: 'ally',
    },
    onUnload: function() {
        // remove all
        app.event.off()
        //     // remove all callbacks
        // app.event.off('afterPaySuccess')
        //     // remove specific callbacks
        // app.event.off('afterPaySuccess', this.afterPaySuccess)
    },
    onLaunch: function() {
        wx.login({
            success: function(res) {
                console.log(res);
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
        // if(getImagesInfo) {
        //   app.event.emit('getImagesInfo');
        //   var getImagesInfo = app.event._stores.getImagesInfo;
        //   var imageInfo = getImagesInfo[0].ctx.data.imageInfo;
        //   // try {
        //   //   wx.setStorageSync(imageInfo.word, imageInfo)
        //   // } catch (e) {  
        //   //   console.log(e);  
        //   // }
        //   this.setData({images: imagesArry, currentWord: imageInfo.word})
        // }
      getData.getData(this);
        /*
         * 初始化 单词数据  默认为this.data.currentWord ＝ 'ally'
         */
        getWordInfo.getWordInfo(this,this.data.currentWord);
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
                getWordInfo.getWordInfo(this, v.word);
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
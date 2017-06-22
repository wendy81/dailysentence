//index.js
//获取应用实例
const imagesWh = require('../../utils/imagesWh.js');
const topEvent = require('../../utils/top.js');
const app = getApp();
const config = require('../../config.js');
const host = config.host;


const date = new Date()
const years = []
const months = []
const days = []
const currentMonth = date.getMonth() + 1;
const currentDay = date.getDate();

for (let i = 1990; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1; i <= 12; i++) {
    months.push(num(i))
}

for (let i = 1; i <= 31; i++) {
    days.push(num(i))
}

function num(i) {
    if (i < 10) {
        i = '0' + i
    }
    return i;
}

function getDate(date, that) {
    wx.request({
        url: host + '/',
        method: 'POST',
        data: {
            date: date
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: (requestres) => {
            let dataVal = requestres.data;
            let dataArry = [];
            dataArry.push(dataVal);
            that.setData({
                datas: dataArry
            })
        },
        fail: (e) => {
            console.log(e.errMsg)
        }
    })
}

Page({
    data: {
        datas: null,
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        imageWidth: null,
        imageheight: null,
        winHeight: null,
        imgCurrentIndex: 0,
        audioBtnClass: '../../images/sound_static.gif',
        audioBtnEvent: 'startPlay',
        //显示日期的数据
        years: years,
        year: date.getFullYear(),
        months: months,
        month: num(currentMonth),
        days: days,
        day: num(currentDay),
        year: date.getFullYear(),
        value: [date.getFullYear(), date.getMonth(), date.getDate()-1]
    },
    // onShareAppMessage: function(res) {
    //     console.log(res)
    //     if (res.from === 'button') {
    //         // 来自页面内转发按钮
    //         console.log(res.target)
    //     }
    //     return {
    //         title: '自定义转发标题',
    //         path: '/page/user?id=123',
    //         success: function(res) {
    //             console.log('success')
    //         },
    //         fail: function(res) {
    //             console.log('fail')
    //         }
    //     }
    // },
    onLoad: function(e) {
        var that = this;
        var date = this.data.year + '-' + this.data.month + '-' + this.data.day;

        console.log(this.data.month)
        getDate(date, that)
    },
    onReady: function(e) {
        // 使用 wx.createAudioContext 获取 audio 上下文 context
        this.audioCtx = wx.createAudioContext('myAudio')
    },
    imagebindload: function(e) {
        /*
         * 获得数据中第一个图片的宽,高  赋值给 {imageWidth: ,imageheight}
         */
        let imagesData = this.data.datas;
        let imagesZero = imagesData[0];
        if (imagesZero) {
            this.setData(imagesWh.imagesWh(e));
        }
    },
    imageError: function(e) {
        console.log(e);
    },
    startPlay: function(e) {
        this.audioCtx.play();
        this.setData({
            audioBtnClass: '../../images/sound_dynamic.gif',
            audioBtnEvent: 'stopPlay'
        })
    },
    stopPlay: function(e) {
        this.audioCtx.pause()
        this.setData({
            audioBtnClass: '../../images/sound_static.gif',
            audioBtnEvent: 'startPlay'
        })
    },
    audioEndEvent: function(e) {
        this.setData({
            audioBtnClass: '../../images/sound_static.gif',
            audioBtnEvent: 'startPlay'
        })
    },
    bindChange: function(e) {
        const val = e.detail.value;
        console.log(val)
        this.setData({
            year: this.data.years[val[0]],
            month: this.data.months[val[1]],
            day: this.data.days[val[2]]
        })
        /*
         * 日期改变,则重新调用request得到新的数据
         */
        const that = this;
        const date = this.data.year + '-' + this.data.month + '-' + this.data.day;
        getDate(date, that)
    }
})
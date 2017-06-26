//index.js
//获取应用实例
const imagesWh = require('../../utils/imagesWh.js');
const app = getApp();
const config = require('../../config.js');
const host = config.host;
const date = new Date()
const years = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const currentDate = years + '-' + num(month) + '-' + num(day);
const system = app.globalData.system;
// var showArray = [];
/*
 * 当月和日小于10时,在对应的数字前面加 ‘0’
 */
function num(i) {
    if (i < 10) {
        i = '0' + i
    }
    return i;
}

/*
 * 请求服务器获取数据
 */
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
            let tts = dataVal.tts;
            let includeMp3 = tts.indexOf(".mp3");
            let dataArry = [];
            dataArry.push(dataVal);
            that.setData({
                datas: dataArry,
                grayPos: ''
            })

            if (system === 'iOS' && includeMp3 === -1) {
                that.setData({
                    audioIconHide: 'hide'
                })
            } else {
                that.setData({
                    audioIconHide: 'show'
                })
            }
        },
        fail: (e) => {
            console.log(e.errMsg);
            wx.reLaunch({
                url: '/pages/index/index'
            })

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
        winHeight: app.globalData.windowHeight,
        windowWidth: app.globalData.windowWidth,
        imgCurrentIndex: 0,
        audioBtnClass: '../../images/sound_static.gif',
        audioBtnEvent: 'startPlay',
        audioIconHide: 'show',
        //载入数据前 灰色占位
        grayPos: 'gray-pos',
        //排序相关数据
        randomArray: '',
        correctArray: '',
        showArray: [],
        showpop: 'hide',
        compareResult: '',
        promptColor: '',
        subBtnShow: 'hide',
        clearBtnShow: 'show',
        //显示日期的数据
        array: ['美国', '中国', '巴西', '日本'],
        objectArray: [{
            id: 0,
            name: '美国'
        }, {
            id: 1,
            name: '中国'
        }, {
            id: 2,
            name: '巴西'
        }, {
            id: 3,
            name: '日本'
        }],
        index: 1,
        date: '2012-04-01',
        //选择月份后,默认为当前月的第1天
        variable: day,
        rightDateChangeBtn: '',
        leftDateChangeBtn: 'leftDateChange',
        rightDateChangeBtnClass: 'date-btn-arrow-disabled',
        leftDateChangeBtnClass: '',
        bindDateChangeTag: false
    },
    onShareAppMessage: function(res) {
        console.log(res)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '每日一句',
            path: '/page/index/index',
            success: function(res) {
                console.log('success')
            },
            fail: function(res) {
                console.log('fail')
            }
        }
    },
    onLoad: function(e) {
        var that = this;
        getDate(currentDate, that)
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
    bindDateChange: function(e) {
        /*
         * 点击选择日历,则audio暂停,并且改变播放图标样式和event
         */
        let that = this;
        that.audioCtx.pause();
        that.setData({
            date: e.detail.value,
            audioBtnClass: '../../images/sound_static.gif',
            audioBtnEvent: 'startPlay',
            /*
             * 点击一次则变为true
             */
            bindDateChangeTag: true,
            /*
             * 选择日历,清空显示数据
             */
            showArray: [],
            subBtnShow: 'hide',
            clearBtnShow: 'show',
            compareResult: '',
            /*
             * 选择日历,左剪头disabled态
             */
            rightDateChangeBtn: 'rightDateChange',
            leftDateChangeBtn: '',
            rightDateChangeBtnClass: '',
            leftDateChangeBtnClass: 'date-btn-arrow-disabled',
            //刚开始点周picker,则赋值variable为1
            variable: 1
        })
        getDate(this.data.date, that);

        // 如果picker选择时间大于当日的时间则右箭头disabled态

        // 当日时间
        let currentDate = years + '-' + num(month);
        let dateArry = currentDate.split('-');
        let dateString = dateArry.join('');
        // picker选择时间
        let dataDate = this.data.date;
        let dataDateArry = dataDate.split('-');
        let dataDateString = dataDateArry.join('');

        if (Number(dateString) < Number(dataDateString)) {
            this.setData({
                rightDateChangeBtn: '',
                leftDateChangeBtn: 'leftDateChange',
                rightDateChangeBtnClass: 'date-btn-arrow-disabled',
                leftDateChangeBtnClass: ''
            })
        }
        // setInterval(this.rightDateChange,2000)
    },
    leftDateChange: function(e) {
        let that = this;
        /*
         * 如果修改一次picker值,则赋值bindDateChangeTag ＝ true
         */
        let bindDateChangeTag = this.data.bindDateChangeTag;
        let date;
        if (bindDateChangeTag) {
            //为把修改picker后取的值放到date中,这里取出来
            date = this.data.date;
        } else {
            //如果没有点击picker,则取当前日期的年－月
            date = years + '-' + num(month);
        }
        let currentDateDate = date;
        let variable = this.data.variable;

        if (1 < variable) {
            let i = variable - 1;
            let nowVar = num(i);
            currentDateDate = currentDateDate + '-' + nowVar;

            if (variable === 2 || currentDateDate === '2012-04-01') {
                this.setData({
                    variable: i,
                    date: date,
                    rightDateChangeBtn: 'rightDateChange',
                    leftDateChangeBtn: '',
                    rightDateChangeBtnClass: '',
                    leftDateChangeBtnClass: 'date-btn-arrow-disabled'
                })
            } else {
                this.setData({
                    variable: i,
                    date: date,
                    rightDateChangeBtn: 'rightDateChange',
                    leftDateChangeBtn: 'leftDateChange',
                    rightDateChangeBtnClass: '',
                    leftDateChangeBtnClass: '',
                })
            }
            getDate(currentDateDate, that)

        }
    },
    rightDateChange: function(e) {
        let that = this;
        let currentDateDate = that.data.date;
        let variable = this.data.variable;
        //如果variable 在0-31之间
        if (0 < variable < 31) {
            let i = variable + 1;
            let nowVar = num(i);
            currentDateDate = currentDateDate + '-' + nowVar;
            getDate(currentDateDate, that)
            this.setData({
                    variable: i,
                    rightDateChangeBtn: 'rightDateChange',
                    leftDateChangeBtn: 'leftDateChange',
                    rightDateChangeBtnClass: '',
                    leftDateChangeBtnClass: ''
                })
                //当前日期是当日日期时或者 当前日期为每月的最后一天（如果小于31天,则会多跳到下月的前几天）
                //则右箭头不可点击状态
            if (currentDateDate === currentDate || currentDateDate === that.data.date + '-' + 31) {
                this.setData({
                    rightDateChangeBtn: '',
                    leftDateChangeBtn: 'leftDateChange',
                    rightDateChangeBtnClass: 'date-btn-arrow-disabled',
                    leftDateChangeBtnClass: ''
                })
            }
        }
    },
    gameEvent: function(e) {
        let datas = this.data.datas;
        let content = datas[0].content;
        let turnIntoArray = content.split(" ");
        let filterBlank = turnIntoArray.filter(function(val) {
            return val !== '';
        });
        this.setData({
            correctArray: filterBlank,
            showpop: 'show',
            showArray: [],
            subBtnShow: 'hide',
            clearBtnShow: 'show',
            compareResult: ''
        })
        let randomArray = filterBlank.sort();
        this.setData({
            randomArray: randomArray
        })
        console.log(this.data.correctArray)
        console.log(this.data.randomArray)
    },
    randomArrayEvent: function(e) {
        let currentClickItem = e.currentTarget.dataset.item;
        let currentClickIndex = e.currentTarget.dataset.index;
        let randomArray = this.data.randomArray;
        let showArray = this.data.showArray;
        showArray.push(currentClickItem);
        randomArray.splice(currentClickIndex, 1);
        if (randomArray.length === 0) {
            this.setData({
                subBtnShow: 'show',
                clearBtnShow: 'hide'
            })
        }
        this.setData({
            showArray: showArray,
            randomArray: randomArray
        })

    },
    maskEvent: function(e) {
        this.setData({
            showpop: 'hide',
            showArray: []
        })
    },
    closePopEvent: function(e) {
        this.setData({
            showpop: 'hide',
            showArray: []
        })
    },
    submitEvent: function(e) {
        let showArray = this.data.showArray;
        let correctArray = this.data.correctArray;
        if (showArray.join(" ") === correctArray.join(" ")) {
            this.setData({
                compareResult: '(很棒啊!)',
                promptColor: 'green',
            })
        } else {
            this.setData({
                compareResult: '(不正确啊,再接再励!)',
                promptColor: 'red',
                subBtnShow: 'hide',
                clearBtnShow: 'show',
                showArray: []
            })
            let datas = this.data.datas;
            let content = datas[0].content;
            let turnIntoArray = content.split(" ");
            let filterBlank = turnIntoArray.filter(function(val) {
                return val !== '';
            });
            let randomArray = filterBlank.sort();
            this.setData({
                randomArray: randomArray
            })
        }
    },
    clearEvent: function(e) {
        let datas = this.data.datas;
        let content = datas[0].content;
        let turnIntoArray = content.split(" ");
        let filterBlank = turnIntoArray.filter(function(val) {
            return val !== '';
        });
        let randomArray = filterBlank.sort();
        this.setData({
            randomArray: randomArray
        })
        this.setData({
            showArray: []
        })
    }
})
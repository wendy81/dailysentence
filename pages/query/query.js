//query.js
//查询数据信息
const app = getApp();
// const socketData = require('../../utils/socketData.js');
const topEvent = require('../../utils/top.js');

Page({
    data: {
        inputValue: null,
        words: null,
        prompt: '',
        topTemplate: {
            topSearchActive: 'top-active',
            homeEvent: ''
        },
        winHeight: null
    },
    onLoad: function(option) {
        let winHeight = option.winHeight;
        this.setData({
            winHeight: winHeight
        })
            /*
             * @Function socketData  获得数据this.data.images的数组信息
             */
            // socketData.socketData(this);
    },
    inputEvent: function(e) {
        const inputValue = (e.detail.value).toLowerCase();
        // --------- 发送凭证 ------------------
        wx.request({
            // url: 'https://learnabc.cloudno.de/search',
            url: 'http://127.0.0.1:8080/search',
            data: {
                code: inputValue
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                let data = res.data;
                if (data !== 'No Data') {
                    if (data[0]._id) {
                        wx.hideNavigationBarLoading()
                        this.setData({
                            words: data,
                            prompt: ''
                        })
                    } else {
                        wx.showNavigationBarLoading()
                    }
                } else {
                    this.setData({
                        words: '',
                        prompt: data
                    })
                }
            }
        })
        // ------------------------------------
    },
    swichTabAndChangeIndex: function(e) {
        // const currentText = e.currentTarget.dataset.item;
        // let queryListKey = [];
        // for (let value of this.data.images) {
        //     queryListKey.push(value.key)
        // }
        // queryListKey.map((v, i) => {
        //     if (v === currentText) {
        //         wx.switchTab({
        //             url: '/pages/index/index',
        //             success: function(res) {
        //                 console.log(app);
        //             }
        //         })
        //         app.globalData = {
        //             imgCurrentIndex: i
        //         }
        //     }
        // })
    },
    clickDetail: function(e) {
        const currentText = e.currentTarget.dataset.item;
        const wordsArry = this.data.words;
        const currentWord = [];
        wordsArry.map((v, i) => {
            if (v.key === currentText) {
                currentWord.push(v);
                let vValue = JSON.stringify(v);
                app.globalData.currentWord = currentWord;
                wx.navigateTo({
                    url: '/pages/index/index'
                })
            }
        })
    },
    homeEvent: topEvent.topEvent.homeEvent,
    searchEvent: topEvent.topEvent.searchEvent
})
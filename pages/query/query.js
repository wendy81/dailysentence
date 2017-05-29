//index.js
//获取应用实例
var app = getApp();
var getWordInfo = require('../..//utils/word.js');

Page({
    data: {
        inputValue: null,
        queryList: null,
        imagesArray: null,
        word: null
    },
    onLoad: function(e) {
        this.setData({
            imagesArray: app.globalData.imagesArray
        })
        // let globalImagesArry = this.data.imagesArray;
        // let keyArry = [];
        // globalImagesArry.map((v, i) => {
        //     if (i < 9) {
        //         var obj = {};
        //         getWordInfo.getWordInfo(this, v.key);
        //         // // if (this.data.word !== null) {
        //         //     obj.key = v.key;
        //         //     obj.word = this.data.word;
        //         //     keyArry.push(obj);
        //         // // }
        //         console.log(this.data.word)

        //     }
        // })
        // console.log(keyArry);
    },
    onShow: function(e) {
        console.log(app.globalData.imagesArray);
    },
    inputEvent: function(e) {
        const imagesArray = this.data.imagesArray;
        const inputValue = e.detail.value;
        if (imagesArray !== null) {
            let filterKey = [];
            let newQueryList = imagesArray.filter((v) => {
                let key = v.key;
                var keyInclude = key.includes(inputValue);
                if (inputValue === '') {
                    keyInclude = false;
                }
                return keyInclude;
            });
            newQueryList.map((v, i) => {
                if (i < 10) {
                    filterKey.push(v.key);
                }
            })
            this.setData({
                queryList: filterKey
            })
            console.log(this.data.queryList)
        } else {
            this.setData({
                queryList: ['没有对应的数据显示']
            })
        }
    },
    swichTabAndChangeIndex: function(e) {
        const currentText = e.currentTarget.dataset.item;
        let queryListKey = [];
        for (let value of this.data.imagesArray) {
            queryListKey.push(value.key)
        }
        queryListKey.map((v, i) => {
            if (v === currentText) {
                wx.switchTab({
                    url: '/pages/index/index',
                    success: function(res) {
                        console.log(app);
                    }
                })
                app.globalData = {
                    imgCurrentIndex: i
                }
            }
        })
    }
})
//query.js
//查询数据信息
var app = getApp();
var socketData = require('../..//utils/socketData.js');

Page({
    data: {
        inputValue: null,
        words: null,
        prompt: '',
        topTemplate: {
            topSearchActive: 'top-active',
            homeEvent: ''
        }
    }
})
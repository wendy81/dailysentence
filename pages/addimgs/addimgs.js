//index.js
//获取应用实例
var app = getApp();

Page({
    data: {
        imageInfo: null
    },
    onLoad: function(e) {

    },
    formSubmit: function(e) {
      var arry = [];
      try {
        var value = wx.getStorageSync('imagesArry');
        if (value) {
           value.push(e.detail.value);
           wx.setStorageSync('imagesArry', value);
        } else {
           arry.push(e.detail.value);
           wx.setStorageSync('imagesArry', arry);
        }
      } catch (e) {
        console.log(e);
      }
      // app.event.on('getImagesInfo', this.getImagesInfo, this);
    },
    getImagesInfo: function() {
        this.setData({
            imageInfo: e.detail.value
        })
    },
    formReset: function(e) {

    }
})
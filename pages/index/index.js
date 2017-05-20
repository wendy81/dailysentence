//index.js
//获取应用实例
var imagesWh = require('./imagesWh.js');
console.log(imagesWh);

Page({
  data: {
    imgUrls: [
      {'word':'ally','url':'../images/IMG_2820.jpg'},
      {'word':'ambitious','url':'../images/IMG_2821.jpg'},
      {'word':'apploud','url':'../images/IMG_2822.jpg'}
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    imageWidth: null,
    imageheight: null
  },
  imagebindload: function(e) {
   this.setData(imagesWh.imagesWh(e))
  },
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  }
})

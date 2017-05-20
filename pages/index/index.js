//index.js
//获取应用实例
// var getData = require('../..//utils/getData.js');
var imagesWh = require('../..//utils/imagesWh.js');

Page({
  data: {
    images: [
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
  onLoad: function () {
    console.log('onLoad')
    var that = this

    //获取远程数据
    wx.request({
      url: 'https://raw.githubusercontent.com/jiangzy27/how_to_react/master/score.json',
      header:{
        "Content-Type":"application/json"
      },
      data: {},
      success: function(res){
        console.log(res);
        that.setData({removeData:res.data.data});
      },
    })
  },
  imagebindload: function(e) {
   this.setData(imagesWh.imagesWh(e));
  }
})

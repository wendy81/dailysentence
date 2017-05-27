function getWordInfo(params,currentTargetWord) {
    wx.request({
        url: 'https://xtk.azurewebsites.net/BingService.aspx',
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
        	"Format" :"jsonwv",
        	"Action": "search",
        	"Word": String(currentTargetWord)
        },
        success: res => {
        	var amep,ames,brep,bres,mn1,mn2,mn3,pos1,pos2,pos3,word;
        	if(res.data.pos1 === '网络') {
        		pos1 =res.data.pos1 + '.';
        	} else {
        		pos1 =res.data.pos1;
        	}
        	if(res.data.pos2 === '网络') {
        		pos2 =res.data.pos2 + '.';
        	} else {
        		pos2 =res.data.pos2;
        	}
        	if(res.data.pos3 === '网络') {
        		pos3 =res.data.pos3 + '.';
        	} else {
        		pos3 =res.data.pos3;
        	}       	

            params.setData({
                word: {
                	"amep": res.data.amep,
                	"ames": res.data.ames,
                	"brep": res.data.brep,
                	"bres": res.data.bres,
                	"mn1": res.data.mn1,
                	"mn2": res.data.mn2,
                	"mn3": res.data.mn3,
                	"pos1": pos1,
                	"pos2": pos2,
                	"pos3": pos3,
                	"word": res.data.word
                }
            });
        }
    });
}

exports.getWordInfo = getWordInfo;
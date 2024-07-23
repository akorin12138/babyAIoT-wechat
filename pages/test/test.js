Page({
  data: {
    stories: []  // 定义一个数组来存放从服务器获取的数据
  },
  
  // 事件处理函数
  getUserInfo: function() {
    wx.request({ 
      method: 'GET',
      url: 'http://localhost:5000/landing',
      success: (res) => {
        console.log(res.data);
        console.log('ok');
        this.setData({
          stories: res.data  // 更新页面显示
        });
      },
      fail: function () {
        console.log("获取失败");
      }
    })
  }
});

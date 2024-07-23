// pages/babyrecord/babyrecord.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    objectArray: [{ time: "00:00:00", babyStatus : '醒了'}],
    fakeArray: [
      { time: "07:20:37", babyStatus: '尿床了' },
      { time: "11:40:02", babyStatus: '困了' },
      { time: "12:00:15", babyStatus: '不舒服' },
      { time: "15:00:34", babyStatus: '想要抱了' },
      { time: "17:30:45", babyStatus: '饿了' },
      { time: "22:00:11", babyStatus: '醒了' },
    ],
    timeTemp: "",
    inter: "",
  },
  startInter: function () {
    var that = this;
    that.data.inter = setInterval(function () {
      // TODO 需要无限循环执行的任务
      if (that.data.timeTemp.localeCompare(wx.getStorageSync("time")) === 0) {
        // console.log('----->skip----->')
      } else {
        // console.log("----->in----->");
        that.setData({
          objectArray: wx.getStorageSync("objectArray"),
          timeTemp: wx.getStorageSync("time"),
        });
        wx.showModal({
          title: "警告",
          content: "宝宝尿床了！",
          success: function (res) {},
        });
      }
    }, 10000);
  },
  endInter: function () {
    var that = this;
    clearInterval(that.data.inter);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      objectArray: wx.getStorageSync("objectArray"),
    });
    that.startInter();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.endInter();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
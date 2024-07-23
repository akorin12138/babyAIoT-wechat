const hostip = "192.168.35.179:5000";

// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    item: 0,
    tab: 0,
    playlist: [
      {
        id: 1,
        title: "安娜的橱窗",
        singer: "封茗囧菌",
        coverImgUrl: "../../static/img/images/c2.jpg",
      },
      {
        id: 2,
        title: "马兰花",
        singer: "喜马拉雅",
        coverImgUrl: "../../static/img/erge.png",
      },
      {
        id: 3,
        title: "娃哈哈",
        singer: "喜马拉雅",
        coverImgUrl: "../../static/img/erge.png",
      },
      {
        id: 4,
        title: "五只小鸭子",
        singer: "喜马拉雅",
        coverImgUrl: "../../static/img/erge.png",
      },
      {
        id: 5,
        title: "儿歌串烧",
        singer: "喜马拉雅",
        coverImgUrl: "../../static/img/erge.png",
      },
      {
        id: 6,
        title: "儿童串串烧",
        singer: "喜马拉雅",
        coverImgUrl: "../../static/img/erge.png",
      },
      {
        id: 7,
        title: "儿歌串烧",
        singer: "喜马拉雅",
        coverImgUrl: "../../static/img/erge.png",
      },
      {
        id: 8,
        title: "童谣串烧",
        singer: "喜马拉雅",
        coverImgUrl: "../../static/img/erge.png",
      },
      {
        id: 9,
        title: "儿歌串串烧",
        singer: "喜马拉雅",
        coverImgUrl: "../../static/img/erge.png",
      },
      {
        id: 10,
        title: "儿歌串烧",
        singer: "喜马拉雅",
        coverImgUrl: "../../static/img/erge.png",
      },
      {
        id: 11,
        title: "采蘑菇的小姑娘",
        singer: "喜马拉雅",
        coverImgUrl: "../../static/img/erge.png",
      },
    ],

    state: "paused" /*播放状态码*/,
    playIndex: 0,
    play: {
      currentTime: "00:00",
      duration: "00:00",
      percent: 0,
      title: "",
      singer: "",
      coverImgUrl: "../../static/img/images/C.jpg",
    },
  },

  /*滚动条js函数*/
  /*播放/暂停音乐js函数*/
  play: function (event) {
    const musicId = event.currentTarget.dataset.id;
    const music = this.data.playlist.find((music) => music.id === musicId);
    this.setData({ state: "running" });
    console.log(music);

    wx.request({
      url: "http://" + hostip + "/music",
      method: "POST",
      data: {
        title: music.title,
        state: this.data.state,
      },
      header: {
        "content-type": "application/json",
      },
      success: (res) => {
        console.log("数据发送成功", res);
        console.log("##############");
        console.log(res.data);
        console.log("##############");
        this.data.initDone = true;
      },
      fail: (err) => {
        console.error("数据发送失败", err);
      },
    });
  },
  pause: function () {
    this.setData({ state: "paused" });
    wx.request({
      url: "http://" + hostip + "/music",
      method: "POST",
      data: {
        state: this.data.state,
      },
      header: {
        "content-type": "application/json",
      },
      success: (res) => {
        console.log("数据发送成功", res);
        console.log("##############");
        console.log(res.data);
        console.log("##############");
      },
      fail: (err) => {
        console.error("数据发送失败", err);
      },
    });
  },

  unpause: function () {
    this.setData({ state: "running" });
    wx.request({
      url: "http://" + hostip + "/music",
      method: "POST",
      data: {
        state: this.data.state,
      },
      header: {
        "content-type": "application/json",
      },
      success: (res) => {
        console.log("数据发送成功", res);
        console.log("##############");
        console.log(res.data);
        console.log("##############");
        this.data.audioSrc = res.data.audioUrl;
        this.data.initDone = true;
      },
      fail: (err) => {
        console.error("数据发送失败", err);
      },
    });
  },

  /*播放列表键 */
  change: function (e) {
    this.setMusic(e.currentTarget.dataset.index);
    this.play();
  },

  onReady: function (index) {
    var that = this;
    //播放失败检测

    //播放结束后自动换下一曲

    //自动更新播放速度

    //默认选择第一曲

    //格式化时间
  },

  next: function () {
    var index =
      this.data.playIndex >= this.data.playlist.length - 1
        ? 0
        : this.data.playIndex + 1;
    this.setMusic(index);
    if (this.data.state === "running") {
      this.play();
    }
  },

  // 事件处理函数
  onLoad() {},
});

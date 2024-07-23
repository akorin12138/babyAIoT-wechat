const { connect } = require("../../utils/mqtt");
const { formatTime } = require("../../utils/util");

const hostip = "192.168.1.11:5000";

const mqttHost = "192.168.1.11"; //mqtt 服务器域名/IP
const mqttPort = 31004; //mqtt 服务器域名/IP

const mqttUrl = `wx://${mqttHost}:${mqttPort}/mqtt`; //  mqtt连接路径

Page({
  data: {
    showBottom: false,
    babyTemp: 36.5,
    roomTemp: 22.4,
    showWebView: false,
    webUrl: "",
    client: {},

    babyTemperature: 0.0,
    babyDiaper: 0.0,
    babyStatus: "",
    babyScore: 0.0,

    ambientHumidity: "",
    ambientTemperature: 0,

    roomCO2: 0,
    roomLight: 0,
    roomSound: 0,
    roomMeth: 0,
    roomTvoc: 0,

    diaperFlag: false, // 宝宝尿床标志
    babyFlag: false, // 宝宝异常标志

    objectArray: [],

    mqttInit: false,
    face: true,
    te: true,
  },

  getBabyStatus: function (message) {
    if (message.localeCompare("awake") === 0) {
      return "醒了";
    } else if (message.localeCompare("sleepy") === 0) {
      return "困了";
    } else if (message.localeCompare("hug") === 0) {
      return "想要抱了";
    } else if (message.localeCompare("hungry") === 0) {
      return "饿了";
    } else if (message.localeCompare("uncomfortable") === 0) {
      return "不舒服";
    } else {
      return "尿床了";
    }
  },

  onLoad() {
    var that = this;
    wx.showToast({
      title: "连接服务器....",
      icon: "loading",
      duration: 10000,
      mask: false,
    });
    let second = 10;
    var toastTimer = setInterval(() => {
      second--;
      if (second) {
        wx.showToast({
          title: `连接服务器...${second}`,
          icon: "loading",
          duration: 1000,
          mask: false,
        });
      } else {
        clearInterval(toastTimer);
        wx.showToast({
          title: "连接失败",
          icon: "error",
          mask: false,
        });
      }
    }, 1000);
    that.setData({
      client: connect(mqttUrl),
    });
    that.data.client.on("connect", function () {
      console.log("成功连接mqtt服务器！");
      clearInterval(toastTimer);
      wx.showToast({
        title: "连接成功",
        icon: "success",
        mask: false,
      });
      // 一秒后订阅主题
      setTimeout(() => {
        that.data.client.subscribe("baby/#", function (err) {
          if (!err) {
            console.log("成功订阅设备上行数据Topic!");
          }
        });
        that.data.client.subscribe("room/#", function (err) {
          if (!err) {
            console.log("成功订阅设备上行数据Topic!");
          }
        });
        that.data.client.subscribe("ambient/#", function (err) {
          if (!err) {
            console.log("成功订阅设备上行数据Topic!");
          }
        });
      }, 1000);
    });
    that.data.client.on("message", function (topic, message) {
      // console.log(topic);
      var dateDate = new Date();
      var face = {};
      if (topic.localeCompare("baby/face") === 0) {
        face = JSON.parse(message);
        console.log(Object.values(face)[0]);
        if (Object.values(face)[0] === 0) {
          that.setData({ face: false });
        } else {
          that.setData({ face: true });
        }
      }
      if (that.data.face === true) {
        message = message.toString();
        try {
          // console.log(message);
          if (message.localeCompare("nan") === 0) {
            // console.log("====skip====");
          } else {
            if (topic.localeCompare("baby/temperature") === 0) {
              that.setData({ babyTemperature: message });
              if (message < 26)
                wx.showToast({
                  title: "宝宝温度偏低！",
                  icon: "none",
                  duration: 200, //持续的时间
                  success: function (res) {},
                });
              wx.setStorageSync("babyTimeTemperature", formatTime(dateDate));
              wx.setStorageSync("babyTemperature", message);
            } else if (topic.localeCompare("baby/diaper") === 0) {
              that.setData({ babyDiaper: message });
              if (message > 0.5)
                wx.showModal({
                  title: "警告",
                  content: "宝宝尿床了！",
                });
            } else if (topic.localeCompare("baby/score") === 0) {
              that.setData({ babyScore: message });
            } else if (topic.localeCompare("baby/status") === 0) {
              wx.setStorageSync("time", formatTime(dateDate));
              wx.setStorageSync("babyStatus", that.getBabyStatus(message));
              if (
                that.data.babyStatus.localeCompare(
                  that.getBabyStatus(message)
                ) === 0
              ) {
                // console.log("skip----->");
              } else {
                that.data.objectArray = [
                  {
                    time: wx.getStorageSync("time"),
                    babyStatus: wx.getStorageSync("babyStatus"),
                  },
                ].concat(that.data.objectArray);
                // console.log(that.data.objectArray);
                if (that.data.objectArray.length > 10) {
                  that.data.objectArray.splice(10, 1);
                }
                that.setData({
                  objectArray: that.data.objectArray,
                });
                wx.setStorageSync("objectArray", that.data.objectArray);
              }

              that.setData({ babyStatus: that.getBabyStatus(message) });
              // wx.setStorageSync('time', time);
            } else if (topic.localeCompare("ambient/temperature") === 0) {
              that.setData({ ambientTemperature: message });
              wx.setStorageSync("ambientTemperature", message);
            } else if (topic.localeCompare("ambient/humidity") === 0) {
              that.setData({ ambientHumidity: message });
              wx.setStorageSync("ambientHumidityTime", formatTime(dateDate));
              wx.setStorageSync("ambientHumidity", message);
            } else if (topic.localeCompare("room/fs00602Co2") === 0) {
              that.setData({ roomCO2: message });
              if (message > 700 && that.data.babyStatus === "困了")
                wx.showModal({
                  title: "警告",
                  content: "房间二氧化碳浓度过高，请注意通风",
                });
              wx.setStorageSync("ambientCO2Time", formatTime(dateDate));
              wx.setStorageSync("ambientCO2", message);
            } else if (topic.localeCompare("room/light_intensity") === 0) {
              that.setData({ roomLight: message });
              if (message > 70 && that.data.babyStatus === "困了")
                wx.showModal({
                  title: "警告",
                  content: "宝宝困了，注意房间光线强度",
                });
              wx.setStorageSync("ambientLightTime", formatTime(dateDate));
              wx.setStorageSync("ambientLight", message);
            } else if (topic.localeCompare("room/soundDb") === 0) {
              that.setData({ roomSound: message });
              if (message > 50 && that.data.babyStatus === "困了")
                wx.showModal({
                  title: "警告",
                  content: "宝宝困了，注意不要太大声噢",
                });
              wx.setStorageSync("ambientSoundTime", formatTime(dateDate));
              wx.setStorageSync("ambientSound", message);
            } else if (topic.localeCompare("room/fs00602Meth") === 0) {
              if (message > 60000) {
              } else {
                that.setData({ roomMeth: message });
                wx.setStorageSync("ambientMethTime", formatTime(dateDate));
                wx.setStorageSync("ambientMeth", message);
              }
            } else if (topic.localeCompare("room/fs00602Tvoc") === 0) {
              if (message > 60000) {
              } else {
                that.setData({ roomMeth: message });
                wx.setStorageSync("ambientTvocTime", formatTime(dateDate));
                wx.setStorageSync("ambientTvoc", message);
              }
              that.setData({ roomTvoc: message });
            }
          }
        } catch (error) {
          // 解析失败错误捕获并打印（错误捕获之后不会影响程序继续运行）
          console.log(error);
          console.group(`[${formatTime(new Date())}][消息解析失败]`);
          console.log("[错误消息]", message.toString());
          console.groupEnd();
        }
      } else {
        wx.showToast({
          title: "未检测到婴儿",
          icon: "error",
          duration: 10000,
          mask: true,
        });
      }

      // console.log(message);
      // message是16进制的Buffer字节流
    });
  },

  // 显示底部窗口
  showBottomWindow() {
    this.setData({ showBottom: true });
  },

  // 隐藏底部窗口
  hideBottomWindow() {
    this.setData({ showBottom: false });
  },

  statechange(e) {
    console.log("live-player code:", e.detail.code);
  },
  netstatus(e) {
    console.log("live-player net status:", e.detail.info);
  },

  startRecording() {
    console.log("开始录音");
    const recorderManager = wx.getRecorderManager();

    recorderManager.onStart(() => {
      console.log("录音开始");
      // 开始录音动画效果
      wx.showLoading({
        title: "录音中...",
      });
    });

    recorderManager.onError((res) => {
      console.error("录音错误", res);
      wx.hideLoading();
    });

    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 2,
      encodeBitRate: 192000,
      format: "wav",
    };

    recorderManager.start(options);
  },

  stopRecording() {
    console.log("结束录音");
    const recorderManager = wx.getRecorderManager();

    recorderManager.onStop((res) => {
      console.log("录音结束", res);
      const { tempFilePath } = res;
      // 打印录音文件路径
      console.log("录音文件路径：", tempFilePath);
      // 停止录音动画效果
      wx.hideLoading();

      // 上传录音文件
      wx.uploadFile({
        url: "http://" + hostip + "/upload", // 后端接口地址
        filePath: tempFilePath,
        name: "file", // 文件对应的key，后端人员通过这个key获得文件
        header: {
          "content-type": "multipart/form-data",
        },
        success(uploadRes) {
          console.log("上传成功", uploadRes);
        },
        fail(uploadErr) {
          console.error("上传失败", uploadErr);
        },
      });
    });

    recorderManager.stop();
  },

  navigateToMusic: function () {
    wx.navigateTo({
      url: "/pages/music/music",
    });
  },

  navigateToRecord: function () {
    wx.navigateTo({
      url: "/pages/babyrecord/babyrecord",
    });
  },

  navigateToStory: function () {
    wx.navigateTo({
      url: "/pages/baby_story/baby_story",
    });
  },

  navigateToRoom: function () {
    wx.navigateTo({
      url: "/pages/room/index",
    });
  },

  navigateToBot: function () {
    console.log("点击了知识");
    this.setData({
      showWebView: true,
      webUrl:
        "https://www.coze.cn/space/7385464585878274074/bot/7388359904669188130",
    });
  },
});

import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

var babyTemperatureArray = [];
var ambientTemperatureArray = [];
var babyTimeTemperatureArray = [];

var ambientCO2Array = [];
var ambientMethArray = [];
var ambientTvocArray = [];
var ambientTimeArray = [];

var ambientLightArray = [];
var ambientsoundArray = [];

let chartTemp;
var optionTemp = {
  title: { text: "室温与宝宝体温", left: "center" },
  legend: {
    data: ["婴儿体温", "室温"],
    top: 0,
    left: "center",
    backgroundColor: "white",
    z: 100,
  },
  grid: {
    containLabel: true,
  },
  tooltip: {
    show: true,
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: babyTimeTemperatureArray,
    // show: false
  },
  yAxis: {
    name: "温度/℃",
    x: "center",
    type: "value",
    min: 20,
    max: 40,
    splitLine: {
      lineStyle: {
        type: "dashed",
      },
    },
    // show: false
  },
  series: [
    {
      name: "婴儿体温",
      type: "line",
      smooth: true,
      data: babyTemperatureArray,
    },
    {
      name: "室温",
      type: "line",
      smooth: true,
      data: ambientTemperatureArray,
    },
  ],
};
function initChartTemp(canvas, width, height, dpr) {
  chartTemp = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  });
  canvas.setChart(chartTemp);
  chartTemp.setOption(optionTemp);
  return chartTemp;
}

let chartTvoc;
var optionTvoc = {
  title: { text: "室内气体浓度", left: "center" },
  legend: {
    data: ["二氧化碳 ppm", "甲醛 μg/m³", "TVOC ppb"],
    top: 0,
    left: "center",
    backgroundColor: "white",
    z: 100,
  },
  grid: {
    containLabel: true,
  },
  tooltip: {
    show: true,
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ambientTimeArray,
    // show: false
  },
  yAxis: {
    x: "center",
    type: "value",
    splitLine: {
      lineStyle: {
        type: "dashed",
      },
    },
    // show: false
  },
  series: [
    {
      name: "二氧化碳 ppm",
      type: "line",
      smooth: true,
      data: ambientCO2Array,
    },
    {
      name: "甲醛 μg/m³",
      type: "line",
      smooth: true,
      data: ambientMethArray,
    },
    {
      name: "TVOC ppb",
      type: "line",
      smooth: true,
      data: ambientTvocArray,
    },
  ],
};
function initChartTvoc(canvas, width, height, dpr) {
  chartTvoc = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  });
  canvas.setChart(chartTvoc);
  chartTvoc.setOption(optionTvoc);
  return chartTvoc;
}

let chartRoom;
var optionRoom = {
  title: { text: "环境情况", left: "center" },
  legend: {
    data: ["光线强度 lx", "噪声 dB"],
    top: 0,
    left: "center",
    backgroundColor: "white",
    z: 100,
  },
  grid: {
    containLabel: true,
  },
  tooltip: {
    show: true,
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ambientTimeArray,
    // show: false
  },
  yAxis: {
    x: "center",
    type: "value",
    splitLine: {
      lineStyle: {
        type: "dashed",
      },
    },
    // show: false
  },
  series: [
    {
      name: "光线强度 lx",
      type: "line",
      smooth: true,
      data: ambientLightArray,
    },
    {
      name: "噪声 dB",
      type: "line",
      smooth: true,
      data: ambientsoundArray,
    },
  ],
};
function initChartRoom(canvas, width, height, dpr) {
  chartRoom = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  });
  canvas.setChart(chartRoom);
  chartRoom.setOption(optionRoom);
  return chartRoom;
}

Page({
  data: {
    inter: "",
    babyTimeTemperature: "",
    ambientTime: "",
    ec: {
      onInit: initChartTemp,
    },
    ec1: {
      onInit: initChartTvoc,
    },
    ec2: {
      onInit: initChartRoom,
    },
    humidity: "",
  },
  startInter: function () {
    var that = this;
    that.data.inter = setInterval(function () {
      // TODO 需要无限循环执行的任务
      if (
        that.data.babyTimeTemperature.localeCompare(
          wx.getStorageSync("babyTimeTemperature")
        ) === 0
      ) {
        // console.log('----->skip----->')
      } else {
        // console.log("----->in----->");
        babyTemperatureArray = babyTemperatureArray.concat([
          wx.getStorageSync("babyTemperature"),
        ]);
        ambientTemperatureArray = ambientTemperatureArray.concat([
          wx.getStorageSync("ambientTemperature"),
        ]);
        babyTimeTemperatureArray = babyTimeTemperatureArray.concat([
          wx.getStorageSync("babyTimeTemperature"),
        ]);
        if (babyTemperatureArray.length > 10) {
          babyTemperatureArray.splice(0, 1);
          ambientTemperatureArray.splice(0, 1);
          babyTimeTemperatureArray.splice(0, 1);
        }
      }

      if (
        that.data.ambientTime.localeCompare(
          wx.getStorageSync("ambientTvocTime")
        ) === 0
      ) {
      } else {
        ambientTvocArray = ambientTvocArray.concat([
          wx.getStorageSync("ambientTvoc"),
        ]);
        ambientMethArray = ambientMethArray.concat([
          wx.getStorageSync("ambientMeth"),
        ]);
        ambientCO2Array = ambientCO2Array.concat([
          wx.getStorageSync("ambientCO2"),
        ]);
        ambientTimeArray = ambientTimeArray.concat([
          wx.getStorageSync("ambientTvocTime"),
        ]);

        ambientLightArray = ambientLightArray.concat([
          wx.getStorageSync("ambientLight"),
        ]);
        ambientsoundArray = ambientsoundArray.concat([
          wx.getStorageSync("ambientSound"),
        ]);

        if (ambientTimeArray.length > 10) {
          ambientTvocArray.splice(0, 1);
          ambientMethArray.splice(0, 1);
          ambientCO2Array.splice(0, 1);
          ambientTimeArray.splice(0, 1);

          ambientLightArray.splice(0, 1);
          ambientsoundArray.splice(0, 1);
        }
      }

      that.setData({
        babyTimeTemperature: wx.getStorageSync("babyTimeTemperature"),
        ambientTime: wx.getStorageSync("ambientTvocTime"),
        humidity: wx.getStorageSync("ambientHumidity"),
      });

      optionTemp.series[0].data = babyTemperatureArray;
      optionTemp.series[1].data = ambientTemperatureArray;
      optionTemp.xAxis.data = babyTimeTemperatureArray;
      chartTemp.setOption(optionTemp);

      optionTvoc.series[0].data = ambientCO2Array;
      optionTvoc.series[1].data = ambientMethArray;
      optionTvoc.series[2].data = ambientTvocArray;
      optionTvoc.xAxis.data = ambientTimeArray;
      chartTvoc.setOption(optionTvoc);

      optionRoom.series[0].data = ambientLightArray;
      optionRoom.series[1].data = ambientsoundArray;
      optionRoom.xAxis.data = ambientTimeArray;
      chartRoom.setOption(optionRoom);
    }, 1000);
  },
  endInter: function () {
    var that = this;
    clearInterval(that.data.inter);
  },
  onLoad(options) {
    var that = this;

    that.startInter();
  },
  onReady() {},

  onUnload() {
    // this.endInter();
  },
});

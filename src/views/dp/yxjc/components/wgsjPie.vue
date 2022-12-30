<template>
  <div class="HbarAnalysis">
    <div id="echart1" style="width:100%;height:100%"></div>
    <div class="aa">
      <p>共有整改单<span style="color:rgba(45,230,150,1)">1856</span>张</p>
      <p>已闭合<span style="color:rgba(45,230,150,1)">1718</span>张</p>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts5";
export default {
  name: "wgsjPie",
  data() {
    return {};
  },
  props: {
    refresh_interVal: null,
  },
  mounted() {
    this.innit();
  },
  created() {},
  beforeDestroy() {},
  methods: {
    innit() {
      var dataArr = "80.23";
      // var title = "处理率";
      // let int = dataArr.toFixed(2).split(".")[0];
      // let float = dataArr.toFixed(2).split(".")[1];
      var colorSet = { color: "#22B95E" };
      var color1 = {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: "rgba(255,255,255,0.1)",
          },
          {
            offset: 1,
            color: "rgba(255,255,255,0.3)",
          },
        ],
        global: false,
      };
      var color2 = {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: "#30DBBA",
          },
          {
            offset: 1,
            color: "#2DE696",
          },
        ],
        global: false,
      };

      var myChart = echarts.init(document.getElementById("echart1"));
      var option = {
        // backgroundColor: "#0E1327",
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        // title: {
        //   text: "{a|" + int + "}{b|." + float + "}\n{c|" + title + "}",
        //   x: "center",
        //   y: "center",
        //             textStyle: {
        //     rich: {
        //       a: {
        //         fontSize: 20,
        //         color: "#fff",
        //         fontWeight: "500",
        //       },
        //       b: {
        //         fontSize: 14,
        //         color: "#fff",
        //         padding: [0, 0, -5, 0],
        //       },
        //       c: {
        //         fontSize: 12,
        //         color: "#fff",
        //         padding: [5, 0],
        //       },
        //     },
        //   },
        // },
        series: [
          {
            name: "内部进度条",
            type: "gauge",
            // center: ['20%', '50%'],
            radius: "65%",
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [dataArr / 100, colorSet.color],
                  [1, colorSet.color],
                ],
                width: 2,
              },
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            itemStyle: {
              color: "#ffffff",
            },
            detail: {
              show: false,
              formatter: function(value) {
                if (value !== 0) {
                  var num = Math.round(value);
                  return value.toFixed(2) + "%";
                } else {
                  return 0;
                }
              },
              offsetCenter: [0, 40],
              textStyle: {
                padding: [0, 0, 0, 0],
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
              },
            },
            title: {
              //标题
              show: false,
              offsetCenter: [0, 40], // x, y，单位px
              textStyle: {
                color: "rgba(0,0,0,0)",
                fontSize: 14, //表盘上的标题文字大小
                fontFamily: "PingFangSC",
              },
            },
            data: [
              {
                name: "",
                value: dataArr,
              },
            ],
            pointer: {
              show: true,
              length: "80%",
              radius: "30%",
              width: 3, //指针粗细
            },
            animationDuration: 4000,
          },
          {
            name: "内部阴影",
            type: "gauge",
            radius: "54%",
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [
                    dataArr / 100,
                    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 0,
                        color: "rgba(45,230,150,0)",
                      },
                      {
                        offset: 0.5,
                        color: "rgba(45,230,150,0.2)",
                      },
                      {
                        offset: 1,
                        color: "rgba(45,230,150,1)",
                      },
                    ]),
                  ],
                  [1, "rgba(28,128,245,0)"],
                ],
                width: 100,
              },
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            itemStyle: {
              show: false,
            },
          },
          {
            name: "内部小圆",
            type: "gauge",
            // center: ['20%', '50%'],
            radius: "56%",

            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [dataArr / 100, color2],
                  [1, "rgba(0,0,0,0)"],
                ],
                width: 10,
              },
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            itemStyle: {
              show: false,
            },
          },
          {
            name: "外部刻度",
            type: "gauge",
            //  center: ['20%', '50%'],
            radius: "58%",
            min: 0, //最小刻度
            max: 100, //最大刻度
            splitNumber: 5, //刻度数量
            startAngle: 225,
            endAngle: -45,
            axisLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: [[1, "rgba(0,0,0,0)"]],
              },
            }, //仪表盘轴线
            axisLabel: {
              show: true,
              color: "#ffffff",
              fontSize: 14,
              fontFamily: "SourceHanSansSC-Regular",
              fontWeight: "bold",
              // position: "top",
              distance: -30,
              formatter: function(v) {
                switch (v + "") {
                  case "0":
                    return "0";
                  case "10":
                    return "10";
                  case "20":
                    return "20";
                  case "30":
                    return "30";
                  case "40":
                    return "40";
                  case "50":
                    return "50";
                  case "60":
                    return "60";
                  case "70":
                    return "70";
                  case "80":
                    return "80";
                  case "90":
                    return "90";
                  case "100":
                    return "100";
                }
              },
            }, //刻度标签。
            axisTick: {
              show: true,
              splitNumber: 3,
              lineStyle: {
                color: color1, //用颜色渐变函数不起作用
                width: 1,
              },
              length: -6,
            }, //刻度样式
            splitLine: {
              show: true,
              length: -12,
              lineStyle: {
                color: color1, //用颜色渐变函数不起作用
              },
            }, //分隔线样式
            detail: {
              show: false,
            },
          },
          {
            name: "内部进度条",
            type: "gauge",
            // center: ['20%', '50%'],
            radius: "30%",
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [dataArr / 100, colorSet.color],
                  [1, colorSet.color],
                ],
                width: 1,
              },
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            itemStyle: {
              color: "#ffffff",
            },
            detail: {
              formatter: function(value) {
                if (value !== 0) {
                  var str = value + "";
                  if (str.indexOf(".") == -1) {
                    //字符串中是否包含某个值，
                    return value + "%";
                  } else {
                    return value.toFixed(2) + "%";
                  }
                } else {
                  return 0;
                }
              },
              offsetCenter: [0, 50],
              textStyle: {
                padding: [0, 0, 0, 0],
                fontSize: 18,
                color: "#29EEF3",
              },
            },
            title: {
              //标题
              show: true,
              offsetCenter: [0, 30], // x, y，单位px
              textStyle: {
                color: "#fff",
                fontSize: 14, //表盘上的标题文字大小
                fontWeight: 400,
                fontFamily: "MicrosoftYaHei",
              },
            },
            data: [
              {
                name: "处理率",
                value: dataArr,
                itemStyle: {
                  color: "#ffffff",
                  fontFamily: "MicrosoftYaHei",
                  fontSize: 14,
                },
              },
            ],
            pointer: {
              show: true,
              length: "80%",
              radius: "30%",
              width: 3, //指针粗细
            },
            animationDuration: 4000,
          },
          {
            //指针上的圆
            type: "pie",
            tooltip: {
              show: false,
            },
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ["0%", "6%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: 120,
                itemStyle: {
                  normal: {
                    color: "#ffffff",
                  },
                },
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.HbarAnalysis {
  width: 100%;
  height: 100%;
  position: absolute;
  left: -20%;
  .aa {
    position: absolute;
    right: -20%;
    top: 26%;
    font-size: 22px;
    font-family: Source Han Sans CN;
    font-weight: 400;
  }
}
</style>

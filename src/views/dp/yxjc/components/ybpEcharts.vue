<template>
  <div class="ybpAnalysis">
    <!-- 内容 -->
    <div :id="cId" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts5";
export default {
  name: "ybp",
  props: {
    percent: {
      require: true,
      default: 60,
    },
    cId: "",
    outBg: "",
    jbBg: [],
  },
  mounted() {
    this.ybp();
  },
  methods: {
    ybp() {
      var myChart = echarts.init(document.getElementById(this.cId));
      var option = {
        series: [
          // 外层圆环背景
          {
            name: "",
            type: "pie",
            radius: ["70%", "90%"],
            avoidLabelOverlap: false,
            startAngle: 225,
            color: [this.outBg, "none"], // 背景底色
            hoverAnimation: false, // 是否开启 hover 在扇区上的放大动画效果。
            legendHoverLink: false, // 是否启用图例 hover 时的联动高亮。
            label: {
              normal: {
                show: false,
                position: "center",
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold",
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: 75,
                name: "1",
                itemStyle: {
                  borderWidth: 2, // 边框
                  borderColor: "rgb(5,118,164)",
                  // color: 'rgb(32,46,92)'
                },
              },
              {
                value: 25,
                name: "2",
              },
            ],
          },
          // 内层圆环
          {
            name: " ",
            type: "pie",
            radius: ["55%", "54%"],
            avoidLabelOverlap: false, // 是否启用防止标签重叠策略
            startAngle: 225,
            hoverAnimation: false,
            legendHoverLink: false,
            label: {
              normal: {
                show: false,
                position: "center",
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold",
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: 75,
                name: "1",
                itemStyle: {
                  borderWidth: 0,
                  color: "rgba(1, 168, 233, 1)",
                },
              },
              {
                value: 25,
                name: "2",
              },
            ],
          },
          // 外层数据圆环
          {
            name: "",
            type: "pie",
            radius: ["70%", "90%"],
            avoidLabelOverlap: false,
            startAngle: 315,
            color: ["transparent", "red", "transparent"],
            hoverAnimation: false,
            legendHoverLink: false,
            clockwise: false, // 饼图的扇区是否是顺时针排布。
            itemStyle: {
              normal: {
                borderColor: "transparent",
                borderWidth: "20",
              },
              emphasis: {
                borderColor: "transparent",
                borderWidth: "20",
              },
            },
            z: 10,
            label: {
              normal: {
                show: false,
                position: "center",
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                // 无占比
                value: 100 - this.percent,
                label: {
                  normal: {
                    formatter: this.percent + "%",
                    position: "center",
                    show: true,
                    textStyle: {
                      fontSize: "30",
                      fontWeight: "normal",
                      color: "#fff",
                    },
                  },
                },
                name: "",
              },
              {
                // 占比圆环高亮
                value: 1,
                name: "",
                itemStyle: {
                  color: "rgb(1,223,243)",
                },
              },
              {
                // 占比
                value: this.percent,
                name: "",
                itemStyle: {
                  color: {
                    // 外层圆环底色
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0.75, // 设置成1下面也会显示
                        color: this.jbBg[0], // 0% 处的颜色
                      },
                      {
                        offset: 0,
                        color: this.jbBg[1], // 100% 处的颜色
                      },
                    ],
                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              {
                // 底部固定占比
                value: 33.5,
                name: "",
                itemStyle: {
                  color: "rgba(0,0,0,0)",
                },
              },
            ],
          },
          // 内部实心圆
          {
            type: "pie",
            radius: "43%",
            center: ["50%", "50%"],
            z: 1,
            itemStyle: {
              normal: {
                color: 'rgba(4, 38, 84, 0.3)',
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            label: {
              show: false,
            },
            tooltip: {
              show: false,
            },
            data: [100],
          },
        ],
      };

      myChart.setOption(option);
    },
  },

  watch:{
    percent:{
      handler: function(){
        this.ybp()
      }
    },
  }
};
</script>

<style scoped>
.ybpAnalysis {
  width: 100%;
  height: 100%;
}
/* #ybp {
  width: 100%;
  height: 100%;
} */
</style>


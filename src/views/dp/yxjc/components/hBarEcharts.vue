<template>
  <div class="HbarAnalysis">
    <!-- 内容 -->
    <div :id="cId" style="width:100%;height:100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts5";
export default {
  name: "Hbar",
  props: {
    yLabel: {
      type: Array,
      require: true,
      default: [
        "10月3日",
        "10月4日",
        "10月5日",
        "10月6日",
        "10月7日",
        "10月8日",
        "10月9日",
      ],
    },
    yData: {
      type: Array,
      require: true,
      default: [23, 75, 70, 65, 67, 65, 80],
    },
    cId:''
  },
  mounted() {
    this.hbar();
  },
  methods: {
    hbar() {
      var bgData = [];
      for (let i in this.yData) {
        bgData.push(100);
      }
      var myChart = echarts.init(document.getElementById(this.cId));
      var option = {
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          top: "0%",
          containLabel: true,
        },
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //         type: 'none',
        //     },
        //     formatter: function (params) {
        //         return (
        //             params[0].name +
        //             '<br/>' +
        //             "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
        //             params[0].seriesName +
        //             ' : ' +
        //             params[0].value +
        //             ' <br/>'
        //         );
        //     },
        // },
        xAxis: {
          show: false,
          type: "value",
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisLabel: {
              show: true,
              margin: 15,
              textStyle: {
                color: "#fff",
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: this.yLabel,
          },
          {
            type: "category",
            inverse: true,
            axisTick: "none",
            axisLine: "none",
            show: true,
            axisLabel: {
              textStyle: {
                color: "#fff",
                fontSize: "14",
              },
            },
            data: this.yData.map((item) => {
              return item.value + "%";
            }),
          },
        ],
        series: [
          {
            // name: "数量",
            type: "pictorialBar",
            // zlevel: 1,
            // itemStyle: {
            //   normal: {
            //     barBorderRadius: 5,
            //     color: {
            //       type: "linear",
            //       x: 0,
            //       y: 0,
            //       x2: 1,
            //       y2: 0,
            //       colorStops: [
            //         {
            //           offset: 0,
            //           color: "rgba(32, 75, 255, 0.07)", //  0%  处的颜色
            //         },
            //         {
            //           offset: 0.7,
            //           color: "rgba(83, 203, 255, 0.92)", //  100%  处的颜色
            //         },
            //         {
            //           offset: 1,
            //           color: "#56ACFF", //  100%  处的颜色
            //         },
            //       ],
            //       global: false, //  缺省为  false
            //     },
            //     shadowBlur: 0,
            //     shadowColor: "rgba(87,220,222,0.7)",
            //   },
            // },
            barWidth: 12,
            data: this.yData,
          },
          {
            name: "背景",
            type: "bar",
            barWidth: 12,
            barGap: "-100%",
            data: bgData,
            itemStyle: {
              normal: {
                color: "rgba(0,0,0,0)",
                barBorderRadius: 5,
                barBorderColor: "rgba(19, 225, 227, 1)", // 边框色
              },
            },
          },
        ],
      };

      myChart.setOption(option);
    },
  },

  watch:{
    yData:{
      handler: function(){
        this.hbar()
      }
    },
     yLabel:{
      handler: function(){
        this.hbar()
      }
    }
  }
};
</script>

<style scoped>
.HbarAnalysis {
  width: 100%;
  height: 100%;
}
/* #hbar {
  width: 100%;
  height: 100%;
} */
</style>


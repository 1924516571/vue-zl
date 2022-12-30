<template>
  <div class="HbarAnalysis">
    <div id="echart" style="width:100%;height:100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts5";
export default {
  name: "Hbar",
  data() {
    return {
      timer: null, //定义一个刷新的timer
      gcjsData: [
        {
          code: "workorder_handleReason_warn_011",
          name: "人员履职类",
          num: "2831",
          totalnum: "11156",
          percent: "27.03",
          lb: "1",
        },
        {
          code: "workorder_handleReason_warn_009",
          name: "高处作业",
          num: "1999",
          totalnum: "11156",
          percent: "14.19",
          lb: "1",
        },
        {
          code: "workorder_handleReason_warn_010",
          name: "安全管理类",
          num: "1304",
          totalnum: "11156",
          percent: "9.46",
          lb: "1",
        },
        {
          code: "workorder_handleReason_warn_008",
          name: "其他类",
          num: "1161",
          totalnum: "11156",
          percent: "8.78",
          lb: "1",
        },
        {
          code: "workorder_handleReason_warn_005",
          name: "文明施工",
          num: "1147",
          totalnum: "11156",
          percent: "8.11",
          lb: "1",
        },
        {
          code: "workorder_handleReason_warn_006",
          name: "施工用电",
          num: "1004",
          totalnum: "11156",
          percent: "6.08",
          lb: "1",
        },
        {
          code: "workorder_handleReason_warn_017",
          name: "行为类",
          num: "714",
          totalnum: "11156",
          percent: "5.98",
          lb: "1",
        },
        {
          code: "workorder_handleReason_warn_004",
          name: "高处作业吊篮",
          num: "620",
          totalnum: "11156",
          percent: "5.24",
          lb: "1",
        },
        {
          code: "workorder_handleReason_warn_016",
          name: "扣件式钢管脚手架",
          num: "119",
          totalnum: "11156",
          percent: "4.05",
          lb: "1",
        },
        {
          code: "workorder_handleReason_warn_002",
          name: "模板支架",
          num: "106",
          totalnum: "11156",
          percent: "3.38",
          lb: "1",
        },
      ],
      bjyyList: [],
      bjyyData: [],
      txIcon: require("@/assets/dp/OperateMonitoreRq/hBarBg.png"),
    };
  },
  props: {
    yLabel: Array,
    yData: Array,
    refresh_interVal: null, //接收父组件的刷新间隔值
  },
  mounted() {
       this.getTest();
    // this.getWgsj();
    this.hbar();
 
  },
  created() {
    this.refresh();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    refresh() {
      this.timer = setInterval(() => {
        // this.getWgsj();
        this.getRandom();
        this.hbar();
      }, this.refresh_interVal);
    },
    getTest() {
      this.gcjsData.forEach((item) => {
        this.bjyyList.push(item.name);
      });
    },
    // getWgsj() {

    // },
    hbar() {
      var myChart = echarts.init(document.getElementById("echart"));
      var option = {
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          top: "0%",
          containLabel: true,
        },
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
              // margin: 25,
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
            data: this.bjyyList,
          },
          {
            type: "category",
            inverse: true,
            axisTick: "none",
            axisLine: "none",
            show: true,
            axisLabel: {
              textStyle: {
                color: "#FFF",
                fontSize: "15",
                fontFamily: "Bebas",
                fontWeight: 400,
              },
            },
            data: this.bjyyData.map((item) => {
              return item.value + "%";
            }),
          },
        ],
        // dataZoom: [
        //   {
        //     type: "inside",
        //     startValue: 0,
        //     endValue: 2,
        //     minValueSpan: 2,
        //     maxValueSpan: 2,
        //     yAxisIndex: [0],
        //     zoomOnMouseWheel: false, // 关闭滚轮缩放
        //     moveOnMouseWheel: true, // 开启滚轮平移
        //     moveOnMouseMove: true, // 鼠标移动能触发数据窗口平移
        //   },
        //   {
        //     type: "slider",
        //     realtime: true,
        //     startValue: 0,
        //     endValue: 2,
        //     width: "3.5",
        //     height: "30%",
        //     yAxisIndex: [0], // 控制y轴滚动
        //     fillerColor: "rgba(154, 181, 215, 1)", // 滚动条颜色
        //     borderColor: "rgba(17, 100, 210, 0.12)",
        //     backgroundColor: "#cfcfcf", //两边未选中的滑动条区域的颜色
        //     handleSize: 0, // 两边手柄尺寸
        //     showDataShadow: false, //是否显示数据阴影 默认auto
        //     showDetail: false, // 拖拽时是否展示滚动条两侧的文字
        //     top: "1%",
        //     right: "5",
        //   },
        // ],
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
            data: this.bjyyData,
            animationEasing: "elasticOut",
          },
          // {
          //   name: "背景",
          //   type: "bar",
          //   barWidth: 12,
          //   barGap: "-100%",
          //   data: bgData,
          //   itemStyle: {
          //     normal: {
          //       color: "rgba(0,0,0,0)",
          //       barBorderRadius: 5,
          //       barBorderColor: "rgba(19, 225, 227, 1)", // 边框色
          //     },
          //   },
          // },
        ],
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: "linear",
        animationEasingUpdate: "linear",
      };
      myChart.clear();
      myChart.setOption(option);
      // function run() {
      //   console.log(this.yData, "345234324");
      //   for (var i = 0; i < this.yData.length; ++i) {
      //     if (Math.random() > 0.9) {
      //       this.yData[i] += Math.round(Math.random() * 2000);
      //     } else {
      //       this.yData[i] += Math.round(Math.random() * 200);
      //     }
      //   }
      //   myChart.setOption(option);
      // }
      // setTimeout(function() {
      //   run();
      // }, 0);
      // var myVar = setInterval(function() {
      //   run();
      // }, 3000);
      // clearInterval(myVar);
    },

    // 随机数
    getRandom() {
      this.bjyyData = [];
      for (let i = 0; i < 10; i++) {
        this.bjyyData.push({
          value: (Math.random() * 70).toFixed(2),
          symbol: "image://" + this.txIcon,
        });
      }
    },
  },

  // watch: {
  //   yData: {
  //     handler: function() {
  //       console.log("4543543");
  //       this.hbar();
  //     },
  //   },
  //   yLabel: {
  //     handler: function() {
  //       this.hbar();
  //     },
  //   },
  // },
};
</script>

<style scoped>
.HbarAnalysis {
  width: 100%;
  height: 100%;
  padding-top: 20px;
}
</style>

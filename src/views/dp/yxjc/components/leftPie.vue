<template>
  <div class="main">
    <div id="pie" ref="chart" style="width:150px; height:150px;"></div>
    <div class="tx">
      <div><span class="txChild txChild1"></span><span class="num">计划数</span></div>
      <div><span class="txChild txChild2"></span><span class="num">巡查数</span></div>
      <div><span class="txChild txChild3"></span><span class="num">问题数</span></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import * as echarts from "echarts5";
@Component({
  components: {},
})
export default class LeftPie extends Vue {
  //  @Props()
  placeHolderStyle: any = {
    normal: {
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
    },
  };

  mounted() {
    // this.chartthreenD();
    this.chartthreenD1();
  }
  // chartthreenD() {
  //   var total = 50;
  //   var myChart = echarts.init(document.getElementById("pie") as any);

  //   var option = {
  //     // title: {
  //     //   // text: "室内温度", //主标题
  //     //   // subtext: "26℃", //副标题
  //     //   textStyle: {
  //     //     //主标题样式
  //     //     color: "#fff",
  //     //     fontWeight: "bold",
  //     //     fontSize: 12,
  //     //   },
  //     //   subtextStyle: {
  //     //     //副标题样式
  //     //     color: "#fff",
  //     //     fontSize: 20,
  //     //     fontWeight: "bold",
  //     //     // color: "#0f0",
  //     //   },
  //     //   left: "center",
  //     //   top: "middle",
  //     // },
  //     // backgroundColor: "#0b214a",
  //     tooltip: {
  //       show: true,
  //       trigger: "item", //提示框触发类型，item数据项图形触发，主要应用于无类目轴的图表（散点图、饼形图等）
  //       formatter: function(params: any, ticket: any, callback: any) {
  //         //第一个参数数据集、第二个参数是异步回调标志、第三个参数是异步回调
  //         return params.seriesName + ": " + params.value; //系列名称：数据值
  //       },
  //     },
  //     color: ["#80E6FF", "#FFBA69", "#F27575"], //调色盘颜色列表，默认情况下图例和饼形环图颜色使用
  //     legend: {
  //       show: true, //是否显示
  //        icon: 'circle',
  //       itemHeight: 8, //图例的高度
  //       itemGap: 5, //图例之间的间距
  //       itemWidth: 5, //图例的宽度
  //       width: "auto", // 图例组件的宽度
  //       height: "auto", // 图例组件的高度
  //       align: "auto", // 图例标记和文本的对齐
  //       selectedMode: true, //图例选择模式 （图表对展示对应的项）
  //       orient: "horizontal", //图例布局方式  horizontal  水平 vertical  垂直
  //       bottom: "5%",
  //       left: "20%",
  //       data: ["计划数", "巡查数", "问题数"], //图例的数据数组
  //       label: {
  //         normal: {
  //           show: true,
  //           color: ["#80E6FF", "#FFBA69", "#F27575"],
  //         },
  //       },
  //       textStyle: {
  //         color: "#fff",
  //         fontSize: 12, // 文字的字体大小。
  //       },
  //     },
  //     series: [
  //       {
  //         name: "计划数",
  //         type: "pie",
  //         clockWise: false, //顺时加载
  //         hoverAnimation: false, //鼠标移入变大
  //         radius: [50, 60],
  //         //  radius: [65 - i * 10 + '%', 60 - i * 10 + '%'],
  //         // center: ["50%", "30%"],
  //         itemStyle: this.placeHolderStyle,
  //         label: {
  //             show: false,
  //         },
  //         data: [
  //           {
  //             value: 200,
  //             itemStyle: {
  //               normal: {
  //                 color: "#80E6FF",
  //                 // color: "rgba(0,0,0,0)",
  //               },
  //             },
  //           },
  //           // {
  //           //   value: total - 28,
  //           //   itemStyle: {
  //           //     normal: {
  //           //       color: "transparent",
  //           //        opacity: 0.2,
  //           //       // color: "rgba(0,0,0,0)",
  //           //     },
  //           //   },
  //           // },
  //         ],
  //       },
  //       {
  //         name: "巡查数",
  //         type: "pie",
  //         clockWise: false, //顺时加载
  //         hoverAnimation: false, //鼠标移入变大
  //         radius: [30, 40],
  //         // center: ["50%", "30%"],
  //         itemStyle: this.placeHolderStyle,
  //         data: [
  //           {
  //             value: 18,
  //             itemStyle: {
  //               normal: {
  //                 color: "#FFBA69 ",
  //               },
  //             },
  //           },
  //           {
  //             value: total - 26,
  //             itemStyle: {
  //               normal: {
  //                 // color: "transparent",
  //                 color: "rgba(0,0,0,0)",
  //               },
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         name: "问题数",
  //         type: "pie",
  //         clockWise: false, //顺时加载
  //         hoverAnimation: false, //鼠标移入变大
  //         radius: [10, 20],
  //         // center: ["50%", "30%"],
  //         itemStyle: this.placeHolderStyle,
  //         data: [
  //           {
  //             value: 26,
  //             itemStyle: {
  //               normal: {
  //                 color: "#F27575",
  //               },
  //             },
  //           },
  //           {
  //             value: total - 26,
  //             itemStyle: {
  //               normal: {
  //                 // color: "transparent",
  //                 color: "rgba(0,0,0,0)",
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //   };
  //   myChart.setOption(option);
  // }

  chartthreenD1() {
    let color = ["#80E6FF", "#FFBA69", "#F27575"];
    let legendData = ["计划数", "巡查数", "问题数"];
    let pieData = [354, 309, 58];
    let sum = Math.max(...pieData) * 1.3;
    let pieSeries: any = [];
    pieData.forEach((v, i) => {
      pieSeries.push({
        type: "pie",
        clockWise: false,
        hoverAnimation: false,
        radius: [65 - i * 10 + "%", 60 - i * 10 + "%"],
        // center: ["50%", "50%"],
        label: {
          show: false,
        },
        data: [
          // 值
          {
            value: pieData[i],
            name: legendData[i],
          },
          // 阴影
          {
            // value: 270 - (v / 130) * 270,
            value: sum - 100,
            name: legendData[i],
            itemStyle: {
              opacity: 0.2,
              // color: "#FFFFFF",
            },
          },
          // 空白
          {
            value: 270,
            name: legendData[i],
            itemStyle: {
              opacity: 0,
            },
          },
        ],
      });
    });
    var myChart: any = echarts.init(document.getElementById("pie") as any);
    let option: any = {
      // backgroundColor: "#013A54",
      color: color,
      tooltip: {
        show: true,
        trigger: "item",
        // borderWidth:0,
        borderColor: "#fff",
        formatter: function(params: any, ticket: any, callback: any) {
          return params.name + ": " + params.value; //系列名称：数据值
        },
      },
      grid: {
        top: "0%",
        bottom: "4%",
        left: "0%",
        containLabel: true,
      },
      legend: {
        show: true,
        icon: "circle",
        top: "8%",
        left: "50%",
        data: legendData,
        width: 30,
        height: 20,
        // padding: [0, 18],
        itemHeight: 5, //图例的高度
        itemGap: 0, //图例之间的间距
        itemWidth: 3, //图例的宽度
        formatter: function(name: any) {
          const inx = legendData.indexOf(name);
          // return "{title|" + name + " }  {value|" + pieData[inx] + "}";
          return "{value|" + pieData[inx] + "}";
        },
        textStyle: {
          rich: {
            title: {
              fontSize: 12,
              // lineHeight: 30,
              color: "green",
            },
            value: {
              // fontSize: 15,
              fontSize: 12,
              // lineHeight: 20,
              color: "#fff",
            },
          },
        },
      },
      series: pieSeries,
    };
    myChart.setOption(option);
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  position: absolute;
  // left: -40%;
  // top: -57%;
  top: -23%;
  left: -7%;
  .tx {
    width: 170px;
    height: 50px;
    display: flex;
    justify-content: space-around;
    left: 10%;
    .txChild {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      display: inline-block;
    }
    .num {
      margin-left: 2px;
    }
    .txChild1 {
      background: #80e6ff;
      vertical-align: text-top;
    }
    .txChild2 {
      background: #ffba69;
      vertical-align: text-top;
    }
    .txChild3 {
      background: #f27575;
      vertical-align: text-top;
    }
  }
}
</style>

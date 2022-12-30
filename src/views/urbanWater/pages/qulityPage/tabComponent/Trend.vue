<template>
  <!-- 水质趋势 -->
  <div class="table-chart-view">
    <div>
      <div class="flex-class">
        <div class="flex-class nav-item">
          <div :class="{ 'active-nav': navIndex == index }" v-for="(item, index) in navs" :key="index" @click="getNav(index)">
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="flex-class">
        <div>
          <template>
            <el-date-picker v-model="date" type="daterange" range-separator="-" style="width: 320px; margin-right: 10px" size="small" format="yyyy-MM-dd" @change="getDate"></el-date-picker>
          </template>
        </div>
        <!-- <div>
          <search-component></search-component>
        </div>-->
        <!-- <div>
          <suc-button
            type="primary"
            :config="{
              ghost: true
            }"
            :debounce="800"
            style="margin-left:10px;"
            >重置
          </suc-button>
        </div>-->
      </div>
    </div>
    <div class="trend-item">
      <div v-if="navIndex == 0">
        <v-chart :options="lineOptions" :auto-resize="true" style="width: 100%; height: 100%"></v-chart>
      </div>
      <div v-if="navIndex == 1">
        <table-component :columns="columns" :tableData="tableData">
          <template v-slot:level="{ row, index }">
            <v-chart :options="row.levelOption[index]" :auto-resize="true" style="width: 100%; height: 100%"></v-chart>
          </template>
        </table-component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import { SucDatePicker, SucButton } from "@suc/ui";
import { DatePicker } from "element-ui";
import { DatePickerOptions } from "@suc/ui/interfaces";
// import  SearchComponent  from './SearchComponent.vue'
import { TablePage, SearchComponent, TableComponent } from "@/components";
import { riverApi } from "@/api";
import dayjs from "dayjs";
@Component({
  components: {
    SucDatePicker,
    SucButton,
    SearchComponent,
    TablePage,
    TableComponent,
    ElDatePicker: DatePicker,
  },
})
export default class Trend extends Vue {
  @State waterQulity: any;
  color: any[] = ["#5f77ec", "#5397ff", "#58dde0", "#feb543"];
  lineOptions: any = {
    color: this.color,
    tooltip: {
      trigger: "axis",
      formatter(params: any) {
        return params[0].seriesName + "<br>" + params[0].marker + params[0].name + "：" + params[0].value + "<br>";
      },
    },
    grid: {
      top: "16%",
      right: "5%",
      left: "3%",
      bottom: "15%",
      containLable: true,
    },
    // legend: {
    //   x: 'right',
    //   icon: 'circle',
    //   itemWidth: 10,
    //   itemHeight: 10,
    //   data: ['监控数量', '预警数量']
    // },

    xAxis: {
      type: "category",
      boundaryGap: false,
      inverse: true,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        // rotate: -30,
        color: "#666",
      },
      splitLine: {
        show: false,
      },
      data: [],
    },
    yAxis: {
      nameTextStyle: {
        color: "#999",
      },
      type: "category",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "#999",
        },
      },
      data: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
    },
    series: [
      {
        name: "水质",
        type: "line",
        symbolSize: 1,
        lineStyle: {
          color: "#5397ff",
        },
        data: [],
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#5397ff", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(83,151,255,0.2)", // 100% 处的颜色
              },
            ],
          },
        },
        markLine: {
          silent: true,
          symbol: "none",
          label: {
            show: false,
          },
          data: [
            {
              name: "Ⅰ",
              yAxis: "Ⅰ",
              lineStyle: {
                color: "#32bb53",
              },
            },
            {
              name: "Ⅱ",
              yAxis: "Ⅱ",
              lineStyle: {
                color: "#32bb53",
              },
            },
            {
              name: "Ⅲ",
              yAxis: "Ⅲ",
              lineStyle: {
                color: "#32bb53",
              },
            },
            {
              name: "Ⅳ",
              yAxis: "Ⅳ",
              lineStyle: {
                color: "#ffab3d",
              },
            },
            {
              name: "Ⅴ",
              yAxis: "Ⅴ",
              lineStyle: {
                color: "#ff5a47",
              },
            },
            {
              name: "劣Ⅴ",
              yAxis: "劣Ⅴ",
              lineStyle: {
                color: "#ce1717",
              },
            },
          ],
        },
      },
    ],
  };

  columns: any[] = [
    {
      title: "序号",
      type: "index",
    },
    {
      title: "开始时间",
      key: "createtime",
    },
    {
      title: "结束时间",
      key: "lastmodifytime",
    },
    {
      title: "水质",
      key: "riverquality",
    },
    // {
    //   title: 'Ⅰ类',
    //   key: 'I'
    // },
    // {
    //   title: 'Ⅱ类',
    //   key: 'Ⅱ'
    // },
    // {
    //   title: 'Ⅲ类',
    //   key: 'Ⅲ'
    // },
    // {
    //   title: 'Ⅳ类',
    //   key: 'Ⅳ'
    // },
    // {
    //   title: 'Ⅴ类',
    //   key: 'Ⅴ',
    // }
  ];
  wsColumn: any = [
    {
      title: "序号",
      type: "index",
    },
    {
      title: "tm",
      key: "日期",
    },
    {
      title: "进水水质",
      key: "jssz",
    },
    {
      title: "出水水质",
      key: "cssz",
    },
  ];
  tableData: any[] = [];
  date: any = [];
  options: DatePickerOptions = {
    type: "datetimerange",
  };
  navIndex: number = 0;
  navs: any[] = [
    {
      label: "分析统计",
    },
    {
      label: "列表详情",
    },
  ];
  getNav(index: number) {
    this.navIndex = index;
    if (index == 1) {
      this.getTable();
    } else {
      this.getQulity();
    }
  }
  getDate(date: any) {
    let st = this.$utils.dateFormat(date[0], "yyyy-MM");
    let et = this.$utils.dateFormat(date[1], "yyyy-MM");
    this.qulityParams.start = st;
    this.qulityParams.end = et;
    this.getQulity();
    if (this.navIndex == 1) {
      this.getTable();
    }
  }
  pageParams: any = {
    current: 1,
    total: 0,
    pageSize: 10,
  };
  qulityParams: any = {
    start: "",
    end: "",
    sectionId: "",
  };
  mounted() {
    this.init();
  }
  init() {
    let st = dayjs()
      .subtract(1, "year")
      .format("YYYY-MM-DD");
    let et = dayjs().format("YYYY-MM-DD");
    this.date = [st, et];
    this.qulityParams.start = dayjs()
      .subtract(1, "year")
      .format("YYYY-MM");
    this.qulityParams.end = dayjs().format("YYYY-MM");
    this.getQulity();
  }
  async getQulity() {
    this.lineOptions.xAxis.data = [];
    this.lineOptions.series[0].data = [];
    let url = "wjServer/waterENVIR/section/wqList";
    this.qulityParams.sectionId = this.waterQulity.qulity.sectionId;
    let { data } = await riverApi.getWaterQulity(this.qulityParams, url);
    data.reverse();
    this.tableData = data.map((e: any) => {
      return {
        createtime: e.createtime,
        lastmodifytime: e.lastmodifytime,
        riverquality: e.riverquality,
      };
    });
    this.lineOptions.xAxis.data = data.map((e: any) => e.datatime);
    this.lineOptions.series[0].data = data.map((e: any) => e.riverquality);  //水质现状
    // this.lineOptions.series[0].data = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ", "Ⅰ", "Ⅱ", "Ⅲ"];
    // } else {
    //   this.lineOptions.tooltip = {
    //     trigger: "axis",
    //     formatter(params: any) {
    //       return (
    //         params[0].seriesName +
    //         "<br>" +
    //         params[0].marker +
    //         params[0].name +
    //         "：" +
    //         params[0].value +
    //         "<br>" +
    //         params[1].seriesName +
    //         "<br>" +
    //         params[1].marker +
    //         params[1].name +
    //         "：" +
    //         params[1].value +
    //         "<br>"
    //       );
    //     },
    //   };
    //   let newItem = {
    //     name: "出水水质",
    //     type: "line",
    //     symbolSize: 1,
    //     lineStyle: {
    //       color: "#7287EE",
    //     },
    //     data: [],
    //     areaStyle: {
    //       color: {
    //         type: "linear",
    //         x: 0,
    //         y: 0,
    //         x2: 0,
    //         y2: 1,
    //         colorStops: [
    //           {
    //             offset: 0,
    //             color: "#7287EE", // 0% 处的颜色
    //           },
    //           {
    //             offset: 1,
    //             color: "rgba(83,151,255,0.2)", // 100% 处的颜色
    //           },
    //         ],
    //       },
    //     },
    //   };
    //   this.lineOptions.series[0].name = "进水水质";
    //   this.lineOptions.series.push(newItem);
    //   data.list.forEach((ele: any) => {
    //     this.lineOptions.xAxis.data.push(ele.tm);
    //     this.lineOptions.series[0].data.push(ele.jssz);
    //     this.lineOptions.series[1].data.push(ele.cssz);
    //   });
    //   this.columns = this.wsColumn;
    //   this.tableData = data.list;
    // }
  }
  async getTable() {
    this.tableData = [];
    this.getQulity();
    // let url = "";
    // if (this.waterQulity.qulity.originPage == "zd") {
    //   url = "hjzl/real/waterQualityData";
    //   this.qulityParams.sbid = this.waterQulity.qulity.sbid;
    // } else if (this.waterQulity.qulity.originPage == "sd") {
    //   url = "hjzl/real/aificialWaterQualityData";
    //   this.qulityParams.zdid = this.waterQulity.qulity.siteId;
    // }
    // let data = await riverApi.getWaterQulity(this.qulityParams, url);
    // this.tableData = data.map((e: any) => {
    //   return {
    //     startTime: e.startTime,
    //     endTime: e.endTime,
    //     level: e.level,
    //   };
    // });
  }
  getSize(size: number) {
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
  }
  getPage(page: number) {
    this.pageParams.current = page;
  }
}
</script>
<style lang="scss" scoped>
.table-chart-view {
  width: 100%;
  height: 100%;
  min-height: 200px;
  padding: 0 10px;
  font-size: 14px;
  .flex-class {
    display: flex;
    align-items: center;
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-item {
    border-radius: 4px;
    border: solid 1px #3a7bef;
    color: #3a7bef;
    cursor: pointer;
    > div {
      padding: 5px 10px;
    }
  }
  .active-nav {
    background-color: #3a7bef;
    color: #fff;
  }
  .trend-item {
    height: calc(100% - 43px);
    padding: 10px 0 0;
    > div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

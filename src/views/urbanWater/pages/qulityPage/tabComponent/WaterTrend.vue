<template>
  <!-- 水质趋势 -->
  <div class="table-chart-view">
    <div>
      <div class="flex-class">
        <div class="flex-class nav-item">
          <div
            :class="{ 'active-nav': navIndex == index }"
            v-for="(item, index) in navs"
            :key="index"
            @click="getNav(index)"
          >
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="flex-class">
        <div>
          <template>
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="-"
              style="width: 320px; margin-right: 10px"
              size="small"
              format="yyyy-MM-dd HH:mm:ss"
              @change="getDate"
            ></el-date-picker>
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
        <v-chart
          :options="lineOptions"
          :auto-resize="true"
          style="width: 100%; height: 100%"
        ></v-chart>
      </div>
      <div v-if="navIndex == 1">
        <table-component :columns="columns" :tableData="tableData">
          <template v-slot:level="{ row, index }">
            <v-chart
              :options="row.levelOption[index]"
              :auto-resize="true"
              style="width: 100%; height: 100%"
            ></v-chart>
          </template>
        </table-component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Emit,
  Model,
  Watch,
} from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import { SucDatePicker, SucButton } from "@suc/ui";
import { DatePicker} from "element-ui"
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
    ElDatePicker: DatePicker
  },
})
export default class WaterTrend extends Vue {
  @State waterQulity: any;
  color: any[] = ["#5f77ec", "#5397ff", "#58dde0", "#feb543"];
  lineOptions: any = {
    animation: false,
    color: this.color,
    tooltip: {
      trigger: "axis",
      formatter(params: any) {
        let fm = ''
        params.forEach((item: any) => {
          fm += item.seriesName +
          "<br>" +
          item.marker +
          item.name +
          "：" +
          item.value +
          "<br>"
        });
        return (fm);
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
      // type: "category",
      name: "单位：m³/d",
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
    },
    series: [
      {
        name: "进水量",
        type: "line",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          color: "#5f77ec",
        },
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
                color: "#5f77ec", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(83,151,255,0.2)", // 100% 处的颜色
              },
            ],
          },
        },
        data: [],
      },
      {
        name: "出水量",
        type: "line",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          color: "#5397ff",
        },
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
                color: "rgba(51,150,251,0.18)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(51,150,251,0)", // 100% 处的颜色
              },
            ],
          },
        },
        data: [],
      },
    ],
  };


  optionSerise: any =  [
      {
        name: "处理水量(m³/d)",
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
      },
      {
        name: "处理后河内水量(m³/d)",
        type: "line",
        symbolSize: 1,
        lineStyle: {
          color: "#5f77ec",
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
                color: "#5f77ec", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(83,151,255,0.2)", // 100% 处的颜色
              },
            ],
          },
        },
      },
      {
        name: "处理后外河水量(m³/d)",
        type: "line",
        symbolSize: 1,
        lineStyle: {
          color: "#58dde0",
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
                color: "#58dde0", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(83,151,255,0.2)", // 100% 处的颜色
              },
            ],
          },
        },
      },
      {
        name: "排入(市政)污水管道水量(m³/d)",
        type: "line",
        symbolSize: 1,
        lineStyle: {
          color: "#feb543",
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
                color: "#feb543", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(83,151,255,0.2)", // 100% 处的颜色
              },
            ],
          },
        },
      },
    ];

  columns: any[] = [
    {
      title: "序号",
      type: "index",
    },
    {
      title: "日期",
      key: "tm",
    },
    {
      title: "进水水量(m³/d)",
      key: "jsl",
    },
    {
      title: "出水水量(m³/d)",
      key: "csl",
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
  yjColumn: any[] = [
    {
      title: "序号",
      type: "index",
    },
    {
      title: "日期",
      key: "tm",
    },
    {
      title: "出水量",
      key: "clsl",
    },
    {
      title: "排入内河水量",
      key: "clhhnsl",
    },
    {
      title: "排入外河水量",
      key: 'clhwhsl'
    },
    {
      title: "排入污水管水量",
      key: 'prwsgdsl'
    },
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
    // if (index == 1) {
      // this.getTable();
    // } else {
      this.getQulity();
    // }
  }
  getDate(date: any) {
    let st = this.$utils.dateFormat(date[0], "yyyy-MM-dd HH:mm:ss");
    let et = this.$utils.dateFormat(date[1], "yyyy-MM-dd HH:mm:ss");
    this.qulityParams.begin = st;
    this.qulityParams.end = et;
    this.getQulity();
    // if (this.navIndex == 1) {
    //   this.getTable();
    // }
  }

  pageParams: any = {
    current: 1,
    total: 0,
    pageSize: 10,
  };
  qulityParams: any = {
    stm: "",
    etm: "",
    bid: "",
    lx: "1",
  };
  mounted() {
    // this.getQulity()
    this.init();
  }
  init() {
    let st;
    if (this.waterQulity.qulity.originPage == "sd") {
      st = dayjs().subtract(6, "month").format("YYYY-MM-DD HH:mm:ss");
    } else {
      st = dayjs().subtract(31, "day").format("YYYY-MM-DD HH:mm:ss");
    }
    let et = dayjs().format("YYYY-MM-DD HH:mm:ss");
    this.qulityParams.stm = st;
    this.qulityParams.etm = et;
    this.date = [st, et];
    this.getQulity();
  }
  async getQulity() {
    this.lineOptions.xAxis.data = [];
    this.lineOptions.series[0].data = [];
    let url = "";
    if (this.waterQulity.qulity.originPage == "wscl") {
      url = "jnsw/wsclc/sztbHis";
      this.qulityParams.bid = this.waterQulity.qulity.bid;
    } else if (this.waterQulity.qulity.originPage == "yjzz") {
      url = "jnsw/yjclzz/sztbHis";
      this.qulityParams.bid = this.waterQulity.qulity.bid;
    }
    let data = await riverApi.getWaterQulity(this.qulityParams, url);
    if (this.waterQulity.qulity.originPage == "wscl") {
      this.lineOptions.xAxis.data = data.list.map((e: any) => e.tm);
      this.lineOptions.series[0].data = data.list.map((e: any) => e.jsl);
      this.lineOptions.series[1].data = data.list.map((e: any) => e.csl);
    }
    else {
      this.columns = this.yjColumn;
      data.list.forEach((ele: any) => {
        this.lineOptions.xAxis.data.push(ele.tm);
        this.optionSerise[0].data.push(ele.clsl);
        this.optionSerise[1].data.push(ele.clhhnsl);
        this.optionSerise[2].data.push(ele.clhwhsl);
        this.optionSerise[3].data.push(ele.prwsgdsl);
      });
      this.lineOptions.series = this.optionSerise;
    }
    this.tableData = data.list;
  }
  // async getTable() {
  //   this.tableData = [];
  //   let url = '';
  //   if (this.waterQulity.qulity.originPage == 'zd') {
  //     url = "hjzl/real/waterQualityData";
  //     this.qulityParams.sbid = this.waterQulity.qulity.sbid;
  //   } else if (this.waterQulity.qulity.originPage == 'sd') {
  //     url = "hjzl/real/aificialWaterQualityData";
  //     this.qulityParams.zdid = this.waterQulity.qulity.siteId;
  //   }
  //   let data = await riverApi.getWaterQulity(this.qulityParams, url);
  //   this.tableData = data.map((e: any) => {
  //     return {
  //       startTime: e.startTime,
  //       endTime: e.endTime,
  //       level: e.level
  //     };
  //   });
  // }
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

<template>
  <!-- 监测因子 -->
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
      <div class="flex-class" v-if="navIndex == 0">
        <div class="factors">
          <div :class="[activeIndex == index ? 'active' : 'factors-item']" v-for="(val, index) in factorsList" :key="index" @click="getFactor(val, index)">
            <span>{{ val.showName }}</span>
          </div>
        </div>
        <div class="chart">
          <v-chart :options="lineOptions" :auto-resize="true" style="width: 100%; height: 100%"></v-chart>
        </div>
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
import dayjs from "dayjs";
import { TablePage, SearchComponent, TableComponent } from "@/components";
import { riverApi, envOverview } from "@/api";
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
export default class FactorsChart extends Vue {
  @State waterQulity: any;
  factorsList: any = ["高锰酸钾", "COD", "氨氮", "总磷", "总氮"];
  activeIndex: number = 0;
  getFactor(item: any, index: number) {
    this.activeIndex = index;
    // this.qulityParams.jcyzlist = [item.name];
    // this.rateParams.yzmc = item.name;
    // if (item.name == "PH值" || item.name == "水温" || item.name == "浊度" || item.name == "电导率") {
    //   this.lineOptions.tooltip.formatter = (params: any) => {
    //     return params[0].name + "<br>" + params[0].marker + params[0].value + "<br>";
    //   };
    // } else {
    //   this.lineOptions.tooltip.formatter = (params: any) => {
    //     return params[0].name + "<br>" + params[0].marker + params[0].value + "mg/L<br>";
    //   };
    // }

    this.getData();
  }
  color: any[] = ["#5f77ec", "#5397ff", "#58dde0", "#feb543"];
  lineOptions: any = {
    color: this.color,
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        return params[0].name + "<br>" + params[0].marker + params[0].value + "mg/L<br>";
      },
    },
    grid: {
      top: "16%",
      left: "3%",
      right: "6%",
      bottom: "12%",
      containLable: true,
    },
    xAxis: {
      type: "category",
      boundaryGap:false,
      inverse: true,
      // boundaryGap: ['10%','2%'],
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      data: [],
    },
    yAxis: {
      type: "value",
      name: '单位:mg/L',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        color: "#999",
      },
    },
    series: [
      {
        type: "line",
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
                color: "#5397ff",
              },
              {
                offset: 1,
                color: "rgba(83,151,255,0.2)",
              },
            ],
          },
        },
        data: [],
        markLine: {
          silent: true,
          symbol: "none",
          label: {
            show: false,
          },
          lineStyle: {
            color: "#feb543",
          },
          data: [],
        },
        markPoint: {
          silent: true,
          symbolSize: 0.1,
          label: {
            formatter: "{b}",
            fontSize: 16,
            position: "left",
          },
          data: [],
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
      // width: "60",
    },
    {
      title: "氨氮(mg/L)",
      key: "ammonianitrogen",
      // width: "60",
    },
    {
      title: "总磷(mg/L)",
      key: "totalphosphorus",
      // width: "60",
    },
    {
      title: "高锰酸盐指数(mg/L)",
      key: "codmn",
      // width: "60",
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
      label: "过程线",
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
      this.getData();
    }
  }
  getDate(date: any) {
    let st = this.$utils.dateFormat(date[0], "yyyy-MM");
    let et = this.$utils.dateFormat(date[1], "yyyy-MM");
    this.qulityParams.start = st;
    this.qulityParams.end = et;
    this.avglineParams.time = this.$utils.dateFormat(date[0], "yyyy-MM");
    this.getData();
    if (this.navIndex == 1) {
        this.getTable();
    }
  }

  pageParams: any = {
    current: 1,
    total: 0,
    pageSize: 10,
  };
  factorParams: any = {};
  qulityParams: any = {
    start: "2018-10-09 00:00:00",
    end: "2020-10-10 00:00:00",
    sectionId: "",
    // jcyzlist: [],
    // sbid: "",
    // sjzt: "",
    // timetype: "hour",
    // zdid: "",
  };
  otherParams: any = {
    stm: "",
    etm: "",
    bid: "",
    lx: "1",
  };
  mounted() {
    // this.getFactors()
    this.init();
  }
  init() {
    // let st = dayjs()
    //   .subtract(31, "day")
    //   .format("YYYY-MM-DD HH:mm:ss");
    // let et = dayjs().format("YYYY-MM-DD HH:mm:ss");
    // this.qulityParams.begin = st;
    // this.qulityParams.end = et;
    // this.otherParams.stm = st;
    // this.otherParams.etm = et;
    // this.date = [st, et];

    let st = dayjs()
      .subtract(1, "year")
      .format("YYYY-MM-DD");
    let et = dayjs().format("YYYY-MM-DD");
    this.date = [st, et];
    this.qulityParams.start = dayjs()
      .subtract(1, "year")
      .format("YYYY-MM");
    this.qulityParams.end = dayjs().format("YYYY-MM");
    this.otherParams.stm = st;
    this.otherParams.etm = et;
    this.avglineParams.time = dayjs()
      .subtract(31, "day")
      .format("YYYY-MM");
    this.getFactors();
  }
  // 获取监测因子
  async getFactors() {
    let data: any = [];
    this.factorsList = [];
    // this.factorParams.sbid = this.waterQulity.qulity.sbid;
    // let url = "hjzl/basedata/getJcyzBySbid";
    // data = await riverApi.getWaterQulity(this.factorParams, url);
    data = [
      {
        name: "氨氮",
        showName: "氨氮",
      },
      {
        name: "总磷",
        showName: "总磷",
      },
      {
        name: "高锰酸盐指数",
        showName: "高锰酸盐指数",
      },
    ];
    this.factorsList = data;
    // this.qulityParams.sectionId = this.waterQulity.qulity.sectionId;
    // let url = "wjServer/waterENVIR/section/wqList";
    // let resData = await
    // this.qulityParams.jcyzlist = [data[0].name];
    // this.rateParams.yzmc = data[0].name;
    this.getData();
  }
  // 对应因子数据
  async getData() {
    this.lineOptions.xAxis.data = [];
    this.lineOptions.series[0].data = [];
    let params: any = {};
    // console.log(this.waterQulity.qulity);
    // if (this.waterQulity.qulity.originPage == "zd") {
    //   //  this.qulityParams.zdid = this.waterQulity.qulity.siteId;
    //   this.qulityParams.sectionId = this.waterQulity.qulity.sectionId;
    //   url = "wjServer/waterENVIR/section/wqList";
    //   params = this.qulityParams;
    // } else if (this.waterQulity.qulity.originPage == "sd") {
    //   this.qulityParams.zdid = this.waterQulity.qulity.siteId;
    //   url = "hjzl/real/dataArtificialCurve";
    //   params = this.qulityParams;
    //   delete params.sbid;
    //   delete params.timetype;
    //   delete params.sjzt;
    // } else if (this.waterQulity.qulity.originPage == "yjzz") {
    //   this.otherParams.bid = this.waterQulity.qulity.bid;
    //   params = this.otherParams;
    // }
    this.qulityParams.sectionId = this.waterQulity.qulity.sectionId;
    let url = "wjServer/waterENVIR/section/wqList";
    params = this.qulityParams;
    let data = await riverApi.getWaterQulity(params, url);
    if (data.result) {
      data.data.reverse();
      this.lineOptions.xAxis.data = data.data.map((item: any) => item.datatime);
      if (this.activeIndex == 0) {
        this.lineOptions.series[0].data = data.data.map((item: any) => item.ammonianitrogen);
      } else if (this.activeIndex == 1) {
        this.lineOptions.series[0].data = data.data.map((item: any) => item.totalphosphorus);
      } else if (this.activeIndex == 2) {
        this.lineOptions.series[0].data = data.data.map((item: any) => item.codmn);
      }
    } else {
      this.$Message.error(data.desc);
    }

    // if (this.waterQulity.qulity.originPage == "sd" || this.waterQulity.qulity.originPage == "zd") {
    //   this.lineOptions.xAxis.data = data.map((item: any) => item.startTime);
    //   this.lineOptions.series[0].data = data.map((e: any) => {
    //     return e.datamap["AVG_" + this.rateParams.yzmc];
    //   });
    // } else {
    //   this.lineOptions.xAxis.data = data.list.map((e: any) => e.tm);
    //   this.lineOptions.series[0].data = data.list.map((e: any) => e[this.getYzmc(this.rateParams.yzmc)]);
    // }

    this.getRateValue();
  }
  getYzmc(yzmc: string) {
    let mc = "";
    if (yzmc == "氨氮") {
      mc = "nh3";
    }
    if (yzmc == "溶解氧") {
      mc = "rjy";
    }
    if (yzmc == "pH值") {
      mc = "ph";
    }
    if (yzmc == "化学需氧量") {
      mc = "cod";
    }
    if (yzmc == "总磷") {
      mc = "tp";
    }
    return mc;
  }
  // 因子等级线
  rateParams: any = {
    yzmc: "氨氮",
  };
  async getRateValue() {
    this.lineOptions.series[0].markLine.data = [];
    this.lineOptions.series[0].markPoint.data = [];
    this.lineOptions.yAxis.max = this.rateParams.yzmc == "PH值" ? "14" : null;
    this.lineOptions.yAxis.min = this.rateParams.yzmc == "PH值" ? "0" : null;
    let data = await envOverview.getRateValue(this.rateParams);
    this.lineOptions.series[0].markLine.data =
      this.rateParams.yzmc == "PH值"
        ? [
            {
              name: "Ⅰ类",
              yAxis: 6,
              lineStyle: {
                color: "#ff5a47",
              },
            },
            {
              name: "Ⅴ类",
              yAxis: 9,
              lineStyle: {
                color: "#ff5a47",
              },
            },
          ]
        : [
            {
              name: "Ⅰ类",
              yAxis: data[0].ONE,
              lineStyle: {
                color: "#32bb53",
              },
            },
            {
              name: "Ⅱ类",
              yAxis: data[0].TWO,
              lineStyle: {
                color: "#32bb53",
              },
            },
            {
              name: "Ⅲ类",
              yAxis: data[0].THREE,
              lineStyle: {
                color: "#32bb53",
              },
            },
            {
              name: "Ⅳ类",
              yAxis: data[0].FOUR,
              lineStyle: {
                color: "#ffab3d",
              },
            },
            {
              name: "Ⅴ类",
              yAxis: data[0].FIVE,
              lineStyle: {
                color: "#ff5a47",
              },
            },
          ];
    this.lineOptions.series[0].markPoint.data =
      this.rateParams.yzmc == "PH值"
        ? [
            {
              name: "Ⅰ类 ~ Ⅴ类",
              x: "50%",
              yAxis: 7.5,
              label: {
                textStyle: { color: "#32bb53" },
              },
            },
            // {
            //   name: "Ⅰ类",
            //   x: "15%",
            //   yAxis: 6,
            //   label: {
            //     textStyle: { color: "#32bb53" }
            //   }
            // },
            // {
            //   name: "Ⅴ类",
            //   x: "75%",
            //   yAxis: 9,
            //   label: {
            //     textStyle: { color: "#ff5a47" }
            //   }
            // }
          ]
        : [
            {
              name: "Ⅰ类",
              x: "15%",
              yAxis: data[0].ONE,
              label: {
                textStyle: { color: "#32bb53" },
              },
            },
            {
              name: "Ⅱ类",
              x: "30%",
              yAxis: data[0].TWO,
              label: {
                textStyle: { color: "#32bb53" },
              },
            },
            {
              name: "Ⅲ类",
              x: "45%",
              yAxis: data[0].THREE,
              label: {
                textStyle: { color: "#32bb53" },
              },
            },
            {
              name: "Ⅳ类",
              x: "60%",
              yAxis: data[0].FOUR,
              label: {
                textStyle: { color: "#ffab3d" },
              },
            },
            {
              name: "Ⅴ类",
              x: "75%",
              yAxis: data[0].FIVE,
              label: {
                textStyle: { color: "#ff5a47" },
              },
            },
          ];
    this.waterQulity.qulity.originPage != "sd" && this.getMonthAvgLine();
  }

  // 因子月平均线
  avglineParams: any = {
    jcyzlist: [],
    sbid: "",
    time: "",
  };
  async getMonthAvgLine() {
    this.avglineParams.jcyzlist = this.qulityParams.jcyzlist;
    this.avglineParams.sbid = this.qulityParams.sbid;
    let data = await envOverview.getMonthAvgLine(this.avglineParams);
    this.lineOptions.series[0].markLine.data.push({
      name: "月平均",
      yAxis: data[0][this.qulityParams.jcyzlist[0]],
      lineStyle: {
        color: "#5584ff",
      },
    });
    this.lineOptions.series[0].markPoint.data.push({
      name: "月平均",
      x: "55%",
      yAxis: data[0][this.qulityParams.jcyzlist[0]],
      label: {
        textStyle: { color: "#5584ff" },
      },
    });
  }

  // 列表
  async getTable() {
    // this.columns = [];
    this.tableData = [];
    // for (let i = 0; i < this.factorsList.length; i++) {
    //   if (this.factorsList[i].showName == "pH值" || this.factorsList[i].showName == "水温" || this.factorsList[i].showName == "浊度" || this.factorsList[i].showName == "电导率") {
    //     this.columns.push({
    //       title: this.factorsList[i].showName,
    //       key: "AVG_" + this.factorsList[i].name,
    //     });
    //   } else if (this.factorsList[i].showName == "高锰酸盐指数") {
    //     this.columns.push({
    //       title: this.factorsList[i].showName + "(mg/L)",
    //       key: "AVG_" + this.factorsList[i].name,
    //       width: "150",
    //     });
    //   } else {
    //     this.columns.push({
    //       title: this.factorsList[i].showName + "(mg/L)",
    //       key: "AVG_" + this.factorsList[i].name,
    //     });
    //   }

    //   this.qulityParams.jcyzlist.push(this.factorsList[i].name);
    // }

    // this.columns.unshift(
    //   {
    //     title: "序号",
    //     type: "index",
    //   },
    //   {
    //     title: "开始时间",
    //     key: "startTime",
    //   },
    //   {
    //     title: "结束时间",
    //     key: "endTime",
    //   },
    //   {
    //     title: "水质",
    //     key: "level",
    //     width: "60",
    //   }
    // );
    let url = "";
    let params: any = {};
    this.qulityParams.sectionId = this.waterQulity.qulity.sectionId;
    url = "wjServer/waterENVIR/section/wqList";
    params = this.qulityParams;
    let data = await riverApi.getWaterQulity(params, url);
    if (data.result) {
      this.tableData = data.data.map((item: any) => {
        return {
          riverquality: item.riverquality,
          codmn: item.codmn,
          ammonianitrogen: item.ammonianitrogen,
          totalphosphorus: item.totalphosphorus,
          createtime: item.createtime,
          lastmodifytime: item.lastmodifytime,
        };
      });
    } else {
      this.$Message.error(data.desc);
    }
    this.tableData = data.map((e: any) => {
      let item = {
        startTime: e.startTime,
        endTime: e.endTime,
        level: e.level,
      };
      return Object.assign(item, e.datamap);
    });
    this.pageParams.total = data.length;
  }
  getSize(size: number) {
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
    this.getTable();
  }
  getPage(page: number) {
    this.pageParams.current = page;
    this.getTable();
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
    .factors {
      padding-right: 15px;
      height: 100%;

      &-item {
        padding: 4px 10px;
        width: 120px;
        font-size: 13px;
        color: #666;
        cursor: pointer;
      }
      .active {
        position: relative;
        padding: 4px 10px;
        color: #3a7bef;
        background-color: #eff5ff;
        &:before {
          position: absolute;
          top: 0;
          left: 0;
          content: "";
          width: 2px;
          height: 100%;
          background-color: #3a7bef;
        }
      }
    }
    .chart {
      width: calc(100% - 140px);
      height: 100%;
    }
  }
}
</style>

<template>
  <!--雨情数据报表-->
  <div class="survey-flood">
    <div class="top-item">
      <div class="top-sel">
        <label>多站雨情站点:</label>
        <el-select v-model="report.stcd" multiple collapse-tags style="margin-left: 10px;" placeholder="请选择" clearable size="mini" @change="changeSelect">
          <el-checkbox v-model="checked" @change="selectAll">全选</el-checkbox>
          <el-option v-for="item in zdOptions" :label="item.label" :value="item.value" :key="item.value"> </el-option>
        </el-select>
      </div>
      <div class="top-sel">
        <label>时间选择：</label>
        <suc-date-picker v-model="report.startTime" :options="{ type: 'date', clearable: false }" style="width: 150px"></suc-date-picker>
        <label>至</label>
        <suc-date-picker v-model="report.endTime" :options="{ type: 'date', clearable: false }" style="width: 150px"></suc-date-picker>
      </div>
      <div class="top-sel">
        <span style="margin-right:30px">
          <suc-button type="primary" :debounce="800" @on-click="onSearch">查询</suc-button>
        </span>
        <span>
          <suc-button type="primary" :config="{ ghost: true }" :debounce="800" @on-click="exportExcel">导出</suc-button>
        </span>
      </div>
    </div>
    <!-- 内容部分 -->
    <div class="content">
      <div class="bottom scroll">
        <!-- <more-rain-station :swData="swData" :bb="chuan"></more-rain-station> -->
        <div class="river">
          <div class="river-item">多站雨晴对比</div>
          <div class="river-item">
            <v-chart :options="options" :autoresize="true" style="width:100%;height:70%;"></v-chart>
            <div class="river-item-table">
              <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" @get-page="getPage" @get-size="getSize"> </table-page>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { SucInput, SucSelect, SucButton, SucDatePicker } from "@suc/ui";
import { MoreRainStation } from "./floodPage";
import { SelectConfig, SelectOptions } from "@suc/ui/interfaces";
import { TablePage } from "@/components";
import { publicApi } from "@/api";
@Component({
  components: {
    SucSelect,
    SucInput,
    SucButton,
    SucDatePicker,
    MoreRainStation,
    TablePage,
  },
})
export default class ReportSelect extends Vue {
  get options() {
    return {
      color: ["#ffab3d"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          data: this.swData.xAxisData,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "降雨量：毫米",
        },
      ],
      series: [
        {
          name: "累计降雨量",
          type: "bar",
          barWidth: "60%",
          // data: [10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390, 330, 220],
          data: this.swData.seriesData,
        },
      ],
    };
  }

  columns: any[] = [
    {
      type: "index",
      title: "序号",
      width: 500,
    },
    {
      title: "站点",
      key: "dm",
    },
    {
      title: "小时最大降雨量(mm)",
      key: "gl",
    },
  ];

  tableData: any = [];
  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 20,
  };

  zdOptions: SelectOptions = [];
  checked: boolean = false;

  report: any = {
    stcd: "",
    startTime: new Date(new Date(new Date().getTime() - 1 * 1000 * 3600 * 24)),
    endTime: new Date(),
  };

  onpageParams: any = {
    zdbm: "",
    startTime: "",
    endTime: "",
    pageNum: "",
    pageSize: "",
  };

  swData: any = {
    legendData: [],
    xAxisData: [],
    seriesData: [],
  };

  // 图表的参数
  echartParams: any = {
    zdbm:"",
    startTime: "",
    endTime: "",
  };
  mounted() {
    this.getylzdData(); //获取雨量数据
    this.getEchartData();
    this.getonPageData(); //页面数据
  }

  //  导出表格
  exportExcel() {
    let url =
      process.env.VUE_APP_BASE +
      "/api/wjServer/hs/reportForm/monthFlowStatisticsExport?areaCode=" +
      this.report.areaCode +
      "&formType=" +
      this.report.bbSel +
      "&stationName=" +
      this.report.stationName +
      "&yearMonth=" +
      this.$utils.dateFormat(new Date(this.report.date), "yyyy-MM");
    window.location.href = url; //原窗口打开
    // window.open(url); // 重新打开新窗口
  }

  async getylzdData() {
    this.zdOptions = [];
    const url = "wjServer/dataCenter/stbprpb/pp";
    const data = await publicApi.getNoParam(url);
    this.zdOptions =
      data.result == true
        ? data.data.map((e: any) => {
            return {
              value: e.stcd,
              label: e.stnm,
            };
          })
        : [];
  }

  async getEchartData() {
    this.swData.xAxisData = [];
    this.swData.legendData = [];
    this.swData.seriesData = [];
    this.echartParams = {
      zdbm: (this.report.stcd).toString(),
      startTime: this.$utils.dateFormat(new Date(this.report.startTime), "yyyy-MM-dd"),
      endTime: this.$utils.dateFormat(new Date(this.report.endTime), "yyyy-MM-dd"),
    };
    const xurl = "wjServer/fangxunjc/z/xLine";
    const xdata = await publicApi.getWithParam(xurl, this.echartParams);
    if (xdata.result == true) {
      this.swData.xAxisData = xdata.data;
    } else {
      this.$Message.error("获取数据失败");
    }
    const yurl = "wjServer/fangxunjc/yuqing/rainFallLineChart";
    const ydata = await publicApi.getWithParam(yurl, this.echartParams);
    if (ydata.result == true) {
      this.swData.seriesData = ydata.data;
    } else {
      this.$Message.error("获取数据失败");
    }
  }
  async getonPageData() {
    this.tableData = [
      {
        id: "1",
        dm: "1",
        mc: "2022-1-27",
        gl: 7.5,
        hlmc: "2022-2-28",
        zt: "6.0",
        cx: "2011-21-23",
        bz: "2022-3-28",
        pq: "19片",
        flag: "提升井",
      },
      {
        id: "10",
        dm: "1",
        mc: "二环截流沟明渠1#提升井",
        gl: 3,
        hlmc: "二环截流沟",
        zt: "在用",
        bz: "1个2.5寸提升泵，功率3千瓦",
        pq: "18片",
        flag: "提升井",
      },
      {
        id: "100",
        dm: "17",
        mc: "牛首山河17#提升井",
        gl: 18.5,
        hlmc: "牛首山河",
        zt: "在用",
        bz: "2台DN150提升泵，每台功率18.5千瓦",
        pq: "15片",
        flag: "提升井",
      },
      {
        id: "101",
        dm: "10",
        mc: "太平十字沟10#提升井",
        gl: 5.5,
        hlmc: "太平十字沟",
        zt: "在用",
        bz: "2台5寸提升泵，每台功率5.5千瓦",
        pq: "08片",
        flag: "提升井",
      },
      {
        id: "102",
        dm: "5",
        mc: "太平十字沟5#提升井",
        gl: 3,
        hlmc: "太平十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "08片",
        flag: "提升井",
      },
      {
        id: "103",
        dm: "3",
        mc: "太平十字沟3#提升井",
        gl: 4,
        hlmc: "太平十字沟",
        zt: "在用",
        bz: "2台4寸提升泵，每台功率4千瓦",
        pq: "08片",
        flag: "提升井",
      },
      {
        id: "104",
        dm: "6",
        mc: "太平十字沟6#提升井",
        gl: 4,
        hlmc: "太平十字沟",
        zt: "在用",
        bz: "2台4寸提升泵，每台功率4千瓦",
        pq: "08片",
        flag: "提升井",
      },
      {
        id: "105",
        dm: "7",
        mc: "太平十字沟7#提升井",
        gl: 4,
        hlmc: "太平十字沟",
        zt: "在用",
        bz: "2台4寸提升泵，每台功率4千瓦",
        pq: "08片",
        flag: "提升井",
      },
      {
        id: "106",
        dm: "4",
        mc: "太平十字沟4#提升井",
        gl: 4,
        hlmc: "太平十字沟",
        zt: "在用",
        bz: "2台4寸提升泵，每台功率4千瓦",
        pq: "08片",
        flag: "提升井",
      },
      {
        id: "107",
        dm: "9",
        mc: "太平十字沟9#提升井",
        gl: 4,
        hlmc: "太平十字沟",
        zt: "在用",
        bz: "2台4寸提升泵，每台功率4千瓦",
        pq: "08片",
        flag: "提升井",
      },
      {
        id: "108",
        dm: "8",
        mc: "太平十字沟8#提升井",
        gl: 15,
        hlmc: "太平十字沟",
        zt: "在用",
        bz: "2台6寸提升泵，每台功率15千瓦",
        pq: "08片",
        flag: "提升井",
      },
      {
        id: "109",
        dm: "1",
        mc: "太平十字沟1#提升井",
        gl: 4,
        hlmc: "太平十字沟",
        zt: "在用",
        bz: "2台4寸提升泵，每台功率4千瓦",
        pq: "08片",
        flag: "提升井",
      },
      {
        id: "11",
        dm: "8",
        mc: "东南大学护校沟8#提升井",
        gl: 2.5,
        hlmc: "东大护校沟",
        zt: "在用",
        bz: "2个3寸提升泵，每个功率2.5千瓦",
        pq: "14片",
        flag: "提升井",
      },
      {
        id: "110",
        dm: "2",
        mc: "高湖2#提升井",
        gl: 7.5,
        hlmc: "高湖",
        zt: "在用",
        bz: "2台4寸提升泵，每台功率7.5千瓦",
        pq: "07片",
        flag: "提升井",
      },
      {
        id: "111",
        dm: "9",
        mc: "庄排十字沟9#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "112",
        dm: "8",
        mc: "庄排十字沟8#提升井",
        gl: 4,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台4寸提升泵，每台功率4千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "113",
        dm: "1",
        mc: "高湖1#提升井",
        gl: 7.5,
        hlmc: "高湖",
        zt: "在用",
        bz: "2台4寸提升泵，每台功率7.5千瓦",
        pq: "07片",
        flag: "提升井",
      },
      {
        id: "114",
        dm: "7",
        mc: "庄排十字沟7#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "1台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "115",
        dm: "6",
        mc: "庄排十字沟6#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "116",
        dm: "5",
        mc: "庄排十字沟5#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "116",
        dm: "5",
        mc: "庄排十字沟5#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "116",
        dm: "5",
        mc: "庄排十字沟5#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "116",
        dm: "5",
        mc: "庄排十字沟5#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "116",
        dm: "5",
        mc: "庄排十字沟5#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "116",
        dm: "5",
        mc: "庄排十字沟5#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "116",
        dm: "5",
        mc: "庄排十字沟5#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "116",
        dm: "5",
        mc: "庄排十字沟5#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "116",
        dm: "5",
        mc: "庄排十字沟5#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "116",
        dm: "5",
        mc: "庄排十字沟5#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
      {
        id: "116",
        dm: "5",
        mc: "庄排十字沟5#提升井",
        gl: 3,
        hlmc: "庄排十字沟",
        zt: "在用",
        bz: "2台3寸提升泵，每台功率3千瓦",
        pq: "03片",
        flag: "提升井",
      },
    ];
    this.onpageParams.zdbm =  (this.report.stcd).toString();
    this.onpageParams.startTime = this.$utils.dateFormat(new Date(this.report.startTime), "yyyy-MM-dd");
    this.onpageParams.endTime = this.$utils.dateFormat(new Date(this.report.endTime), "yyyy-MM-dd");
    this.onpageParams.pageNum = this.pageParams.current;
    this.onpageParams.pageSize = this.pageParams.pageSize;
    var url = "wjServer/fangxunjc/yuqing/rainFallList";
    publicApi.getWithParam(url, this.onpageParams).then((data: any) => {
      if (data.result == true) {
        this.tableData = data.data.rows;
        this.pageParams.total = parseInt(data.data.total);
      }
    });
  }

  // 查询
  onSearch() {
    this.getEchartData();
    this.getonPageData();
  }

  getPage(page: any) {
    this.pageParams.current = page;
    this.getonPageData();
  }
  getSize(size: any) {
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
    this.getonPageData();
  }

  selectAll() {
    this.report.stcd = [];
    if (this.checked) {
      this.zdOptions.map((item: any) => {
        this.report.stcd.push(item.value);
      });
    } else {
      this.report.stcd = [];
    }
  }

  changeSelect(val: any) {
    if (val.length === this.zdOptions.length) {
      this.checked = true;
    } else {
      this.checked = false;
    }
  }
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
@import "@/styles/commonVariables.scss";

.survey-flood {
  width: 100%;
  height: 100%;
  //   display: relative;
  padding: 10px;
  //   margin-bottom: 10px;
  //   background: #f8f8f9;
  background: #efeff1;
  .top-item {
    width: 100%;
    height: 62px;
    display: flex;
    line-height: 62px;
    margin-bottom: 10px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
    border-radius: 3px;
    background: #fff;
    .top-sel {
      margin-right: 10px;
      // &:nth-of-type(1) {
      //   margin-right: 50px;
      // }
      &:nth-of-type(2) {
        margin-right: 50px;
      }
      label {
        margin: 0 10px;
      }
    }
  }
  .btn {
    margin-right: 10px;
  }
  .content {
    height: calc(100% - 72px);
    border-top: 1px solid #dde4eb;
    background: #fff;
    padding-left: 14px;
    font-size: 14px;
    color: #666666;
    .bottom {
      height: 100%;
      width: 100%;
      overflow: auto;
      .river {
        width: 100%;
        height: 100%;
        &-item {
          &:first-of-type {
            position: relative;
            font-size: 16px;
            padding: 20px 34px;
            color: #333333;
            line-height: 16px;
            border-bottom: 1px solid #dde4eb;
            &:before {
              content: "";
              position: absolute;
              top: 21px;
              left: 20px;
              width: 4px;
              height: 14px;
              background-color: #3983f3;
              border-radius: 4px;
            }
          }
          &:nth-of-type(2) {
            height: calc(100% - 60px);
            .river-item-table {
              height: 100%;
              width: 100%;
              position: relative;
              margin-top: 100px;
            }
          }
        }
      }
    }
  }
}
</style>

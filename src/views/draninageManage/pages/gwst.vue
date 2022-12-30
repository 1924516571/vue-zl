<template>
  <!--管网疏通-->
  <div class="survey-flood">
    <div class="top-item">
      <div class="top-sel">
        <suc-date-picker
          v-model="report.year"
          :options="{
            type: 'year',
            clearable: true,
            placeholder: '请选择日期',
          }"
          style="width: 200px; margin-left: 10px"
        ></suc-date-picker>
      </div>

      <div class="top-sel">
        <span class="primarys">
          <suc-button
            style="margin-top: -2px"
            type="primary"
            :debounce="800"
            @on-click="onSearch"
            >查询</suc-button
          >
        </span>
        <el-upload
          type="primary"
          style="margin-left: 18px; display: inline-block"
          size="small"
          :headers="uploadHeaders"
          :on-success="PicSuccess"
          action="api/wjServer/paishui/plan/import"
          accept=".xls,.xlsx"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">导入</el-button>
        </el-upload>
        <suc-button
          class="primarys"
          type="primary"
          :config="{ ghost: true }"
          :debounce="800"
          @on-click="exportExcel"
          >导出</suc-button
        >
      </div>
    </div>
    <!-- 内容部分 -->

    <div class="content">
      <div class="bottom scroll">
        <div class="river">
          <h1 class="titles">
            {{
              echartParams.year
            }}年武进区城区雨、污水管网管护工作计划表（年度）
          </h1>
          <div style="width: 100%; height: 60%">
            <v-chart
              :options="options"
              :autoresize="true"
              style="width: 100%; height: 100%; display: inline-block"
            ></v-chart>
          </div>
          <table-no :columns="columns" :tableData="tableData"> </table-no>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SucInput, SucSelect, SucButton, SucDatePicker } from "@suc/ui";
import { SelectOptions } from "@suc/ui/interfaces";
import { publicApi } from "@/api";

import { TableNo } from "@/components";
@Component({
  components: {
    SucSelect,
    SucInput,
    SucButton,
    SucDatePicker,
    TableNo,
  },
})
export default class ReportSelect extends Vue {
  typeOpt: SelectOptions = [];
  model: boolean = false;
  loading: boolean = true;
  uploadHeaders: any = {
    Authorization: "bearer " + localStorage.getItem("refresh-token"),
  };

  report: any = {
    year: new Date(),
  };
  title: any = "";
  //  列表显示
  areaOptions: any = [];
  tableData: any = [];
  // 图表的参数
  echartParams: any = {
    year: "",
  };
  slData: any = {
    xAxisData: [],
    wsLengths: [],
    ysLengths: [],
  };
  toggle(val: boolean) {
    this.model = val;
  }

  PicSuccess(file: any) {
    console.log("--", file);
  }

  get options() {
    return {
      color: ["#5397ff", "#36b56e", "#ffab3d", "#c088ff"],

      tooltip: {
        trigger: "axis",
      },
      grid: {
        left: "5%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      legend: {
        top: 2,
        right: 100,
        icon: "column",
        itemHeight: 15, // 修改icon图形大小
        itemGap: 24,
        textStyle: {
          fontSize: 12,
          color: "#333",
          padding: [0, 0, 0, 0], // 修改文字和图标距离
        },
      },
      xAxis: {
        // type: "category",
        data: this.slData.xAxisData,
        axisTick: {
          lineStyle: {
            color: "#acb1b7",
          },
        },
        axisLabel: {
          color: "#666",
          interval: 0,
          // rotate:45
        },
      },
      yAxis: {
        type: "value",
        name: "单位/米",
        nameTextStyle: {
          color: "#333",
        },
        splitLine: {
          color: "#999",
        },
        axisLabel: {
          color: "#999",
        },
      },
      series: [
        {
          type: "bar",
          data: this.slData.ysLengths,
          name: "雨水",
          barCategoryGap: '40%'
        },
        {
          type: "bar",
          data: this.slData.wsLengths,
          name: "污水",
          barCategoryGap: '40%'
        },
      ],
    };
  }

  mounted() {
    this.getEchartData(); //获取图表的数据
    this.onpage(); //表单数据
  }

  //  导出表格
  exportExcel() {
    //  location.href="/wjServer/paishui/plan/export?year=" +this.$utils.dateFormat(new Date(this.report.year), "yyyy")
    let url =
      "/api/wjServer/paishui/plan/export?year=" +
      this.$utils.dateFormat(new Date(this.report.year), "yyyy");
    window.location.href = url; //原窗口打开
    // window.open(url); // 重新打开新窗口
  }

  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "项目名称",
      key: "pName",
    },
    {
      title: "月份",
      key: "month",
    },
    {
      title: "路名",
      key: "roadname",
    },
    {
      title: "路段",
      key: "roadsegment",
    },
    {
      title: "疏通管道长度总计/M",
      key: "totallength",
    },
    {
      title: "雨水管疏通长度",
      key: "yslength",
    },
    {
      title: "污水管疏通长度",
      key: "wslength",
    },
    {
      title: "清井",
      key: "jing",
    },
    {
      title: "管护单位",
      key: "company",
    },
    {
      title: "责任人",
      key: "people",
    },
    {
      title: "联系电话",
      key: "tel",
    },
  ];
  onSearch() {
    this.onpage();
    this.getEchartData();
  }

  async getEchartData() {
    this.slData.xAxisData = [];
    this.slData.wsLengths = [];
    this.slData.ysLengths = [];
    this.echartParams = {
      year: this.$utils.dateFormat(new Date(this.report.year), "yyyy"),
    };
    const xurl = "wjServer/paishui/plan/monthChart";
    const xdata = await publicApi.getWithParam(xurl, this.echartParams);
    if (xdata.result == true) {
      this.slData.xAxisData = xdata.data.months;
      this.slData.wsLengths = xdata.data.wsLengths;
      // console.log("雨水", this.slData.wsLengths);
      this.slData.ysLengths = xdata.data.ysLengths;
      // console.log("污水", this.slData.ysLengths);
    } else {
      this.$Message.error("获取数据失败");
    }
  }

  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  pageYjParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  stationParams: any = {
    pageNumber: "",
    pageSize: "",
    year: "",
  };

  // 列表
  async onpage() {
    this.stationParams.pageNumber = this.pageParams.current; //当前页码
    this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
    this.stationParams = {
      year: this.$utils.dateFormat(new Date(this.report.year), "yyyy"),
    };
    let url = "wjServer/paishui/plan/page";
    let data = await publicApi.getWithParam(url, this.stationParams);
    if (data.result == true) {
      this.tableData = data.data.rows;
      this.pageParams.total = parseInt(data.data.total);
    } else {
      this.tableData = [];
      this.$SucMessage.error("获取失败");
    }
    this.loading = false;
  }
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
@import "@/styles/commonVariables.scss";

.primarys {
  margin-left: 20px;
}
.titles {
  text-align: center;
  margin-top: 20px;
}
.river-item {
  text-align: center;
}
.survey-flood {
  width: 100%;
  height: 100%;
  display: relative;
  padding: 10px;
  margin-bottom: 10px;
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
    // background: rgb(17, 218, 67);
    background: #fff;
    // padding: 0 14px;
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
        .noData {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
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
              .btn {
                color: #5397ff;
                cursor: pointer;
                span {
                  display: inline-block;
                  margin-right: 10px;
                  &:nth-of-type(2) {
                    color: #ff5a47;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

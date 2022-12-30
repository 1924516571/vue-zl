<template>
  <!--水情数据报表-->
  <div class="survey-flood">
    <div class="top-item">
      <div class="top-sel">
        <label>时间选择：</label>
        <suc-date-picker
          v-model="report.endTime"
          :options="{
            type: 'year',
            clearable: true,
            placeholder: '请选择申报年份',
          }"
          style="width: 200px"
        ></suc-date-picker>
      </div>
      <div class="top-sel">
        <suc-button style="margin-top:-4px;margin-right:50px" type="primary" :debounce="800" @on-click="onSearch">查询</suc-button>
        <el-upload
          type="success"
          style="margin-top:4px;margin-right:20px;display:inline-block"
          size="small"
          :headers="uploadHeaders"
          :on-success="PicSuccess"
          action="api/wjServer/paishui/repair/import"
          accept=".xls,.xlsx"
          :show-file-list="false"
        >
          <el-button size="small" type="success">导入</el-button>
        </el-upload>
        <!-- <suc-button style="margin-top:-4px;margin-right:20px" type="primary" :debounce="800" @on-click="exportExcel">导入</suc-button> -->
        <suc-button style="margin-top:-4px;margin-right:20px" type="primary" :config="{ ghost: true }" :debounce="800" @on-click="exportExcel">导出</suc-button>
      </div>
    </div>
    <!-- 内容部分 -->
    <div class="content">
      <div class="bottom scroll">
        <div class="river">
          <div class="river-item">{{ title }}2022年城镇老旧管网排查修复</div>
          <div class="river-item">
            <v-chart :options="options" @changeArea="handleChartClick"  :autoResize="true" style="width:47%;height:70%;display:inline-block;margin-left:30px"></v-chart>
            <v-chart :options="options1" :autoResize="true" style="width:47%;height:70%;display:inline-block;margin-left:30px"></v-chart>
            <div class="river-item-table">
              <table-no :columns="columns" :tableData="tableData">
                <template v-slot:operation="{ row }">
                  <div class="btn">
                    <span @click="onedit(row)">详情</span>
                  </div>
                </template>
              </table-no>
            </div>
          </div>
        </div>
      </div>
      <gwpc-modal title="详情" :model="model" :formParams="formParams" @toggle="toggle"></gwpc-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { SucInput, SucSelect, SucButton, SucDatePicker } from "@suc/ui";
import { SelectConfig, SelectOptions } from "@suc/ui/interfaces";
import { publicApi } from "@/api";
import { gwpcModal } from "./model";

import { TableNo } from "@/components";
@Component({
  components: {
    SucSelect,
    SucInput,
    SucButton,
    SucDatePicker,
    TableNo,
    gwpcModal,
  },
})
export default class ReportSelect extends Vue {
  typeOpt: SelectOptions = [];
  model: boolean = false;

  uploadHeaders: any = { Authorization: "bearer " + localStorage.getItem("refresh-token") };
  formParams: any = {
    year: "",
    range: "",
  };
  report: any = {
    endTime: new Date(),
  };
  title: any = "";

  slData: any = {
    xAxisData: [],
    seriesData: [],
  };

  cdData: any = {
    xAxisData: [],
    seriesData: [],
  };

  toggle(val: boolean) {
    this.model = val;
  }

  PicSuccess(file: any) {
    if (file.result) {
      this.$Message.success("导入成功");
      this.onpage();
    } else {
      this.$Message.error("导入失败");
    }
  }

  get options() {
    return {
      color: ["#5397ff", "#36b56e", "#ffab3d", "#c088ff"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "5%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
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
        name: "单位/处",
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
          // barWidth: '60%',
          type: "bar",
          data: this.slData.seriesData,
          // showBackground: true,
        },
      ],
    };
  }

  get options1() {
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
      xAxis: {
        // type: "category",
        data: this.cdData.xAxisData,
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
          type: "line",
          smooth: true,
          data: this.cdData.seriesData,
        },
      ],
    };
  }

  mounted() {
    this.getEchartData(); //获取图表的数据
    this.onpage(); //表单数据
    // this.options.on('click',params=>{})
  }

  monthChartParams: any = {
    year: "",
    area: "",
  };

  // handleChartClick(params: any) {
  //   this.monthChartParams.year = this.$utils.dateFormat(new Date(this.report.endTime), "yyyy");
  //   if (params.name) {
  //     this.monthChartParams.area = params.name;
  //   } else {
  //     this.$Message.info("区域为空");
  //     return;
  //   }
  //   this.getmonthChart();
  // }

  handleChartClick(area:any){
       this.monthChartParams.year = this.$utils.dateFormat(new Date(this.report.endTime), "yyyy");
      if (area) {
      this.monthChartParams.area = area;
    } else {
      this.$Message.info("区域为空");
      return;
    }
    this.getmonthChart();
  }

  async getmonthChart() {
    this.cdData.xAxisData = [];
    this.cdData.seriesData = [];
    let url = "wjServer/paishui/repair/monthChart";
    let data = await publicApi.getWithParam(url, this.monthChartParams);
    if (data.result) {
      this.cdData.xAxisData = data.data.month;
      this.cdData.seriesData = data.data.length;
    }
  }

  // 编辑
  onedit(row: any) {
    this.formParams.range = row.range;
    this.formParams.year = this.$utils.dateFormat(new Date(this.report.endTime), "yyyy");
    this.model = true;
  }

  changeSelect(value: any) {
    let obj: any = {};
    obj = this.typeOpt.find((item: any) => {
      return item.value === value;
    });
    this.title = obj.label;
  }

  columns: any[] = [
    {
      type: "index",
      title: "序号",
      width: 60,
    },
    {
      title: "检测长度(米)",
      key: "length",
    },
    {
      title: "修复数量(处)",
      key: "num",
    },
    {
      title: "时间范围",
      key: "range",
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
    },
  ];

  tableData: any = [];

  // 分页的参数
  onpageParams: any = {
    year: "",
  };

  // 图表的参数
  echartParams: any = {
    year: "",
  };

  // 查询
  onSearch() {
    this.getEchartData();
    this.onpage();
  }

  async onpage() {
    this.onpageParams.year = this.$utils.dateFormat(new Date(this.report.endTime), "yyyy");
    var url = "wjServer/paishui/repair/monthList";
    publicApi.getWithParam(url, this.onpageParams).then((data: any) => {
      if (data.result == true) {
        this.tableData = data.data;
      }
    });
  }

  //  导出表格
  exportExcel() {
    let url = "/api/wjServer/paishui/repair/export?year=" + this.$utils.dateFormat(new Date(this.report.endTime), "yyyy");
    window.location.href = url; //原窗口打开
    // window.open(url); // 重新打开新窗口
  }

  async getEchartData() {
    this.slData.xAxisData = [];
    this.slData.seriesData = [];
    this.echartParams = {
      year: this.$utils.dateFormat(new Date(this.report.endTime), "yyyy"),
    };

    const xurl = "wjServer/paishui/repair/pqChart";
    const xdata = await publicApi.getWithParam(xurl, this.echartParams);
    if (xdata.result == true) {
      this.slData.xAxisData = xdata.data.pqs;
      this.slData.seriesData = xdata.data.repair;
    } else {
      this.$Message.error("获取数据失败");
    }
    // const yurl = "wjServer/paishui/repair/monthChart";
    // const ydata = await publicApi.getWithParam(yurl, this.echartParams);
    // if (ydata.result == true) {
    //   this.cdData.xAxisData = ydata.data.month;
    //   this.cdData.seriesData = ydata.data.length;
    // } else {
    //   this.$Message.error("获取数据失败");
    // }
  }
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
@import "@/styles/commonVariables.scss";

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

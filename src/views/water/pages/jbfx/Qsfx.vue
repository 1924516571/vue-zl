<template>
  <!--取水分析-->
  <div class="survey-flood">
    <div class="top-item">
      <div class="top-sel">
        <suc-date-picker
          v-model="report.date"
          :options="{
            type: 'month',
            clearable: true,
            placeholder: '请选择日期',
          }"
          style="width: 200px; margin-left: 10px"
        ></suc-date-picker>
         <span class="primarys">
          <suc-button type="primary" :debounce="800" @on-click="onSearch"
            >查询</suc-button
          >
        </span>
        <suc-button
          class="primarys"
          type="primary"
          :debounce="800"
          @on-click="exportExcel"
          >导出</suc-button
        >
      </div>

      <!-- <div class="top-sel">
        <el-select
          :options="areaOptions"
          v-model="report.stationIds"
          multiple
          collapse-tags
          style="margin-left: 10px; width: 280px"
          placeholder="请选择"
          clearable
          size="mini"
        >
          
          <el-option
            v-for="item in zdOptions"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          >
          </el-option>
        </el-select>
       
      </div> -->
    </div>
    <!-- 内容部分 -->

    <div class="content">
      <div class="bottom scroll">
        <div class="river">
          <div class="titles">武进区水资源取水分析简报</div>
          <div class="titles">
            截止到{{ onloadParams.date }}月，月取水共计
            {{ time.monTotal }}m³，各乡镇本年累计取水 {{ time.yearTotal }}m³
          </div>
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
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { SucInput, SucSelect, SucButton, SucDatePicker } from "@suc/ui";
import { SelectConfig, SelectOptions } from "@suc/ui/interfaces";
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
  zdOptions: any = []; //站点数组
  typeOpt: SelectOptions = [];
  model: boolean = false;

  uploadHeaders: any = {
    Authorization: "bearer " + localStorage.getItem("refresh-token"),
  };

  report: any = {
    stationIds: "",
    date: new Date(),
  };
  title: any = "";
  //  列表显示
  areaOptions: any = [];
  tableData: any = [];
  onloadParams: any = {
    stationIds: "",
    date: "",
  };
  // 图表的参数
  echartParams: any = {
    date: "",
    stationIds: "",
  };
  slData: any = {
    xAxisData: [],
    seriesData: [],
  };
  time: any = {
    monTotal: [],
    yearTotal: [],
  };
  toggle(val: boolean) {
    this.model = val;
  }

  PicSuccess(file: any) {
    console.log("--", file);
  }

  get options() {
    // let resultarr = [];
    // var start = resultarr.length - 8;
    // var end = resultarr.length - 1;
    return {
      color: ["#5397ff", "#36b56e", "#ffab3d", "#c088ff"],

      tooltip: {
        trigger: "axis",
      },
      // dataZoom: [
      //   {
      //     show: false,
      //     type: "slider",
      //     handleSize: 32,
      //     startValue: start,
      //     endValue: end,
      //   },
      //   {
      //     zoomLock: true,
      //     type: "inside",
      //   },
      // ],
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
        name: "单位/m³",
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
          barCategoryGap: '50%'
        },
      ],
    };
  }

  mounted() {
    this.getEchartData(); //获取图表的数据
    this.getonPageData(); //表单数据
    this.getzdData(); //下拉框
  }

  //  导出表格
  exportExcel() {
    // location.href="/api/wjServer/qushui/export?date=" +this.$utils.dateFormat(new Date(this.report.date), "yyyy-MM")
    let url =
      "/api/wjServer/qushui/export?date=" +
      this.$utils.dateFormat(new Date(this.report.date), "yyyy-MM");
    window.location.href = url; //原窗口打开
    // window.open(url); // 重新打开新窗口
  }

  async getzdData() {
    this.zdOptions = [];
    const url = "wjServer/qushui/list";
    const data = await publicApi.getNoParam(url);
    this.zdOptions =
      data.result == true
        ? data.data.map((e: any) => {
            return {
              value: e.stationId,
              label: e.stationName,
            };
          })
        : [];
  }

  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "企业名称",
      key: "stationName",
    },
    {
      title: "行政区域",
      key: "areaName",
    },
    {
      title: "水源类型",
      key: "syType",
    },
    {
      title: "月取水量(m³)",
      key: "qmon",
    },
    {
      title: "年累计取水量(m³)",
      key: "qyear",
    },
  ];
  onSearch() {
    this.getonPageData();
    this.getEchartData();
  }

  async getonPageData() {
    this.onloadParams = {
      stationIds: this.report.stationIds.toString(),
      date: this.$utils.dateFormat(new Date(this.report.date), "yyyy-MM"),
    };
    const url = "wjServer/qushui/monList";
    publicApi.getWithParam(url, this.onloadParams).then((data: any) => {
      if (data.result == true) {
        this.tableData = data.data;
      } else {
        this.tableData = [];
      }
    });
  }

  async getEchartData() {
    this.slData.xAxisData = [];
    this.slData.seriesData = [];
    this.echartParams = {
      stationIds: this.report.stationIds.toString(),
      date: this.$utils.dateFormat(new Date(this.report.date), "yyyy-MM"),
    };
    const xurl = "wjServer/qushui/chart";
    const xdata = await publicApi.getWithParam(xurl, this.echartParams);
    if (xdata.result == true) {
      this.time.monTotal = xdata.data.monTotal;
      this.time.yearTotal = xdata.data.yearTotal;
      this.slData.xAxisData = xdata.data.areaNames;
      this.slData.seriesData = xdata.data.qMons;
      console.log('xdata',xdata.data)
    } else {
      this.$Message.error("获取数据失败");
    }
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

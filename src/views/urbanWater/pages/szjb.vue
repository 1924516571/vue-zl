<template>
  <!--水质简报-->
  <div class="survey-flood">
    <div class="top-item">
      <div class="top-sel">
         <suc-date-picker
              v-model="report.date"
              :options="{
                type: 'month',
                clearable: true,
                placeholder: '年/月',
              }"
              style="width: 200px;margin-left: 10px;"
            ></suc-date-picker>
      </div>
        <div class="top-sel">
         <span class="primarys">
          <suc-button type="primary" :debounce="800" @on-click="onSearch">查询</suc-button>
          </span>
          <suc-button  class="primarys"  type="primary" :debounce="800" @on-click="exportExcel">导出</suc-button>
      </div>
    </div>
    <!-- 内容部分 -->
    <div class="content">
        <div class="bottom scroll">
          <div class="river">
             <div style="text-align: center;">
                <h2>武进区城区水环境调度分析简报</h2>
                <h3>截止到{{echartParams.month}}月底，共{{slData.total}}个监测断面，达标断面{{slData.reached}}个，未达标断面{{slData.notReached}}个，达标率{{slData.rate}}</h3>
             </div>
              <div>水质等级分析</div>
              <div class="river float">
               <div  style="width:50% ;height:60%">
                <v-chart :options="option" :autoresize="true" style="width:70%;display:inline-block;"></v-chart>
               </div>
               <div class="borders"></div>
               <div style="width:50% ;height:60%; ">
                  <v-chart :options="options" :autoresize="true" style="width:70%;display:inline-block;"></v-chart>
                </div>
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

import {  TableNo } from "@/components";
import { parseInt } from "lodash";
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

  uploadHeaders:any = {"Authorization":'bearer ' + localStorage.getItem("refresh-token")}

  report: any = {
    date: new Date(),
  };
  title: any = "";
  //  列表显示
  areaOptions: any = []
  tableData: any = [];
  onloadParams: any = {
    month: "",
  };
  // 饼图参数
  cakeData:any={
    name1:[],
    name2:[],
    name3:[],
    name4:[],
    name5:[],
    name6:[],
    value1:[],
    value2:[],
    value3:[],
    value4:[],
    value5:[],
    value6:[],
  }
  // 图表的参数
  echartParams: any = {
    month: "",
  };
  slData: any = {
    reached: [],
    notReached:[],
    total:[],
    rate:[],
  };
  toggle(val: boolean) {
    this.model = val;
  }

  PicSuccess(file: any) {
    console.log("--",file);
  }

  // 饼状图渲染
 get option() {
  return{
    tooltip: {
        trigger: "item",
      },
     legend: {
      orient: 'vertical',
      x: 'right',
      y:"center",
      data: this.cakeData.name
        },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true, //饼图上的数据是否展示true展示false不展示
            // position: "inner", //饼图上的数据展示位置inner是展示在内部
            formatter:  "{b}"+"类 "+"{c}"+"个" 
          },
          labelLine: {
            // show: true
          },
          emphasis: {
            // label: {
            //   show: true,
            //   fontSize: '30',
            //   fontWeight: 'bold'
            // }
          },
          data:this.cakeData
        }
      ]
    };
  }
  
  // 柱状图渲染 `
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
      xAxis: {
        // type: "category",
        data:['达标','未达标'],
        axisTick: {
          lineStyle: {
            color: "#acb1b7",
          },
        },
        axisLabel: {
          color: "#666",
          interval:0,
          // rotate:45
        },
      },
      yAxis: {
        type: "value",
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
      series:[
        {
          // barWidth: '60%',
          type:'bar',
          data: [this.slData.reached,

          // 修改未达标样式
          {
            value:this.slData.notReached,
            itemStyle: {
              color: 'red',
              shadowColor: 'red',
              borderType: 'dashed',
              borderWidth:2,
            }
          }],
        }
      ],
    };
  }
  // 加载页面
  mounted() {
    this.getEchartData(); //获取图表的数据
    this.getonPageData(); //表单数据
    this.getCakeData();   //饼图数据
  }

  //  导出表格
  exportExcel() {
    // location.href="/api/wjServer/qushui/export?date=" +this.$utils.dateFormat(new Date(this.report.date), "yyyy-MM")
      let url ="/api/wjServer/waterENVIR/section/export?month=" +
      this.$utils.dateFormat(new Date(this.report.date), "yyyy-MM") 
      window.location.href = url; //原窗口打开
      // window.open(url); // 重新打开新窗口
  }
  // 渲染列表
  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "断面名称",
      key: "sectionName",
    },
    {
      title: "河道名称",
      key: "riverName",
    },
    {
      title: "现状水质",
      key: "nowWq",
    },
    {
      title: "目标水质",
      key: "targetWq",
    },
    {
      title: "高锰酸钾(mg/L)",
      key: "codmn",
    },
    {
      title: "氨氮(mg/L)",
      key: "nh3n",
    },
    {
      title: "总磷(mg/L)",
      key: "tp",
    },
    {
      title: "达标状态",
      key: "stand",
    },
  ];
  // 查询
   onSearch() {
    this.getonPageData();
    this.getEchartData();
    this.getCakeData();  
  }
  // 列表显示
   async getonPageData() {
       this.onloadParams = {
        month: this.$utils.dateFormat(new Date(this.report.date), "yyyy-MM"),
    };
    const url = "wjServer/waterENVIR/section/reportList";
    publicApi.getWithParam(url, this.onloadParams).then((data: any) => {
      if (data.result == true) {
        this.tableData=data.data
        for (let i = 0; i <this.tableData.length; i++) {
          var sta=this.tableData[i].stand==true?'达标':'未达标'
          this.tableData[i].stand=sta
        }
      }else {
        this.tableData = [];
      }
    });
  }
  // 饼状图显示
  async getCakeData(){
    this.cakeData=[]
    this.echartParams = {
     month: this.$utils.dateFormat(new Date(this.report.date), "yyyy-MM"),
    };
    const burl='wjServer/waterENVIR/section/wqStat';
    const bdata= await publicApi.getWithParam(burl, this.echartParams);   
    if (bdata.result == true) {
      this.cakeData=bdata.data
    }else{
    this.$Message.error("获取数据失败");
    }
  }

  // 柱状图与统计
  async getEchartData() {
    this.slData.reached = [];
    this.slData.notReached = [];
    this.slData.total = [];
    this.slData.rate = [];
    this.echartParams = {
     month: this.$utils.dateFormat(new Date(this.report.date), "yyyy-MM"),
    };
    const xurl = "wjServer/waterENVIR/section/reachedStat";
    const xdata = await publicApi.getWithParam(xurl, this.echartParams);
    if (xdata.result == true) {
      this.slData.reached = xdata.data.reached;
      this.slData.notReached = xdata.data.notReached;
      this.slData.total = xdata.data.total;
      this.slData.rate =xdata.data.rate;
    }else{
      this.$Message.error("获取数据失败");
    }
  }
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
@import "@/styles/commonVariables.scss";
.borders{
  border-left: 1px solid #999;
  margin: 3% 10% 0 20px;
  height: 60%;
}
.float{
  display: flex;
}
.primarys{
    margin-left: 20px;
}
.titles{
    text-align: center;
    margin-top: 20px;
}
.river-item{
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
        height: 80%;
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

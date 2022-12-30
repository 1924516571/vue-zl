<template>
  <!--河道水质-->
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
              style="width: 200px;margin-left: 10px;"
            ></suc-date-picker>
      </div>
      
       <div class="top-sel">
         <span class="primarys">
          <suc-button style="margin-top:-2px" type="primary" :debounce="800" @on-click="onSearch">查询</suc-button>
            </span>
           <el-upload
              type="primary"
              style="margin-left: 18px; display:inline-block"
              size="small"
              :headers="uploadHeaders"
              :on-success="PicSuccess"
              action="api/wjServer/paishui/riverSz/import"
              accept=".xls,.xlsx"
              :show-file-list="false"
            >
              <el-button size="small" type="primary">导入</el-button>
            </el-upload>
              <suc-button  class="primarys"  type="primary" :config="{ ghost: true }" :debounce="800" @on-click="exportExcel">导出</suc-button>
      </div>
    </div>
    <!-- 内容部分 -->
        
    <div class="content">
        <div class="bottom scroll">
          <div class="river">
              <h1 class="titles">城区主要河道水质监测结果汇总表</h1>
              <div  class="river float">
                 <div  style="height:60%">
                  <v-chart :options="optioncod" :autoresize="true" style="width:100%;display:inline-block;"></v-chart>
                </div>
                 <div style="height:60%">
                  <v-chart :options="optionsad" :autoresize="true" style="width:100%;display:inline-block;"></v-chart>
                </div>
                 <div style="height:60%">
                  <v-chart :options="optionszl" :autoresize="true" style="width:100%;display:inline-block;"></v-chart>
                </div>
              </div>
                <table-page
                :columns="columns" 
                :tableData="tableData" 
                :pageParams="pageParams"
                @get-page="getPage"
                @get-size="getSize"> </table-page>
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

import {  TablePage } from "@/components";
@Component({
  components: {
    SucSelect,
    SucInput,
    SucButton,
    SucDatePicker,
    TablePage,
  },
})

export default class ReportSelect extends Vue {
  zdOptions: any = []; //站点数组
  typeOpt: SelectOptions = [];
  model: boolean = false;

  uploadHeaders:any = {"Authorization":'bearer ' + localStorage.getItem("refresh-token")}
  codData:any=[];
  adData:any=[];
  zlData:any=[];
  report: any = {
    date: new Date(),
  };
  loading: boolean = false;
  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  title: any = "";
  //  列表显示
  tableData: any = [];
  onloadParams: any = {
    yearmonth: "",
    pageNumber:'',
    pageSize:''
  };
  toggle(val: boolean) {
    this.model = val;
  }

  PicSuccess(file: any) {
    console.log("--",file);
  }
  
  get optioncod() {
   return{
     title: {
        text: 'COD指标评价',
        left: 'center',
        top: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
         label: {
            show: true, //饼图上的数据是否展示true展示false不展示
            formatter: "{b}"+" "+"{c}"+"条" 
          },
          data:this.codData
        }
      ]
    };
  }
  get optionsad() {
    return{
     title: {
        text: '氨氮指标评价',
        left: 'center',
        top: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true, //饼图上的数据是否展示true展示false不展示
            formatter: "{b}"+" "+"{c}"+"条" 
          },
          data:this.adData
        }
      ]
    };
  }
   get optionszl() {
    return{
     title: {
        text: '总磷指标评价',
        left: 'center',
        top: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true, //饼图上的数据是否展示true展示false不展示
            formatter: "{b}"+" "+"{c}"+"条" 
          },
          data:this.zlData
        }
      ]
    };
  }
  mounted() {
    this.getonPageData(); //表单数据
    this.getevaluateData();//饼图
  }

  //  导出表格
  exportExcel() {
    // location.href="/api/wjServer/qushui/export?date=" +this.$utils.dateFormat(new Date(this.report.date), "yyyy-MM")
      let url ="/api/wjServer/paishui/riverSz/export?yearmonth=" +
      this.$utils.dateFormat(new Date(this.report.date), "yyyy.MM") 
      window.location.href = url; //原窗口打开
      window.open(url); // 重新打开新窗口
  }
  
  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "河道（断面）",
      key: "section",
    },
    {
      title: "采样日期",
      key: "cytime",
    },
    {
      title: "化学需氧量",
      key: "hxxyl",
    },
    {
      title: "COD指标评价",
      key: "codevaluate",
    },
    {
      title: "氨氮",
      key: "ad",
    },
    {
      title: "氨氮指标评价",
      key: "adevaluate",
    },
    {
      title: "总磷",
      key: "zl",
    },
    {
      title: "总磷指标评价",
      key: "zlevaluate",
    },
  ];
   onSearch(val: string) {
    this.loading = true;
    this.pageParams.current = 1;
    // this.pageParams.pageSize = 10;
    this.onloadParams.riverName = val;
    this.getonPageData();
    this.getevaluateData();
  }

   async getonPageData() {
    // this.onloadParams = {
    //   pageNumber:this.onloadParams.current,
    //   pageSize:this.onloadParams.pageSize,
    //   yearmonth: this.$utils.dateFormat(new Date(this.report.date), "yyyy.MM"), 
    // };
    // const url = "wjServer/paishui/riverSz/infoList";
    // publicApi.getWithParam(url, this.onloadParams).then((data: any) => {
    //   if (data.result == true) {
    //     this.tableData = data.data.rows;
    //   } 
    //   else {
    //     this.tableData = [];
    //   }
    // });
    this.onloadParams.pageNumber = this.pageParams.current;
    this.onloadParams.pageSize = this.pageParams.pageSize;
    this.onloadParams.yearmonth=this.$utils.dateFormat(new Date(this.report.date), "yyyy.MM");
    let url = "wjServer/paishui/riverSz/infoList";
    let data = await publicApi.getWithParam(url, this.onloadParams);
    this.pageParams.total = parseInt(data.data.total);
    this.tableData = data.data.rows;
    this.loading = false;
  }
  getPage(page: any) {
    this.loading = true;
    this.pageParams.current = page;
    this.getonPageData();
  }
  getSize(size: any) {
    this.loading = true;
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
    this.getonPageData();
  }
 
   async getevaluateData(){
    this.codData=[];
    this.adData=[];
    this.zlData=[];
    this.onloadParams = {
     yearmonth: this.$utils.dateFormat(new Date(this.report.date), "yyyy.MM"),
    };
    const burl='wjServer/paishui/riverSz/evaluates';
    const bdata= await publicApi.getWithParam(burl, this.onloadParams);   
    if (bdata.result == true) {
        this.codData=bdata.data.codList//接口获取cod饼图数据
        this.adData=bdata.data.adList//接口获取氨氮饼图数据
        this.zlData=bdata.data.zlList//接口获取总磷饼图数据
        for (let i = 0; i <this.zlData.length; i++) {
          this.zlData.value=this.zlData[i].value
          console.log(this.zlData.name)
        }
    }else{
    this.$Message.error("获取数据失败");
    }
  }
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
@import "@/styles/commonVariables.scss";
.float{
  display: flex;
}
.float div{
  flex: 1;
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
        height: 75%;
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

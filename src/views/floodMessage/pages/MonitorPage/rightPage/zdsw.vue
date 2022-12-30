<template>
  <!-- 重点水位 -->
  <div class="monitor-view">
    <div class="monitor-item">
      <suc-select
          v-model="tableParams.area"
          :options="areaOptions"
          style="width: 200px;margin-right:5px;margin-top:2px"
          :config="{ placeholder: '乡镇', clearable: true }"
        >
        </suc-select>
      <search-component
        placeholderTxt="请输入站点名称"
        @input="getInput"
      ></search-component>
      <div class="ic" @click="zksq">
        <span v-if="!seen">展开</span> 
        <span v-if="seen">收起</span> 
      </div>
    </div>
    <div class="table-item" v-show="!seen">
      <table-page
        :tableData="tableData"
        :columns="columns"
        :customHeight='630'
        :tableRowClassName="tableRowClassName"
        :pageParams="pageParams"
        @getPage="getPage"
        @getSize="getSize"
      >
      </table-page>
    </div>
	<div class="hover-table" v-show="seen" >
		<table-page
			ref="hovertable"
			:columns="hoverColumns"
			:tableData="tableData"
			:pageParams="pageParams"
			:customHeight="630"
			@get-page="getPage"
			@get-size="getSize"
			@row-click="rowClick"
			:tableRowClassName="tableRowClassName"
		>
		</table-page>
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
  Watch
} from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import { SearchComponent, TableComponent } from "@/components";
import { TablePage } from "@/components";
import { publicApi } from "@/api";
import {SucInput,SucSelect} from "@suc/ui"

@Component({
  components: {
    SearchComponent,
    TableComponent,
    TablePage,
    SucInput,
    SucSelect
  }
})
export default class zdsw extends Vue {
  @State netWork: any;
  @Mutation setRightToggle: any;
  @Mutation setTabTable: any;
  seen: boolean = false;
  areaOptions: any = [];

  onenter() {
    this.seen = true;
  }
  onleave() {
    this.seen = false;
  }

  rowParams: any = {};
  rowClick(row: any) {
    this.rowParams = {};
    this.$nextTick(() => {
      this.rowParams = row;
    });
    this.$emit("rowEvents", row);
  }
  tableData:any = [];
  columns: any = [
    {
      title: "序号",
      type: "index"
    },
    {
      title: "站点名称",
      key: "stnm",
    },
    {
      title: "实时水位(m)",
      key: "rZ",
    },
  ];
  hoverColumns: any[] = [
	  {
      title: "序号",
      type: "index"
    },
    {
      title: "站点名称",
      key: "stnm",
      width: 120
    },
    {
      title: "监测河道",
      key: "hdnm",
    },
    {
      title: "八点水位(m)",
      key: "bdZ",
    },
    {
      title: "警戒水位(m)",
      key: "warnZ",
    },
    {
      title: "实时水位(m)",
      key: "rZ",
    },
	
	{
      title: "最新数据时间",
      key: "tm",
      width:'150'
    },
	// {
    //   title: "今日雨量",
    //   key: "yl3hour",
    // },
	// {
    //   title: "昨日雨量",
    //   key: "yl6hour",
    // },
	// {
    //   title: "本月雨量",
    //   key: "yl12hour",
    // },
  ]
  tableRowClassName({ row }: any) {
  }
  getToggle() {
    this.netWork.rightToggle = !this.netWork.rightToggle;
    this.setRightToggle(this.netWork.rightToggle);
  }
  @Emit()
  enterTable() {}
  @Emit()
  leaveTable() {}
  mounted() {
    this.getTableData();
    this.getBb()

  }
  pq: string = ''
  // 监测点表格数据
  pageParams: any = {
    current: 1,
    total: 0,
    pageSize: 30
  };
  tableParams: any = {
    pageNumber: 1,
    pageSize: 30,
    stnm: "",
    area:'全区主要河道'
  };
  originData: any = []
  async getTableData() {
    let that = this;
    let url = "wjServer/fangxunjc/z/dtHome"
    that.tableParams.pageNumber = that.pageParams.current;
    that.tableParams.pageSize = that.pageParams.pageSize;
    const data = await publicApi.getWithParam(url,that.tableParams);
    that.pageParams.total = parseInt(data.data.total);
    that.tableData = data.data.rows;
  }
  // 搜索
  getInput(val: any) {
    this.tableParams.stnm = val;
    this.$emit("getParams",this.tableParams)
    this.getTableData();
  }

  getPage(page: any){
    this.pageParams.current = page;
    this.getTableData()
  }
  getSize(size: any){
    this.pageParams.current = 1
    this.pageParams.pageSize = size;
    this.getTableData()
  }

  zksq(){
    this.seen = !this.seen
  }

  async getBb() {
    let url = "wjServer/fangxunjc/z/areas";
    let data = await publicApi.getNoParam(url);
    this.areaOptions = data.data.map((e: any) => {
      let item = {
        value: e.key,
        label: e.value,
      };
      return item;
    });
  }

}
</script>
<style lang="scss">
.table-view {
  .el-table .warning-row {
    color: #ff5a47;
  }
  .el-table .gray-row {
    color: #999;
  }
}
</style>
<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";
.monitor-view {
  width: 100%;
  height: 100%;
  padding: 15px;
  .monitor-item {
    padding: 0 14px 14px 0;
    &:first-of-type{
      display: flex;
      flex-wrap: nowrap;
    }
    .ic{
      width: 6%;
      float: right;
      margin-left: 5px;
      color: cornflowerblue;
      text-align: right;
      font-family: initial;
      cursor: pointer;
      user-select: none
    }
  }
  .table-item {
	padding-right: 0;
	// height: calc(100% - 106px);
  }
  .hover-table {
        // height: calc(100% - 140px);
        position: absolute;
        top: 195px;
        left: 25px;
        z-index: 9999;
        background-color: #ffffff;
        pointer-events: auto;
        cursor: pointer;
      }
  .flex-class {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
}
</style>

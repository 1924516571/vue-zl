<template>
  <!-- 企业绑定水表弹框 -->
  <el-dialog :append-to-body="true" :title="title" :visible.sync="model" :close-on-click-modal="true" :before-close="onCancel">
    <div class="content">
            <j-table
                :tableData="tableData"
                :pageParams="pageParams"
                @get-page="getPage"
                v-loading="loading"
                @get-size="getSize"
            >
            <template v-slot:column >
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="companyname" label="取水单位名称" width="120"></el-table-column>
                <template>
                    <el-table-column label="1月">
                        <el-table-column prop="janwater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="2月">
                        <el-table-column prop="febwater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="3月">
                        <el-table-column prop="marwater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="1季度开票">
                        <el-table-column prop="firquarterwater" label="1季度水量"></el-table-column>
                        <el-table-column prop="firquarterszyfee" label="水资源费"></el-table-column>
                        <el-table-column prop="firquarterengfee" label="工程水费"></el-table-column>
                    </el-table-column>
                    <el-table-column label="4月">
                        <el-table-column prop="aprwater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="5月">
                        <el-table-column prop="maywater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="6月">
                        <el-table-column prop="junwater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="2季度开票">
                        <el-table-column prop="secquarterwater" label="1季度水量"></el-table-column>
                        <el-table-column prop="secquarterszyfee" label="水资源费"></el-table-column>
                        <el-table-column prop="secquarterengfee" label="工程水费"></el-table-column>
                    </el-table-column>
                    <el-table-column label="7月">
                        <el-table-column prop="julwater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="8月">
                        <el-table-column prop="augwater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="9月">
                        <el-table-column prop="sepwater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="3季度开票">
                        <el-table-column prop="thrquarterwater" label="1季度水量"></el-table-column>
                        <el-table-column prop="thrquarterszyfee" label="水资源费"></el-table-column>
                        <el-table-column prop="thrquarterengfee" label="工程水费"></el-table-column>
                    </el-table-column>
                    <el-table-column label="10月">
                        <el-table-column prop="octwater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="11月">
                        <el-table-column prop="novwater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="12月">
                        <el-table-column prop="decwater" label="抄表水量"></el-table-column>
                    </el-table-column>
                    <el-table-column label="4季度开票">
                        <el-table-column prop="fourquarterwater" label="1季度水量"></el-table-column>
                        <el-table-column prop="fourquarterszyfee" label="水资源费"></el-table-column>
                        <el-table-column prop="fourquarterengfee" label="工程水费"></el-table-column>
                    </el-table-column>
                </template>
                    
                
            </template>
          
        </j-table>
      </div>
    <div slot="footer">
      <el-button @click="onCancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import {  JTable } from "@/components";
import { publicApi } from "@/api";

@Component({
  components: {
    JTable
  },
})
export default class PlanModal extends Vue {
  tsShow:any = false;
  tableData:any = [];
  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  tableParams: any = {
    pageNumber: "",
    pageSize: "",
  };
  loading: boolean = false;
  @Prop() title!: string;
  @Prop() model!: boolean; //控制弹框显隐
  @Prop()cs!: any; 
  @Emit()
  async onSubmit() {}
  @Emit()
  toggle(val: boolean) {
    return val;
  }

  async onpage() {
    this.tableParams.pageNumber = this.pageParams.current;
    this.tableParams.pageSize = this.pageParams.pageSize;
    this.tableParams.yearUuid =  this.cs
    let url = "wjServer/szszy/fee/page";
    let data = await publicApi.getWithParam(url, this.tableParams);
    this.pageParams.total = parseInt(data.data.total);
    this.tableData = data.data.rows;
    this.loading = false;
  }

  getPage(page: any) {
    this.loading = true;
    this.pageParams.current = page;
    this.onpage();
  }
  getSize(size: any) {
    this.loading = true;
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;

    this.onpage();
  }
  
  // 取消的时候将表单值置位空
  onCancel() {
    this.toggle(false);
  }

  @Watch('cs')
  get(){
    this.onpage()

  }

}
</script>
<style lang="scss">
.table-view {
  .el-table .warning-row {
    color: #ff5a47;
  }
 
}
</style>
<style lang="scss" scoped>

$deep: "::v-deep";
::v-deep.el-dialog__wrapper {
  .el-dialog {
    .el-dialog__header {
      background-color: #5993fa;
    }
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
    .el-dialog__body {
      height: 520px !important;
      overflow-y: auto;
    }
    .el-dialog__footer {
      border-top: 1px solid #e8eaec;
    }
  }
}
.content {
      height: calc(100%);
      border-top: 1px solid #dde4eb;
      .link-text {
        color: #5397ff;
        cursor: pointer;
      }
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
.ts{
  color: #ff5a47;
}
::v-deep.suc-select {
  .ivu-select-selection .ivu-select-selected-value {
    font-size: 13px;
    color: #606266;
  }
}

::v-deep.el-table .warning-row{
  background: rgb(233, 77, 49);
}

::v-deep.el-input--small .el-input__inner {
  margin: 3px 0;
}
::v-deep .upload-demo {
  .el-upload-list .el-upload-list--picture {
    .el-upload-list__item {
      width: 300px;
    }
  }
}
</style>

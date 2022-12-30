<template>
  <!-- 企业绑定水表弹框 -->
  <el-dialog :append-to-body="true" :title="title" :visible.sync="model" :close-on-click-modal="true" :before-close="onCancel">
    <div class="content">
          <!-- key很关键用于解决组件复用带来的表头渲染问题！！！！ -->
            <j-table
                :key="tableRefresh"   
                :tableData="uploadData"
                :showPage='false'
                :tableRowClassName='tableRowClassName'
            >
            <template v-slot:column >
                <el-table-column prop="id" label="序号"></el-table-column>
                <el-table-column prop="year" label="年度" width="50"></el-table-column>
                <el-table-column prop="dwmc" label="单位名称" width="280"></el-table-column>
                <template v-if="activeIndex == 0">
                    <el-table-column prop="ysjhh" label="用水企业编号"></el-table-column>
                    <el-table-column label="计划用水量（吨）">
                        <el-table-column prop="nZilaishui" label="自来水"></el-table-column>
                        <el-table-column prop="nDbshui" label="地表水"></el-table-column>
                        <el-table-column prop="nDxshui" label="地下水"></el-table-column>
                    </el-table-column>
                </template>
                <template v-if="activeIndex == 1">
                    <el-table-column prop="ssxz" label="所属乡镇" width="150"></el-table-column>
                    <el-table-column label="计划用水量（m3）">
                    <el-table-column label="第一季度" width="120">
                        <el-table-column prop="jhYjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jhYjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jhYjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第二季度" width="120">
                        <el-table-column prop="jhEjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jhEjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jhEjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第三季度" width="120">
                        <el-table-column prop="jhSjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jhSjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jhSjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第四季度" width="120">
                        <el-table-column prop="jhFjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jhFjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jhFjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    </el-table-column>
                    <el-table-column label="实际用水量（m3）">
                    <el-table-column  label="第一季度" width="120">
                        <el-table-column prop="sjYjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="sjYjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="sjYjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第二季度" width="120">
                        <el-table-column prop="sjEjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="sjEjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="sjEjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第三季度" width="120">
                        <el-table-column prop="sjSjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="sjSjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="sjSjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第四季度" width="120">
                        <el-table-column prop="sjFjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="sjFjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="sjFjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    </el-table-column>
                    <el-table-column label="节超用水量（m3）">
                    <el-table-column label="第一季度" width="120">
                        <el-table-column prop="jcYjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jcYjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jcYjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第二季度" width="120">
                        <el-table-column prop="jcEjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jcEjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jcEjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第三季度" width="120">
                        <el-table-column prop="jcJcdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jcJcdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jcJcdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第四季度" width="120">
                        <el-table-column prop="jcFjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jcFjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jcFjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    </el-table-column>
                    <el-table-column prop="bz" label="备注" width="120"></el-table-column>
                </template>
            </template>
          
        </j-table>
        <div class="ts" v-if="tsShow">标红数据为重复数据,请修改Excel后重新导入!</div>
      </div>
    <div slot="footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onOk()" :disabled="tsShow">确 定</el-button>
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
  tableRefresh:any = 0;
  tsShow:any = false;
  @Prop() title!: string;
  @Prop() model!: boolean; //控制弹框显隐
  @Prop()activeIndex!: any; 
  @Prop()uploadData!: any; 
  @Emit()
  async onSubmit() {}
  @Emit()
  toggle(val: boolean) {
    return val;
  }
  onOk() {
    var url = ''
    if (this.activeIndex == 0) {
      url = 'wjServer/szszy/rpaln/addPlanInfo'
    }
    else{
      url = 'wjServer/szszy/rpaln/addJxkhInfo'
    }
    publicApi.postWithParamJson(url,this.uploadData).then((data:any)=>{
      console.log("090909",data);
      if (!data.result) {
        this.uploadData = []
        this.uploadData = data.data
        for (let i = 0; i < data.data.length; i++) {
          this.tableRowClassName({row:data.data[i],rowIndex:Number(data.data[i].id)-1})
          this.refresh()
        }
        this.tsShow = true;
      }
      else{
        this.onSubmit();
      }
    })
  }
  // 取消的时候将表单值置位空
  onCancel() {
    this.tsShow = false;
    this.toggle(false);
  }

  mounted() {
  }

  @Watch('activeIndex')
  refresh(){
    console.log("321");
    
      this.tableRefresh++
  }

  tableRowClassName(row: any){
    console.log("ii",row);
    
    if (row.row.flag) {
      return 'warning-row'
    }
    return ''
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

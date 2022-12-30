<template  >
  <!-- 测评弹框-->
  <el-dialog :title="title" :visible.sync="model2" close-on-click-modal:false :before-close="onCancel" v-if="model2" >
    <el-form :model="formParams1" ref="mzcpForm" label-width="auto" size="small">
      <div class="table">
        <table-no :columns="columns" customHeight="560" :tableData="formParams1.results" v-loading="loading" ></table-no>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button  class="btn" type="primary" :loading="loading" @click="exportExcel()">导 出</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { SucModal, SucForm, SucFormItem, SucInput, SucButton,SucSelect  } from "@suc/ui";
import { TableNo } from "@/components";
@Component({
  components: {
    SucModal,
    SucForm,
    SucFormItem,
    SucInput,
    SucButton,
    SucSelect,
    TableNo
  },
})
export default class CreateYsdw extends Vue {
  @Prop() title!: string;
  @Prop() btnFlag!: string;
  @Prop() loading!: boolean; //控制加载
  @Prop() model2!: boolean; //控制弹框显隐
  @Prop({ type: Object, default: () => {} })
  @Prop() formParams1!: any; 
  // cprParams:any = this.formParams
  @Emit()
  async onSubmit() {}
  @Emit()
  toggle(val: boolean) {
    return val;
  }
  columns: any[] = [
      {
        title: "人员姓名",
        key: "realName",
      },
      {
        title: "员工评分",
        key: "scorePersonnel",
      },
      {
        title: "领导评分",
        key: "scoreLeader",
      },
      {
        title: "综合评分",
        key: "score",
      },
    ];
    
     //  导出表格
  exportExcel() {
    console.log(this.formParams1)
    let url =
      "/api/wjServer/oa/appraisal/exportResult?appraisaluuid=" +
      this.formParams1.appraisalUuid 
    window.location.href = url; //原窗口打开
    window.open(url); // 重新打开新窗口
  
  }
  
  onCancel() {
    this.toggle(false);
  }
  
}
</script>
<style lang="scss" scoped>
// $deep:"::v-deep";
.btn{
  font-size: 20px;
  margin-right: 35%;
  margin-top: 10px;
  padding: 20px 100px;
}
.evaluation{
  float:right;
  margin-top: 5%;
  margin-right: 8%;
}
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
      height: 100%;
      padding:30px 20px 0 20px;
      overflow-y: auto;
    }
    .el-dialog__footer {
      border-top: 1px solid #e8eaec;
    }
  }
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

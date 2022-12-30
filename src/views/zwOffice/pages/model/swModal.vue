<template>
  <el-dialog
    :title="title"
    :visible.sync="model"
    close-on-click-modal:false
    :before-close="onCancel"
    v-if="model"
  >
    <table-no
          :columns="columns"
          :tableData="formParams"
        >
        </table-no>

    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { TablePage, TableNo } from "@/components";

import { infoApi, publicApi } from "@/api";
// import { Form } from "element-ui";
@Component({
  components: {
    TableNo
  },
})
export default class FileModal extends Vue {
  
  @Prop() title!: string;
  @Prop() loading!: boolean; //控制加载
  @Prop() model!: boolean; //控制弹框显隐
  @Prop() formParams!: any; //新增接口需要的参数
  @Emit()
  toggle(val: boolean) {
    return val;
  }

  onCancel() {
    this.toggle(false);
  }

  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "收文部门",
      key: "depName",
    },
    {
      title: "收文时间",
      key: "cstime",
    },
    {
      title: "状态",
      key: "jsstatus",
    },
  ];
}
</script>
<style lang="scss" scoped>
// $deep:"::v-deep";
::v-deep.el-dialog__wrapper {
  .el-dialog {
    width: 800px;
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
      height: 500px;
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
</style>

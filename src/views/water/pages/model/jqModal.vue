<template>
  <!-- 企业绑定水表弹框 -->
  <el-dialog
    :append-to-body="true"
    :title="title"
    :visible.sync="model"
    :close-on-click-modal="true"
    :before-close="onCancel"
  >
    <el-form
      class="form"
      :model="formParams"
      ref="jqForm"
      label-width="auto"
      size="small"
    >
      <div>
        <el-form-item label="项目名称:">
          <suc-input
            v-model="formParams.xmmc"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="申报年份:">
          <suc-date-picker
            v-model="formParams.nf"
            :options="{
              type: 'year',
              clearable: true,
              placeholder: '选择时间',
            }"
            style="width: 100%"
          ></suc-date-picker>
        </el-form-item>
        <el-form-item label="联系方式:">
          <suc-input
            v-model="formParams.tel"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="投资金额:">
          <suc-input
            v-model="formParams.tzje"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="补助金额:">
          <suc-input
            v-model="formParams.bzje"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onOk()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import {
  SucModal,
  SucForm,
  SucFormItem,
  SucInput,
  SucSelect,
  SucDatePicker,
} from "@suc/ui";

@Component({
  components: {
    SucModal,
    SucForm,
    SucFormItem,
    SucInput,
    SucSelect,
    SucDatePicker,
  },
})
export default class ZtModal extends Vue {
  @Prop() title!: string;
  @Prop() model!: boolean; //控制弹框显隐
  @Prop({ type: Object, default: () => {} })
  formParams!: any; //新增接口需要的参数
  @Emit()
  async onSubmit() {}
  @Emit()
  toggle(val: boolean) {
    return val;
  }
  onOk() {
    (this.$refs["jqForm"] as any).validate((valid: any) => {
      if (valid) {
        this.onSubmit();
      } else {
        return false;
      }
    });
  }
  // 取消的时候将表单值置位空
  onCancel() {
    this.toggle(false);
    (this.$refs["jqForm"] as any).resetFields();
  }

  mounted() {}
}
</script>
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
      height: 260px !important;
      overflow-y: auto;
    }
    .el-dialog__footer {
      border-top: 1px solid #e8eaec;
    }
  }
}

::v-deep.suc-select {
  .ivu-select-selection .ivu-select-selected-value {
    font-size: 13px;
    color: #606266;
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
.form {
  display: flex;
  div {
    flex: 1;
    margin-right: 5px;
  }
}
</style>

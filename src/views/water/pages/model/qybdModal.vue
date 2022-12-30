<template>
  <!-- 企业绑定水表弹框 -->
  <el-dialog :append-to-body="true" :title="title" :visible.sync="model1" :close-on-click-modal="true" :before-close="onCancel">
    <el-form :model="formParams1" ref="qyForm" label-width="auto" size="small">
      <el-form-item label="水源类型:">
        <suc-select v-model="formParams1.sytype" :options="waterOptions" :config="{ placeholder: '水源类型', clearable: true }" style="width:100%"></suc-select>
      </el-form-item>
      <el-form-item label="用水单位名称:">
        <suc-input v-model="formParams1.companyName" style="width:100%;" placeholder="请输入"></suc-input>
      </el-form-item>
      <el-form-item label="用水计划号:">
        <suc-input v-model="formParams1.companyId" style="width:100%;" placeholder="请输入"></suc-input>
      </el-form-item>
      <el-form-item label="自来水户标号:">
        <suc-input v-model="formParams1.meterId" style="width:100%;" placeholder="请输入"></suc-input>
      </el-form-item>
      <el-form-item label="水表名称、地址:">
        <suc-input v-model="formParams1.remark" style="width:100%;" placeholder="例如：常州轻工职业技术学院（母表）"></suc-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onOk()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import { SucModal, SucForm, SucFormItem, SucInput, SucSelect, SucDatePicker } from "@suc/ui";
import { waterType } from "@/constants/status";

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
export default class QybdModal extends Vue {
  waterOptions: any = waterType; //水源
  @Prop() title!: string;
  @Prop() model1!: boolean; //控制弹框显隐
  @Prop({ type: Object, default: () => {} })
  formParams1!: any; //新增接口需要的参数
  @Emit()
  async onSubmit() {}
  @Emit()
  toggle1(val: boolean) {
    return val;
  }
  onOk() {
    (this.$refs["qyForm"] as any).validate((valid: any) => {
      if (valid) {
        this.onSubmit();
      } else {
        return false;
      }
    });
  }
  // 取消的时候将表单值置位空
  onCancel() {
    this.toggle1(false);
    (this.$refs["qyForm"] as any).resetFields();
  }

  mounted() {
  }
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
      height: 320px !important;
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
</style>

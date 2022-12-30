<template>
  <!-- 执法人员设备 -->
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
      ref="ztForm"
      label-width="auto"
      size="small"
    >
      <div>
        <el-form-item label="姓名:" v-if="activeIndex == 0">
          <suc-input
            v-model="formParams.name"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="联系方式:" v-if="activeIndex == 0">
          <suc-input
            v-model="formParams.tel"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="巡查人员:" v-if="activeIndex == 0">
          <suc-input
            v-model="formParams.xcry"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="装备种类:" v-if="activeIndex == 1">
          <suc-select
            v-model="formParams.zblx"
            :options="zbTypeOptions"
            :config="{
              clearable: true,
              placeholder: '装备种类',
            }"
            style="width: 100%"
          >
          </suc-select>
        </el-form-item>
        <el-form-item label="品牌及型号:" v-if="activeIndex == 1">
          <suc-input
            v-model="formParams.ppjxh"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="所属乡镇:" v-if="activeIndex == 1">
          <suc-input
            v-model="formParams.ssxz"
            style="width: 100%"
            placeholder="请输入"
            disabled
          ></suc-input>
        </el-form-item>
        <el-form-item label="持有人（负责人）:" v-if="activeIndex == 1">
          <suc-input
            v-model="formParams.cyr"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="备注:">
          <suc-input
            v-model="formParams.bz"
            style="width: 100%"
            placeholder="请输入"
            type="textarea"
          ></suc-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="执法证件编号:" v-if="activeIndex == 0">
          <suc-input
            v-model="formParams.zfzjbh"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="所属单位:" v-if="activeIndex == 0">
          <suc-input
            v-model="formParams.ssdw"
            style="width: 100%"
            disabled
          ></suc-input>
        </el-form-item>
        <el-form-item label="装备名称:" v-if="activeIndex == 1">
          <suc-input
            v-model="formParams.zbmc"
            style="width: 100%"
          ></suc-input>
        </el-form-item>
        <el-form-item label="数量:" v-if="activeIndex == 1">
          <suc-input
            v-model="formParams.num"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="所属队伍:" v-if="activeIndex == 1">
          <suc-input
            v-model="formParams.ssdw"
            style="width: 100%"
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
import { publicApi } from "@/api";
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
export default class ZfsbModal extends Vue {
  zbTypeOptions: any = [
    {label:'电脑',value:'电脑'},
    {label:'汽车',value:'汽车'},
    {label:'相机',value:'相机'},
    {label:'笔',value:'笔'},
    {label:'电器',value:'电器'},
    {label:'测距仪',value:'测距仪'},
  ];
  zbmc:any = '';
  @Prop() title!: string;
  @Prop() activeIndex!: string;
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
    (this.$refs["ztForm"] as any).validate((valid: any) => {
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
    (this.$refs["ztForm"] as any).resetFields();
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
.form {
  display: flex;
  div {
    flex: 1;
    margin-right: 5px;
  }
}
</style>

<template>
  <!-- 提升泵站弹框-->
  <el-dialog :title="title" :visible.sync="model" close-on-click-modal:false :before-close="onCancel" v-if="model">
    <el-form :model="formParams" :rules="rules" ref="psqyForm" label-width="auto" size="small">
      <el-form-item label="工程名称">
        <el-input v-model="formParams.mc"></el-input>
      </el-form-item>
      <el-form-item label="工程地点">
        <el-input v-model="formParams.dz"></el-input>
      </el-form-item>
      <el-form-item label="总投资">
        <el-input v-model="formParams.ztz"></el-input>
      </el-form-item>
      <el-form-item label="建设单位">
        <el-input v-model="formParams.zsdw"></el-input>
      </el-form-item>
       <el-form-item label="建设单位现场代表">
        <el-input v-model="formParams.zsdwxcdb"></el-input>
      </el-form-item>
      <el-form-item label="建设单位代表电话">
        <el-input v-model="formParams.zsdwdbdh"></el-input>
      </el-form-item>
      <el-form-item label="监理单位">
        <el-input v-model="formParams.jldw"></el-input>
      </el-form-item>
      <el-form-item label="总监">
        <el-input v-model="formParams.zj"></el-input>
      </el-form-item>
      <el-form-item label="总监联系电话">
        <el-input v-model="formParams.zjdh"></el-input>
      </el-form-item>
      <el-form-item label="监理工程师">
        <el-input v-model="formParams.jlgcs"></el-input>
      </el-form-item>
      <el-form-item label="监理工程师联系电话">
        <el-input v-model="formParams.jlgcsdh "></el-input>
      </el-form-item>
      <el-form-item label="设计单位">
        <el-input v-model="formParams.sjdw"></el-input>
      </el-form-item>
      <el-form-item label="设计单位联系人">
        <el-input v-model="formParams.sjdwlxr"></el-input>
      </el-form-item>
      <el-form-item label="设计单位联系人电话">
        <el-input v-model="formParams.sjdwdh"></el-input>
      </el-form-item>
      <el-form-item label="审计单位">
        <el-input v-model="formParams.shjdw"></el-input>
      </el-form-item>
      <el-form-item label="审计单位联系人">
        <el-input v-model="formParams.shjdwlxr"></el-input>
      </el-form-item>
       <el-form-item label="审计单位联系人电话">
        <el-input v-model="formParams.shjdwdh"></el-input>
      </el-form-item>
      <el-form-item label="施工单位">
        <el-input v-model="formParams.sgdw"></el-input>
      </el-form-item>
      <el-form-item label="项目经理">
        <el-input v-model="formParams.xmjl"></el-input>
      </el-form-item>
      <el-form-item label="项目经理电话">
        <el-input v-model="formParams.xmjldh"></el-input>
      </el-form-item>
      <el-form-item label="施工负责人">
        <el-input v-model="formParams.sgfzr"></el-input>
      </el-form-item>
      <el-form-item label="施工负责人电话">
        <el-input v-model="formParams.sgfzrdh"></el-input>
      </el-form-item>
      <el-form-item label="合同造价">
        <el-input v-model="formParams.htzj"></el-input>
      </el-form-item>
      <el-form-item label="签订日期">
        <el-input v-model="formParams.qdrq"></el-input>
      </el-form-item>
      <el-form-item label="开工日期">
        <el-input v-model="formParams.kgrq"></el-input>
      </el-form-item>
      <el-form-item label="竣工日期">
        <el-input v-model="formParams.jgrq"></el-input>
      </el-form-item>
      <el-form-item label="开工日期">
        <el-input v-model="formParams.kgrq"></el-input>
      </el-form-item>
      <el-form-item label="竣工日期">
        <el-input v-model="formParams.jgrq"></el-input>
      </el-form-item>
      <el-form-item label="质监部门">
        <el-input v-model="formParams.zjbm"></el-input>
      </el-form-item>
      <el-form-item label="质监部门">
        <el-input v-model="formParams.zjbm"></el-input>
      </el-form-item>
      <el-form-item label="建设手续">
        <el-input v-model="formParams.jssx"></el-input>
      </el-form-item>
      <el-form-item label="现场代表">
        <el-input v-model="formParams.xcdb"></el-input>
      </el-form-item>


    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">关 闭</el-button>
      <!-- <el-button type="primary" :loading="loading" @click="onOk()">确 定</el-button> -->
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import { SucModal, SucForm, SucFormItem, SucInput, SucSelect } from "@suc/ui";
import { ModalConfig } from "@suc/ui/interfaces";
import { SelectOptions } from "@suc/ui/interfaces";
import { infoApi, publicApi } from "@/api";
import { coordinateTransform } from "@suc/monch";
import { LoadingCom } from "@/components";
// import { Form } from "element-ui";
import arrowPng from "@/assets/arrow.png";
const mapStore = namespace("mapStore");
@Component({
  components: {
    SucModal,
    SucForm,
    SucFormItem,
    SucInput,
    SucSelect,
    LoadingCom,
  },
})
export default class Wscl extends Vue {
  // @mapStore.State olMap: any
  // 接收父组件传过来的值
  rules = {
    gateCd: [
      { required: true, message: "请输入泵站编码", trigger: "blur" },
      { min: 0, max: 12, message: "长度在12个字符", trigger: "blur" },
    ],
    gateNm: [{ required: true, message: "请输入泵站名称", trigger: "blur" }],
  };

  @Prop() title!: string;
  @Prop() loading!: boolean; //控制加载
  @Prop() model!: boolean; //控制弹框显隐
  @Prop({ type: Object, default: () => {} })
  formParams!: any; //新增接口需要的参数
  areaOptions: any = []; //行政区域数据
  riverLevelData: any = []; //河道等级数据

  @Emit()
  async onSubmit() {}
  @Emit()
  toggle(val: boolean) {
    return val;
  }

 

  onOk() {
    (this.$refs["psqyForm"] as any).validate((valid: any) => {
      if (valid) {
        this.onSubmit();
      } else {
        return false;
      }
    });
  }

  onCancel() {
    this.toggle(false);
    (this.$refs["psqyForm"] as any).resetFields();
  }
  async handleChange(value: any) {
    this.formParams.xzqq = value.toString();
  }

  
}
</script>
<style lang="scss" scoped>
// $deep:"::v-deep";
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
      height: 600px;
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

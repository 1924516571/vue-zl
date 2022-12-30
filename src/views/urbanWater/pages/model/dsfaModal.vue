<template>
  <!-- 污水泵站弹框-->
  <el-dialog :title="title" :visible.sync="model" close-on-click-modal:false :before-close="onCancel" v-if="model">
    <el-form :model="formParams" :rules="rules" ref="wsclForm" label-width="auto" size="small">
      <el-form-item label="方案描述">
        <el-input v-model="formParams.nt" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="监测河道">
        <el-input v-model="formParams.targetrivername"></el-input>
      </el-form-item>
      <el-form-item label="源头河道">
        <el-input v-model="formParams.sourcerivername"></el-input>
      </el-form-item>
      <el-form-item label="调水水量">
        <el-input v-model="formParams.waterp"></el-input>
      </el-form-item>
      <el-form-item label="调水时长">
        <el-input v-model="formParams.hour"></el-input>
      </el-form-item>
      <el-form-item label="调水后水质">
        <el-input v-model="formParams.afterwq"></el-input>
      </el-form-item>
      <!-- <el-form-item label="湿地面积（亩）">
        <el-input v-model="formParams.wetlandarea"></el-input>
      </el-form-item>
      <el-form-item label="中水回用（万吨/日）">
        <el-input v-model="formParams.reuse"></el-input>
      </el-form-item>
      <el-form-item label="中水回用备注">
        <el-input v-model="formParams.reusent"></el-input>
      </el-form-item>
      <el-form-item label="服务范围">
        <el-input v-model="formParams.range"></el-input>
      </el-form-item>
      <el-form-item label="服务面积（km2）">
        <el-input v-model="formParams.servicearea"></el-input>
      </el-form-item>
      <el-form-item label="服务人口（万人）">
        <el-input v-model="formParams.servicenum"></el-input>
      </el-form-item>
      <el-form-item label="污泥去向">
        <el-input v-model="formParams.sludgeto"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="备注">
        <el-input type="textarea" v-model="formParams.nt" placeholder="请输入内容" ></el-input>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">关 闭</el-button>
      <!-- <el-button type="primary" :loading="loading" @click="onOk()">确 定</el-button> -->
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { SucModal, SucForm, SucFormItem, SucInput, SucSelect } from "@suc/ui";
import { LoadingCom } from "@/components";
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
  @Prop() chuan!: any;
  rules = {
    gateCd: [
      { required: true, message: "请输入泵站编码", trigger: "blur" },
      { min: 0, max: 12, message: "长度在12个字符", trigger: "blur" },
    ],
    gateNm: [{ required: true, message: "请输入泵站名称", trigger: "blur" }],
    // warningSw: [{ required: true, message: "请输入警戒水位", trigger: "blur" }],
    // 穿梭框验证规则
    // areaCode: [{ required: true, message: "请选择区域", trigger: "change" }],
    // manholeDepth: [{ type: "number", message: "窨井必须为数字值", tigger: "blur" }],
    // waterDepth: [{ type: "number", message: "水深必须为数值", tigger: "blur" }],
  };
  // @Prop() dialogVisible!: boolean;    //测试

  @Prop() title!: string;
  @Prop() loading!: boolean; //控制加载
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
    (this.$refs["wsclForm"] as any).validate((valid: any) => {
      if (valid) {
        this.onSubmit();
      } else {
        return false;
      }
    });
  }

  onCancel() {
    this.toggle(false);
    (this.$refs["wsclForm"] as any).resetFields();
  }
  async handleChange(value: any) {
    this.formParams.xzqq = value.toString();
  }

  // 行政区域
  mounted() {
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

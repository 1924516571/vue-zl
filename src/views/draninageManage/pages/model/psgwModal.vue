<template>
  <!-- 提升泵站弹框-->
  <el-dialog :title="title" :visible.sync="model" close-on-click-modal:false :before-close="onCancel" v-if="model">
    <el-form :model="formParams" :rules="rules" ref="tsbzForm" label-width="auto" size="small">
      <el-form-item label="乡镇">
        <el-input v-model="formParams.areaname"></el-input>
      </el-form-item>
      <el-form-item label="片区">
        <el-input v-model="formParams.pq"></el-input>
      </el-form-item>
      <el-form-item label="路名">
        <el-input v-model="formParams.roadname"></el-input>
      </el-form-item>
      <el-form-item label="起点">
        <el-input v-model="formParams.start"></el-input>
      </el-form-item>
      <el-form-item label="终点">
        <el-input v-model="formParams.end"></el-input>
      </el-form-item>
      <el-form-item label="泵站">
        <el-input v-model="formParams.pumpname"></el-input> 
      </el-form-item>
       
      <el-form-item label="管径">
        <el-input v-model="formParams.pipediameter"></el-input>
      </el-form-item>
      <el-form-item label="管材">
        <el-input v-model="formParams.pipematerial"></el-input>
      </el-form-item>
      <el-form-item label="流态">
        <el-input v-model="formParams.flu"></el-input>
      </el-form-item>
      <el-form-item label="流制">
        <el-input v-model="formParams.flusys"></el-input>
      </el-form-item>
      <el-form-item label="累计完成长度(m)">
        <el-input v-model="formParams.length"></el-input>
      </el-form-item>
      <el-form-item label="施工方法">
        <el-input v-model="formParams.method"></el-input>
      </el-form-item>
      <el-form-item label="投资额(万元)">
        <el-input v-model="formParams.amount"></el-input>
      </el-form-item>
      <el-form-item label="建设单位">
        <el-input v-model="formParams.buildcom"></el-input>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="formParams.linkman"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="formParams.linktel"></el-input>
      </el-form-item>
      <el-form-item label="施工年份">
        <el-input v-model="formParams.year"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="formParams.nt" placeholder="请输入内容" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">关 闭</el-button>
      <el-button type="primary" v-if="title == '新增'" :loading="loading" @click="onOk()">确 定</el-button>
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
    (this.$refs["tsbzForm"] as any).validate((valid: any) => {
      if (valid) {
        this.onSubmit();
      } else {
        return false;
      }
    });
  }

  onCancel() {
    this.toggle(false);
    (this.$refs["tsbzForm"] as any).resetFields();
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

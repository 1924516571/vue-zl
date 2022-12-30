<template>
  <!-- 联系人弹框新增组件-->
  <el-dialog :title="title" :visible.sync="model" close-on-click-modal:false :before-close="onCancel" v-if="model">
    <el-form :model="formParam" :rules="rules" ref="yinjForm" label-width="auto" size="small">
      <!-- <el-form-item label="联系人名称" prop="rvCd">
        <el-input v-model="formParams.rvCd" :disabled="title == '新增' ? false : true"></el-input>
      </el-form-item> -->
      <el-form-item label="联系人名称：" prop="realname">
        <el-input v-model="formParam.realname"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="tel">
        <el-input v-model="formParam.tel"></el-input>
      </el-form-item>
      <el-form-item label="所属部门：" prop="departmentName">
        <el-select  v-model="formParam.departmentName"  style="width:100%;" placeholder="请选择" size="mini">
        <el-option v-for="item in Options"  :label="item.label" :value="item.label" :key="item.index"> </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="所属乡镇：" prop="area">
        <el-select  v-model="formParam.area"  style="width:100%;" placeholder="请选择" size="mini">
        <el-option v-for="item in xzOptions"  :label="item.label" :value="item.label" :key="item.index"> </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="备注：" prop="bz">
        <el-input type="textarea" v-model="formParam.remarks" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onOk()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import { SucModal, SucForm, SucFormItem, SucInput, SucSelect } from "@suc/ui";
import { LoadingCom } from "@/components";
import { publicApi } from "@/api";
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
export default class CreatePolluters1 extends Vue {
  // @mapStore.State olMap: any
  // 接收父组件传过来的值
  @Prop() chuan!: any;
  olMap = this.$getMapConfig();
  rules = {
    realname: [
      { required: true, message: "请输入联系人", trigger: "blur" },
    ],
    tel: [{ required: true, message: "请输入联系人手机号码", trigger: "blur" }],
    // departmentName: [{ required: true, message: "请选择所属部门", trigger: "blur" }],
    // area: [{ required: true, message: "请选择所属乡镇", trigger: "blur" }],
    // 穿梭框验证规则
    // xzqy: [{ required: true, message: "请选择区域", trigger: "change" }],
    // manholeDepth: [{ type: "number", message: "窨井必须为数字值", tigger: "blur" }],
    // waterDepth: [{ type: "number", message: "水深必须为数值", tigger: "blur" }],
  };
  // @Prop() dialogVisible!: boolean;    //测试

  @Prop() title: string|undefined; //  父组件传子组件的值
  @Prop() loading!: boolean; //控制加载
  @Prop() model!: boolean; //控制弹框显隐
  @Prop({ type: Object, default: () => {} })
  // formParams!: any; //新增接口需要的参数
  @Prop()
  formParam!: any;
  Options:any=''
  xzOption:any=[]
  xzOptions:any=''

  @Emit()
  async onSubmit() {}
  @Emit()
  toggle(val: boolean) {
    return val;
  }

  onOk() {
    (this.$refs["yinjForm"] as any).validate((valid: any) => {
      if (valid) {
        this.onSubmit();
      } else {
        return false;
      }
    });
  }
  onCancel() {
    this.toggle(false);
    (this.$refs["yinjForm"] as any).resetFields();
  }
  mounted() {
    this.getData();
    this.getxzData();
  }
  async getData() {
    const url = "wjBaseServer/system/department/getFullNames";
    const data = await publicApi.getNoParam(url);
    this.Options =data.data.map((e: any) => {
      return{
        value:e,
        label:e,
      }
    })
  } 
  async getxzData() {
    const url = "wjBaseServer/wj/town/getList";
    const data = await publicApi.getNoParam(url);
    for (let i = 0; i < data.data.length; i++) {
      this.xzOption.push(data.data[i].name)
      this.xzOptions =this.xzOption.map((e: any) => {
      return{
        value:e,
        label:e,
      }
    })
    }
    
  } 
}
</script>
<style lang="scss" scoped>
$deep:"::v-deep";
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
::v-deep .upload-demo {
  .el-upload-list .el-upload-list--picture {
    .el-upload-list__item {
      width: 300px;
    }
  }
}
</style>

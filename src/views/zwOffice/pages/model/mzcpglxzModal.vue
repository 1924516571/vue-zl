<template>
  <!-- 测评弹框-->
  <el-dialog :title="title" :visible.sync="modelxz" close-on-click-modal:false :before-close="onCancel" v-if="modelxz">
    <el-form :model="formParams" :rules="rules" ref="mzcpForm" label-width="auto" size="small">
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="formParams.startTime"
          type= 'date'
          placeholder='年-月-日'
          >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="formParams.endTime"
          type= 'date'
          placeholder='年-月-日'
          >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="formParams.nt" placeholder="请输入内容" style="width:70%" :rows="6"></el-input>
      </el-form-item>
      
      <el-form-item label="测评人">
        <el-input disabled="true" type="textarea" v-model="formParams.activeUserNames" style="width:70%;" :rows="6"></el-input>
        <el-button class="evaluation" type="primary" size="small" @click="oncpr(formParams.activeUserIds)">选择</el-button>
      </el-form-item>

      <el-form-item label="被测评人">
        <el-input disabled="true" type="textarea" v-model="formParams.passiveUserNames" style="width:70%;" :rows="6"></el-input>
        <el-button class="evaluation" type="primary" size="small" @click="onbcpr(formParams.passiveUserIds)">选择</el-button>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="onCancel">取 消</el-button> -->
      <el-button class="btn" type="primary" :loading="loading" @click="onOk()">提 交</el-button>
    </div>
    <cpr-modal title="测评人" :modelcpr="modelcpr" :cprParams="cprParams" @on-submit="cprcreate" @toggle1="toggle1" ></cpr-modal>
    <bcpr-modal title="被测评人" :modelbcpr="modelbcpr" :bcprParams="bcprParams" @on-submit="bcprcreate" @toggle1="toggle1" ></bcpr-modal>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { SucModal, SucForm, SucFormItem, SucInput, SucButton,SucSelect  } from "@suc/ui";
import  cprModal  from "./cprModal.vue";
import  bcprModal  from "./bcprModal.vue";

@Component({
  components: {
    SucModal,
    SucForm,
    SucFormItem,
    SucInput,
    SucButton,
    SucSelect,
    cprModal,
    bcprModal,
  },
})
export default class CreateYsdw extends Vue {
  modelcpr:any = false;
  modelbcpr:any = false;
  rules = {
    startTime:[{ required: true, message: "请选择开始时间", trigger: "blur" }],
    endTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
  };
  @Prop() title!: string;
  @Prop() btnFlag!: string;
  @Prop() loading!: boolean; //控制加载
  @Prop() modelxz!: boolean; //控制弹框显隐
  @Prop({ type: Object, default: () => {} })
  formParams!: any; //新增接口需要的参数
  cprParams:any=[];
  bcprParams:any=[];
  @Emit()
  async onSubmit() {}
  @Emit()
  toggle(val: boolean) {
    return val;
  }
  
  onOk() {
    (this.$refs["mzcpForm"] as any).validate((valid: any) => {
      if (valid) {
        this.onSubmit();
      } else {
        return false;
      }
    });  
  }

  onCancel() {
    this.toggle(false);
  }
  oncpr(cpruserIds: any){
    this.modelcpr = true
    this.cprParams=this.formParams
  }
  onbcpr(bcpruserIds: any){
    this.modelbcpr = true
    this.bcprParams=this.formParams

  }
  toggle1(val: boolean) {
    this.modelcpr = val;
    this.modelbcpr = val;
  }

  async cprcreate(val:any) {
    this.modelcpr = false;
    this.formParams.activeUserNames = [];
    this.formParams.activeUserIds = [];
    for (let i = 0; i < val.length; i++){
      this.formParams.activeUserNames.push(val[i].realname)
      this.formParams.activeUserIds.push(val[i].id)
    }
  }

  async bcprcreate(val:any) {
    this.modelbcpr = false;
    this.formParams.passiveUserIds = [];
    this.formParams.passiveUserNames = [];
    for (let i = 0; i < val.length; i++){
      this.formParams.passiveUserNames.push(val[i].realname)
      this.formParams.passiveUserIds.push(val[i].id)
    }
  }
}
</script>
<style lang="scss" scoped>
// $deep:"::v-deep";
.btn{
  font-size: 20px;
  margin-right: 38%;
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

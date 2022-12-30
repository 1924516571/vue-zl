<template>
  <!-- 水土保持弹框-->
  <el-dialog :title="title" :visible.sync="model" close-on-click-modal:false :before-close="onCancel" v-if="model">
    <el-form :model="formParams" ref="yinjForm" label-width="auto" size="small">
    <span style="font-size:20px;margin-left:60px; border-left:2px solid #5993fa; padding: 10px;">项目信息</span>
    <div style="display: flex; overflow-x: hidden;margin-top:30px ;">
      <span>
       <el-form-item label="核查项目名称：">
        <el-input style="width:300px;" placeholder="请输入内容" v-model="formParams.verprojectname" ></el-input>
      </el-form-item>
      <el-form-item label="乡镇：" >
        <el-input v-model="formParams.town" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="来源：">
        <el-input  v-model="formParams.source" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="发现年度：">
        <el-input v-model="formParams.year" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="核查联系人：">
        <el-input v-model="formParams.verlinkman" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="行业类型：">
        <el-input v-model="formParams.industrytype" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="建设状态：">
        <el-input v-model="formParams.buildstatus" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="位置：">
        <el-input v-model="formParams.address" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="建设单位：">
        <el-input v-model="formParams.buildcom" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="水保联系人：">
        <el-input v-model="formParams.climatelinkman" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="审批进展：">
        <el-input v-model="formParams.approvalprogress" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="审批名称：">
        <el-input v-model="formParams.approvalname" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="许可日期：">
        <el-input v-model="formParams.permissiondate" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
    </span>
     <span>
      <el-form-item label="许可文号：">
        <el-input v-model="formParams.permissionnum" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="方案类型：">
        <el-input v-model="formParams.programtype" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="方案编制单位：">
        <el-input v-model="formParams.programcompany" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="方案编制联系人：">
        <el-input v-model="formParams.programlinkman" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="防治责任范围（公顷）：">
        <el-input v-model="formParams.liabilityarea" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="齐方（万立方）：">
        <el-input v-model="formParams.qifang" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="水土保持总投资（万元）：">
        <el-input v-model="formParams.totalinvestment" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="补偿费（万元）：">
        <el-input v-model="formParams.compensation" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="监测进展：">
        <el-input v-model="formParams.monitorprogress" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="监测单位：">
        <el-input v-model="formParams.monitorcompany" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="自主验收进展：">
        <el-input v-model="formParams.acceptanceprogress" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="验收报告编制单位：">
        <el-input v-model="formParams.acceptancecompany" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="验收报告编制联系人：">
        <el-input v-model="formParams.acceptancelinkman" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
      </el-form-item>
     </span>
    </div>

    <span style="font-size:20px;margin-left:60px; border-left:2px solid #5993fa; padding: 10px;">进度填报</span>
     <el-form-item label="施工进度" style="padding-top:20px">
        <el-input v-model="formParams.buildprogress" placeholder="请输入内容" style="width:300px;"></el-input>
      </el-form-item>
      <div style="margin-left:100px">
        <!-- <div class="buttons">
          <span>方案：</span>
          <button>点击上传</button>
        </div>
        <div class="buttons">
          <span>附件：</span>
          <button>点击上传</button>
        </div> -->
        <div slot="footer" class="buttons" style="padding-left:30%">
          <button style="padding:20px 100px;font-size:18px" type="primary" :loading="loading" @click="onOk()">确 定</button>
        </div>
      </div>
    </el-form>
   
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import { SucModal, SucForm, SucFormItem, SucInput, SucSelect } from "@suc/ui";
const mapStore = namespace("mapStore");
@Component({
  components: { 
    SucModal, 
    SucForm,
    SucFormItem,
    SucInput,
    SucSelect,
  },
})
export default class CreatePolluters1 extends Vue {
  // @mapStore.State olMap: any
  // 接收父组件传过来的值
  @Prop() chuan!: any;
  olMap = this.$getMapConfig();

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
 
}
</script>
<style lang="scss" scoped>
// $deep:"::v-deep";

.buttons button{
  padding: 10px 40px;
  background-color: #5993fa;
  color: #fff;
  border-style: none;
  border-radius: 5px;
  margin: 10px 0;
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
      // width: 100%;
      overflow-y: auto;
    }
    .el-dialog__footer {
      border-top: 1px solid #e8eaec;
    }
   
  }
}

::v-deep.el-input--small .el-input__inner {
  margin: 1px 0;
  width:200px
}
::v-deep .upload-demo {
  .el-upload-list .el-upload-list--minIoFileList {
    .el-upload-list__item {
      width: 300px;
    }
  }
}
</style>

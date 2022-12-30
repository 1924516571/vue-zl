<template>
  <!-- 涉河监管弹框-->
  <el-dialog :title="title" :visible.sync="model" close-on-click-modal:false :before-close="onCancel" v-if="model">
    <el-form :model="formParams" ref="yinjForm" label-width="auto" size="small">
      <span style="font-size:20px;margin-left:60px; border-left:2px solid #5993fa; padding: 10px;">项目信息</span>
      <div style="display: flex; overflow-x: hidden;margin-top:30px ;">
        <span>
          <el-form-item label="项目名称：" prop="projectname">
            <el-input style="width:300px;" :rows="5" placeholder="请输入内容" v-model="formParams.projectname"></el-input>
          </el-form-item>
          <!-- :rows="5" 这个是在type="textarea" 生效-->
          <el-form-item label="工程规模：">
            <el-input v-model="formParams.projectscale" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="所在乡镇(街道):">
            <el-input v-model="formParams.street" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="涉及河道名称：">
            <el-input v-model="formParams.river" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="建设地点：">
            <el-input v-model="formParams.address" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="建设单位：">
            <el-input v-model="formParams.buildcompany" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model="formParams.buildlinkman" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="formParams.buildtel" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="上级主管：">
            <el-input v-model="formParams.manage" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model="formParams.managelinkman" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="formParams.managetel" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="报批建设阶段：">
            <el-input v-model="formParams.buildstep" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="洪评编制单位：">
            <el-input v-model="formParams.compilecompany" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model="formParams.compilelinkman" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="formParams.compiletel" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="审批建设方案：">
            <el-input v-model="formParams.plan" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="占用面积：">
            <el-input v-model="formParams.area" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
        </span>
        <span>
          <el-form-item label="占用长度：">
            <el-input v-model="formParams.length" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="许可单位：">
            <el-input v-model="formParams.permissioncompany" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="许可文号：">
            <el-input v-model="formParams.permissionnum" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="许可时间：">
            <el-input v-model="formParams.permissiondate" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="位置及界限报验情况：">
            <el-input v-model="formParams.adrsandcheck" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="报验时间：">
            <el-input v-model="formParams.checkdate" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="施工方案：">
            <el-input v-model="formParams.checkplan" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="备案时间：">
            <el-input v-model="formParams.recorddate" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="补偿河加固工程设计方案：">
            <el-input v-model="formParams.compenseplan" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="审查时间：">
            <el-input v-model="formParams.auditdate" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="项目进展：">
            <el-input v-model="formParams.projectprogress" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="巡查情况存在问题：">
            <el-input v-model="formParams.problem" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="拟处理意见：">
            <el-input v-model="formParams.opinion" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
          </el-form-item>
        </span>
      </div>
      <span style="font-size:20px;margin-left:60px; border-left:2px solid #5993fa; padding: 10px;">进度填报</span>

      <el-form-item label="施工进度" style="padding-top:20px">
        <el-input v-model="formParams.totalprogress" placeholder="请输入内容" style="width:300px;" :rows="5"></el-input>
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
$deep: "::v-deep";

.buttons button {
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
  width: 200px;
}
::v-deep .upload-demo {
  .el-upload-list .el-upload-list--minIoFileList {
    .el-upload-list__item {
      width: 300px;
    }
  }
}

</style>

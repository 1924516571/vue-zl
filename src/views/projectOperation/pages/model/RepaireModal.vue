<template>
  <!-- 堤防新增弹框 -->
  <div style="height:100%;width:100%">
    <el-dialog append-to-body :title="title" :visible.sync="model"  :before-close="onCancel">
      <el-form :model="formParams" :rules="rules" ref="yinjForm" label-width="auto" size="small">
        <el-form-item label="档案名称:" prop="name">
          <suc-input v-model="formParams.name" style="width:100%;" placeholder="请输入"></suc-input>
        </el-form-item>
        <el-form-item label="设备类型:">
          <suc-select v-model="formParams.engtype" :options="gcOptions" :config="{ placeholder: '设备类型', clearable: true }" style="width:100%"></suc-select>
        </el-form-item>
        <el-form-item label="设备名称:">
          <suc-input v-model="formParams.engname" style="width:100%;" placeholder="请输入"></suc-input>
        </el-form-item>
        <el-form-item label="处理人:">
          <suc-input v-model="user.realname" disabled style="width:100%;" placeholder="请输入"></suc-input>
        </el-form-item>
        <el-form-item label="处理单位:">
          <suc-input v-model="user.departmentName" disabled style="width:100%;" placeholder="请输入"></suc-input>
        </el-form-item>
        <el-form-item label="处理时间:">
          <el-date-picker v-model="formParams.solvedate" type="date" placeholder="选择日期"> </el-date-picker>
        </el-form-item>
        <el-form-item label="问题描述:">
          <suc-input v-model="formParams.problem" style="width:100%;" type="textarea" placeholder="请输入"></suc-input>
        </el-form-item>
        <el-form-item label="处理措施:">
          <suc-input v-model="formParams.solveplan" style="width:100%;" type="textarea" :rows="5" placeholder="请输入"></suc-input>
        </el-form-item>
        <el-form-item label="上传附件:">
          <el-upload
            class="upload-demo"
            ref="upload"
            :on-success="PicSuccess"
            action="api/wjBaseServer/minio/file/upload"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :on-preview="handlePreview"
            accept=".xls,.xlsx"
            :file-list="formParams.listUrl"
            size="small"
            :limit="1"
          >
            <el-button class="upload_btn" size="small" type="primary"><span class="iconfont icon-shangchuan"></span>点击上传</el-button>
            <div slot="tip" style="color:red" class="el-upload__tip">只能上传xls/xlsx文件,且不超过一个</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCancel('yinjForm')">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="onOk()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import { SucModal, SucForm, SucFormItem, SucInput, SucSelect, SucDatePicker, SucMessage } from "@suc/ui";
import { DatePickerOptions } from "@suc/ui/interfaces";
import { infoApi, publicApi } from "@/api";
import { coordinateTransform } from "@suc/monch";
import dayjs from "dayjs";
const mapStore = namespace("mapStore");
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
export default class CreatePolluters1 extends Vue {
  olMap = this.$getMapConfig();
  gcOptions: any = [];
  user: any = JSON.parse(localStorage.getItem("userInfo") || "");
  rules = {
    name: [{ required: true, message: "请输入档案名称", trigger: "blur" }],
  };
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
        this.formParams.solvedate = dayjs(this.formParams.solvedate).format("YYYY-MM-DD");
        this.formParams.solvecom = this.user.departmentName;
        this.formParams.solveman = this.user.realname;
        this.onSubmit();
      } else {
        this.$SucMessage.info("请补充信息");
        return false;
      }
    });
  }
  // 取消的时候将表单值置位空
  onCancel(params: any) {
    this.toggle(false);
    (this.$refs[params] as any).resetFields();
  }

  //   获取工程类型
  async getGc() {
    let url = "wjServer/engOperator/ops/engType";
    let data = await publicApi.getNoParam(url);
    this.gcOptions = data.data.map((e: any) => {
      let item = {
        value: e.value,
        label: e.key,
      };
      return item;
    });
  }

  mounted() {
    this.getGc(); //设备类型
  }

  // 上传成功的回调
  PicSuccess(file: any) {
    if (file.result) {
      this.$message.success("上传成功");
      this.formParams.minIoFileList.push({ fileName: file.data.object, fileId: file.data.fileId, fileType: file.data.fileType, oldName: file.data.oldName });
    } else {
      this.$message.error("上传失败");
    }
  }
  // 限制上传的数量
  handleExceed(files: any) {
    this.$message.warning("只能上传一个文件!");
  }
  // 预览文件
  handlePreview(file: any) {
    if (this.title == "新增") {
      const Imgurl = file.response.data.previewUrl;
      window.open(Imgurl);
    } else {
      const Imgurl = file.url;
      window.open(Imgurl);
    }
  }

  // 删除文件
  handleRemove(file: any, fileList: any) {
    console.log(file,"删除文件");
    
    var id: any = "";
    if (file.response.data.fileId) {
      id = file.response.data.fileId;
    } else {
      id = file.uid;
    }
    this.formParams.minIoFileList = this.formParams.minIoFileList.filter((item: any) => item.fileId != id); //从数组中删除对应的id
    this.$message.success('删除成功')
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
      height: 500px;
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

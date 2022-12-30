<template>
  <el-dialog
    :title="title"
    :visible.sync="model"
    class="scroll"
    close-on-click-modal:false
    :before-close="onCancel"
    v-if="model"
  >
    <el-form
      :model="formParams"
      ref="zqxForm"
      label-width="auto"
      size="small"
      class="form"
    >
      <div class="bfContent">
        <div>
          <el-form-item label="公文类别：">
            <suc-select
              :disabled="title == '详情'"
              v-model="formParams.filetype"
              :options="typeOptions"
              :config="{
                clearable: true,
                filterable: true,
              }"
              style="width: 100%"
            >
            </suc-select>
          </el-form-item>

          <el-form-item label="公文文号：">
            <suc-select
              :disabled="title == '详情'"
              v-model="formParams.fileXiala"
              :options="gwOptions"
              :config="{
                clearable: true,
                filterable: true,
              }"
              style="width: 40%"
            >
            </suc-select>
            （<el-input
              :disabled="title == '详情'"
              style="width: 20%"
              v-model="formParams.fileYear"
            ></el-input>
            ）<el-input
              :disabled="title == '详情'"
              style="width: 20%"
              v-model="formParams.filenumber"
            ></el-input
            >号
          </el-form-item>
          <el-form-item label="关键词：">
            <el-input
              :disabled="title == '详情'"
              v-model="formParams.keyword"
            ></el-input>
          </el-form-item>
          <el-form-item label="发文部门：">
            <el-input
              :disabled="title == '详情'"
              v-model="formParams.fwbm"
            ></el-input>
          </el-form-item>
          <el-form-item label="文件上传：" prop="imgPath1">
            <el-upload
              class="upload-demo"
              :on-success="PicSuccess"
              action="api/wjBaseServer/minio/file/upload"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :before-upload="beforeUpload"
              :on-exceed="handleExceed"
              :file-list="formParams.imgList"
              list-type="picture"
              :size="small"
            >
              <el-button size="small" type="primary" :disabled="title == '详情'"
                >点击上传</el-button
              >
              <!-- <div slot="tip" class="el-upload__tip">请上传PDF文件</div> -->
            </el-upload>
          </el-form-item>

          <el-form-item label="附件上传：">
            <el-upload
              class="upload-demo"
              :on-success="PicSuccess1"
              action="api/wjBaseServer/minio/file/uploadFujian"
              :on-remove="handleRemove1"
              :on-preview="handlePreview"
              :before-upload="beforeUpload"
              :on-exceed="handleExceed"
              :file-list="formParams.imgList1"
              list-type="picture"
              :size="small"
            >
              <el-button size="small" type="primary" :disabled="title == '详情'"
                >点击上传</el-button
              >
              <!-- <div slot="tip" class="el-upload__tip">请上传PDF文件</div> -->
            </el-upload>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="标题：">
            <el-input
              v-model="formParams.title"
              :disabled="title == '详情'"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择日期：">
            <suc-date-picker
              :disabled="title == '详情'"
              v-model="formParams.yftime"
              :options="{
                type: 'date',
                clearable: true,
                placeholder: '请选择日期',
              }"
              style="width: 100%"
            ></suc-date-picker>
          </el-form-item>
          <el-form-item label="收文部门：">
            <suc-select
              :disabled="title == '详情'"
              v-model="formParams.departmentList"
              :options="swOptions"
              :config="{
                clearable: true,
                multiple: true,
              }"
              style="width: 100%"
            >
            </suc-select>
          </el-form-item>

          <el-form-item label="短信通知：">
            <suc-select
              :disabled="title == '详情'"
              v-model="formParams.userList"
              :options="ryOptions"
              @on-change="formChangeList"
              :config="{
                clearable: true,
                multiple: true,
              }"
              style="width: 100%"
            >
            </suc-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              :disabled="title == '详情'"
              v-model="formParams.remark"
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button
        v-if="title != '详情'"
        type="primary"
        :loading="loading"
        @click="onOk()"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import {
  SucModal,
  SucForm,
  SucFormItem,
  SucInput,
  SucSelect,
  SucDatePicker,
} from "@suc/ui";
import { infoApi, publicApi } from "@/api";
import { LoadingCom } from "@/components";
// import { Form } from "element-ui";
@Component({
  components: {
    SucModal,
    SucForm,
    SucFormItem,
    SucInput,
    SucSelect,
    LoadingCom,
    SucDatePicker,
  },
})
export default class ZbModal extends Vue {
  bbOptions: any = [];
  typeOptions: any = [];
  ryOptions: any = [];
  swOptions: any = [];
  gwOptions: any = [];
  areaOptions: any = [];

  // rules = {
  //   department: [{ required: true, message: "请选择科室", trigger: "change" }],
  //   // dutyer: [{ required: true, message: "请选择值班人员", trigger: "change" }],
  // };
  @Prop() title!: string;
  @Prop() loading!: boolean; //控制加载
  @Prop() model!: boolean; //控制弹框显隐
  @Prop({ type: Object, default: () => {} }) formParams!: any; //新增接口需要的参数
  @Emit()
  async onSubmit() {}
  @Emit()
  toggle(val: boolean) {
    return val;
  }

  PicSuccess(file: any) {
    this.formParams.minIoFileList.push({
      fileName: file.data.object,
      fileId: file.data.fileId,
      fileType: file.data.fileType,
      oldName: file.data.oldName,
      bucket: file.data.bucket,
    });
  }

  PicSuccess1(file: any) {
    this.formParams.fujianList.push({
      fileName: file.data.object,
      fileId: file.data.fileId,
      fileType: file.data.fileType,
      oldName: file.data.oldName,
      bucket: file.data.bucket,
    });
  }

  handlePreview(file: any) {
    const Imgurl = file.response.data.previewUrl;
    window.open(Imgurl);
  }

  handleRemove(file: any, fileList: any) {
    var id: any = "";
    if (file.response.data.fileId) {
      id = file.response.data.fileId;
    } else {
      id = file.uid;
    }
    this.formParams.minIoFileList = this.formParams.minIoFileList.filter(
      (item: any) => item.fileId != id
    );
  }

  handleRemove1(file: any, fileList: any) {
    var id: any = "";
    if (file.response.data.fileId) {
      id = file.response.data.fileId;
    } else {
      id = file.uid;
    }
    this.formParams.fujianList = this.formParams.fujianList.filter(
      (item: any) => item.fileId != id
    );
  }

  onOk() {
    (this.$refs["zqxForm"] as any).validate((valid: any) => {
      if (valid) {
        this.onSubmit();
      } else {
        return false;
      }
    });
  }

  onCancel() {
    this.toggle(false);
    (this.$refs["zqxForm"] as any).resetFields();
  }
  async handleChange(value: any) {
    this.formParams.area = value.toString();
  }

  mounted() {
    this.getType();
    this.getRy();
    this.getSwbm();
    this.getGw();
  }

  //公文类型
  async getType() {
    let url = "wjServer/oa/sendfile/fileTypeList";
    let data = await publicApi.getNoParam(url);
    this.typeOptions = data.data.map((e: any) => {
      let item = {
        value: e.code,
        label: e.level,
      };
      return item;
    });
  }

  //人员
  async getRy() {
    let url = "wjBaseServer/system/user/userList";
    let data = await publicApi.postWithParam(url, { pageSize: 1000 });
    this.ryOptions = data.data.rows.map((e: any) => {
      let item = {
        value: e.id,
        label: e.realname,
      };
      return item;
    });
  }

  //收文部门
  async getSwbm() {
    let url = "wjBaseServer/system/department/queryTree";
    let data = await publicApi.postNoParam(url);
    this.swOptions = data.data.map((e: any) => {
      let item = {
        value: e.departmentId,
        label: e.fullName,
      };
      return item;
    });
  }

  //公文文号
  async getGw() {
    let url = "wjServer/oa/sendfile/fileNumberList";
    let data = await publicApi.getNoParam(url);
    this.gwOptions = data.data.map((e: any) => {
      let item = {
        value: e.code,
        label: e.level,
      };
      return item;
    });
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
      // height: 400px;
      min-height: 500px;
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

.form {
  h3 {
    width: 100%;
    text-align: center;
    margin: 15px 0;
  }
  .bfContent {
    display: flex;
    // border-bottom: 1px solid #eee;
    div {
      flex: 1;
      margin-right: 5px;
      padding: 0 5px;
    }
  }
  .title {
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
  }
}
</style>

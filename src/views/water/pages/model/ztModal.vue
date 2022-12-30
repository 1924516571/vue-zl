<template>
  <!-- 企业绑定水表弹框 -->
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
        <el-form-item label="所属乡镇:" v-if="activeIndex == 1">
          <suc-input
            v-model="formParams.town"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="所属乡镇:" v-if="activeIndex == 0">
          <suc-select
            v-model="formParams.town"
            :options="xzOptions"
            :config="{ placeholder: '选择乡镇', clearable: true }"
            style="width: 100%"
          ></suc-select>
        </el-form-item>
        <el-form-item label="最近水平衡测试时间:" v-if="activeIndex == 1">
          <suc-input
            v-model="formParams.zjcssj"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="公布节水型载体文件:" v-if="activeIndex == 1">
          <suc-input
            v-model="formParams.wj"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="所属类别:" v-if="activeIndex == 0">
          <suc-select
            v-model="formParams.sslb"
            :options="typeOptions"
            :config="{ placeholder: '选择类别', clearable: true }"
            style="width: 100%"
          ></suc-select>
        </el-form-item>
        <el-form-item label="通过时间:" v-if="activeIndex == 0">
          <suc-date-picker
              v-model="formParams.accessTime"
              :options="{
                type: 'month',
                clearable: true,
                placeholder: '选择时间',
              }"
              style="width: 100%"
            ></suc-date-picker>
        </el-form-item>
        <el-form-item label="是否节水型企业:" v-if="activeIndex == 0">
          <suc-select
            v-model="formParams.ifjieshui"
            :options="jsOptions"
            :config="{ clearable: true }"
            style="width: 100%"
          ></suc-select>
        </el-form-item>
        <el-form-item label="上传文件">
        <el-upload
          class="upload-demo"
          :on-success="PicSuccess"
          action="api/wjBaseServer/minio/file/upload"
          :on-remove="handleRemove"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :file-list="formParams.imgList"
          list-type="picture"
          :size="small"
          :limit="1"
        >
          <el-button class="upload_btn" size="small" type="primary"><span class="iconfont icon-shangchuan"></span>点击上传</el-button>
        </el-upload>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="单位名称:">
          <suc-input
            v-model="formParams.dwmc"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
       <el-form-item label="等级:" v-if="activeIndex == 0">
          <suc-select
            v-model="formParams.level"
            :options="levelOptions"
            :config="{ clearable: true }"
            style="width: 100%"
          ></suc-select>
        </el-form-item>
        <el-form-item label="等级:" v-if="activeIndex == 1">
          <suc-select
            v-model="formParams.level"
            :options="level1Options"
            :config="{ clearable: true }"
            style="width: 100%"
          ></suc-select>
        </el-form-item>
        <el-form-item label="创建年份:" v-if="activeIndex == 1">
          <suc-input
            v-model="formParams.cjnf"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="联系人及电话:" v-if="activeIndex == 1">
          <suc-input
            v-model="formParams.lxrjdh"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="备注:" v-if="activeIndex == 1">
          <suc-input
            type="textarea"
            v-model="formParams.bz"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="次数:" v-if="activeIndex == 0">
          <suc-input
            v-model="formParams.num"
            style="width: 100%"
            placeholder="请输入"
          ></suc-input>
        </el-form-item>
        <el-form-item label="年份:" v-if="activeIndex == 0">
          <suc-date-picker
              v-model="formParams.nf"
              :options="{
                type: 'month',
                clearable: true,
                placeholder: '选择时间',
              }"
              style="width: 100%"
            ></suc-date-picker>
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
import { waterType } from "@/constants/status";

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
export default class ZtModal extends Vue {
  xzOptions: any = [];
  typeOptions: any = [
    { label: "企业", value: "企业" },
    { label: "学校", value: "学校" },
    { label: "单位", value: "单位" },
  ];
  levelOptions: any = [
    { label: "一级", value: "一级" },
    { label: "二级", value: "二级" },
    { label: "三级", value: "三级" },
  ];
   level1Options: any = [
    { label: "国家级", value: "国家级" },
    { label: "省级", value: "省级" },
    { label: "市级", value: "市级" },
  ];
  jsOptions: any = [
    { label: "是", value: "是" },
    { label: "否", value: "否" },
  ];
  jsxztOptions: any = [
    { label: "企业", value: "企业" },
    { label: "学校", value: "学校" },
    { label: "单位", value: "单位" },
    { label: "灌区", value: "灌区" },
    { label: "社区", value: "社区" },
  ];
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

  PicSuccess(file: any) {
    this.formParams.minIoFileList.push({ fileName: file.data.object, fileId: file.data.fileId, fileType: file.data.fileType, oldName: file.data.oldName });
  }

  //限制上传图片的数量
  handleExceed(files: any) {
    this.$message.warning("只能上传一个文件!");
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
    this.formParams.minIoFileList = this.formParams.minIoFileList.filter((item: any) => item.fileId != id);
  }

  mounted() {
    this.getAreaData();
  }

  async getAreaData() {
    let url = "wjServer/szszy/carrier/townList";
    await publicApi.getNoParam(url).then((data: any) => {
      this.xzOptions = data.data.map((list: any) => {
        return {
          label: list.key,
          value: list.key,
        };
      });
    });
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
      height: 380px !important;
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

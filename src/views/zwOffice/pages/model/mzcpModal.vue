
<template>
  <!-- 测评弹框-->
  <el-dialog :title="title" :visible.sync="model" close-on-click-modal:false :before-close="onCancel" v-if="model">
    <el-form :model="formParams" ref="yinjForm" label-width="auto" size="small">
      <table-no
      :columns="columns"
      :tableData="tableData"
      v-loading="loading" 
      customHeight="560"
    >
      <template v-slot:scoreone="{ row }">
        <div class="block">
          <el-rate
            style="white-space: nowrap; border-right: 1px solide #999"
            v-model="row.scoreone"
            :show-text="true"
            :texts="texts"
          ></el-rate>
        </div>
      </template>
      <template v-slot:scoretwo="{ row }">
        <div class="block">
          <el-rate
            style="white-space: nowrap"
            v-model="row.scoretwo"
            :show-text="true"
            :texts="texts"
          ></el-rate>
        </div>
      </template>
      <template v-slot:scorethree="{ row }">
        <div class="block">
          <el-rate
            style="white-space: nowrap"
            v-model="row.scorethree"
            :show-text="true"
            :texts="texts"
          ></el-rate>
        </div>
      </template>
      <template v-slot:scorefour="{ row }">
        <div class="block">
          <el-rate
            style="white-space: nowrap"
            v-model="row.scorefour"
            :show-text="true"
            :texts="texts"
          ></el-rate>
        </div>
      </template>
      <template v-slot:scorefive="{ row }">
        <div class="block">
          <el-rate
            style="white-space: nowrap"
            v-model="row.scorefive"
            :show-text="true"
            :texts="texts"
          ></el-rate>
        </div>
      </template>
    </table-no>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="onCancel">取 消</el-button> -->
      <el-button class="btn" type="primary" :loading="loading" @click="onOk()">提 交</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { SucModal, SucForm, SucFormItem, SucInput, SucButton,SucSelect  } from "@suc/ui";
import { infoApi, publicApi } from "@/api";
import { TableNo } from "@/components";
@Component({
  components: {
    SucModal,
    SucForm,
    SucFormItem,
    SucInput,
    SucButton,
    SucSelect,
    TableNo,
  },
})
export default class CreateYsdw extends Vue {
  @Prop() title!: string;
  @Prop() btnFlag!: string;
  @Prop() loading!: boolean; //控制加载
  @Prop() model!: boolean; //控制弹框显隐
  @Prop() stationId!: any;
  @Prop({ type: Object, default: () => {} })
  formParams!: any; //返回的参数
  // colors: any = ["#5993fF","#5993fF","#5993fF"];
  texts:any=['1','2','3','4','5']
  tableData: any = [];
  @Emit()
  async onSubmit(tableData:any) {}
  @Emit()
  toggle(val: boolean) {
    return val;
  }
  @Watch("stationId")
  create() {
    this.getData();
  }
  onOk() {
    (this.$refs["yinjForm"] as any).validate((valid: any) => {
      if (valid) {
        this.onSubmit(this.tableData);
      } else {
        return false;
      }
    });  
  }

  onCancel() {
    this.toggle(false);
  }
  columns: any[] = [
    {
      type: "index",
      title: "序号",
      width: 50,
    },
    {
      title: "姓名",
      key: "passiveUserName",
      width: 100,
    },
    {
      title: "思想素质（分值五分）",
      key: "scoreone",
      slot: "scoreone",
    },
    {
      title: "工作能力（分值五分）",
      key: "scoretwo",
      slot: "scoretwo",
    },
    {
      title: "工作态度（分值五分）",
      key: "scorethree",
      slot: "scorethree",
    },
    {
      title: "工作效率（分值五分）",
      key: "scorefour",
      slot: "scorefour",
    },
    {
      title: "廉洁自律（分值五分）",
      key: "scorefive",
      slot: "scorefive",
    },
  ];
  tableParam: any = {
    appraisalUuid: "",
  };

  //   获取数据
  async getData() {
    let url = "wjServer/oa/appraisal/passiveList";
    this.tableParam.appraisalUuid = this.stationId;
    let data = await publicApi.getWithParam(url, this.tableParam);
    if (data.result == true) {
      this.tableData = data.data;
    } else {
      this.tableData = [];
      this.$SucMessage.error("获取失败");
    }
    this.loading = false;
  }
}
</script>
<style lang="scss" scoped>
// $deep:"::v-deep";
.btn{
  font-size: 20px;
  margin-right: 38%;
  margin-top: 10px;
  padding: 20px 100px;
}

::v-deep.el-dialog__wrapper {
  .el-dialog {
    width: 60%;
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
      height: 100%;
      padding:30px 20px 0 20px;
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

<template>
  <el-dialog
    :title="title"
    :visible.sync="model"
    close-on-click-modal:false
    :before-close="onCancel"
    v-if="model"
  >
    <table-page
          :columns="columns"
          :tableData="tableData"
          :pageParams="pageParams" 
          @get-page="getPage" 
          @get-size="getSize"
        >
        </table-page>

    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { TablePage } from "@/components";
import { publicApi } from "@/api";

@Component({
  components: {
    TablePage
  },
})
export default class GwpcModal extends Vue {
  
  @Prop() title!: string;
  @Prop() model!: boolean; //控制弹框显隐
  @Prop() formParams!: any; //新增接口需要的参数
  @Emit()
  toggle(val: boolean) {
    return val;
  }

  onCancel() {
    this.toggle(false);
  }
  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 20,
  };

  gwpcParams:any = {}

  tableData:any = []

    getPage(page: any) {
    this.pageParams.current = page;
    this.onpage();
  }
  getSize(size: any) {
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
    this.onpage();
  }
  columns: any[] = [
    {
      title: "片区",
      key: "pq",
    },
    {
      title: "道路名称",
      key: "roadname",
    },
    {
      title: "施工单位",
      key: "company",
    },
    {
      title: "检测长度(米)",
      key: "length",
    },
    {
      title: "修复数量(处)",
      key: "num",
    },
    {
      title: "修复方式",
      key: "type",
    },
    {
      title: "备注",
      key: "nt",
    },
  ];

    async onpage() {
        console.log("00456500",this.formParams);
        this.gwpcParams.pageNumber = this.pageParams.current;
        this.gwpcParams.pageSize = this.pageParams.pageSize;
        this.gwpcParams.range = this.formParams.range;
        this.gwpcParams.year = this.formParams.year;
        var url = "wjServer/paishui/repair/rangeDetail";
        await publicApi.getWithParam(url, this.gwpcParams).then((data: any) => {
        if (data.result == true) {
            this.tableData = data.data.rows;
            this.pageParams.total = parseInt(data.data.total);
        }
        });
    }

    
@Watch("formParams", { deep: true})
  getTableData() {
    console.log(this.formParams.range);
    
    if (this.formParams && this.formParams.range) {
      this.onpage();
    }
  }
}
</script>
<style lang="scss" scoped>
// $deep:"::v-deep";
::v-deep.el-dialog__wrapper {
  .el-dialog {
    width: 800px;
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
</style>

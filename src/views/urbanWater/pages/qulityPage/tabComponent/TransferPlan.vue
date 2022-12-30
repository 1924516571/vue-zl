<template>
  <!-- 调试方案 -->
  <div class="transfer-plan">
    <div class="top">
      <div class="top-item">
        <search-component @input="getSearch"></search-component>
      </div>
    </div>
    <div class="content">
      <table-component :columns="columns" :tableData="tableData"></table-component>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { TableComponent, SearchComponent } from "@/components";
import { State, Mutation, Action, namespace } from "vuex-class";
import { transferFaApi } from "@/api";
@Component({
  components: {
    TableComponent,
    SearchComponent,
  },
})
export default class TransferPlan extends Vue {
  @State waterQulity: any;
  columns: any[] = [
    {
      title: "序号",
      type: "index",
    },
    {
      title: "名称",
      key: "schemename",
    },
    {
      title: "调水目标",
      key: "targetrivername",
    },
    {
      title: "调水源头",
      key: "sourcerivername",
    },
    {
      title: "调水水量",
      key: "waterp",
    },
    {
      title: "调水路径",
      key: "path",
    },
    {
      title: "调水时长",
      key: "hour",
    },
    {
      title: "执行时间",
      key: "dotime",
    },
    {
      title: "调水说明",
      key: "nt",
    },
  ];
  tableData: any[] = [];
  // 获取方案列表
  faParams: any = {
    sectionId: "",
    schemename: "",
  };
  mounted() {
    this.getFaList();
  }
  async getFaList() {
    this.tableData = [];
    this.faParams.sectionId = this.waterQulity.qulity.sectionId;
    let url = "wjServer/waterENVIR/scheme/list";
    let data = await transferFaApi.getFaListById(url, this.faParams);
    if (data.result) {
      this.tableData = data.data;
    } else {
      this.$message({
        message: data.desc,
        type: "error",
      });
    }
    console.log(this.tableData);
  }
  // 搜索
  getSearch(val: string) {
    this.faParams.schemename = val;
    this.getFaList();
  }
}
</script>
<style lang="scss" scoped>
.transfer-plan {
  width: 100%;
  height: 100%;
  .top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  .content {
    height: calc(100% - 43px);
  }
}
</style>

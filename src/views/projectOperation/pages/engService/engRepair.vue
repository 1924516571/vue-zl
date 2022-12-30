<template>
  <!-- 维修档案 -->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
            <el-date-picker
              v-model="daterangeData"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              size="small"
              @change="dateChange"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="top-item-sub">
            <suc-select v-model="stationParams.engType" :options="gcOptions" style="width: 200px" :config="{ placeholder: '工程类型', clearable: true }" @on-change="onChange"> </suc-select>
          </div>
          <div class="top-item-sub">
            <search-component placeholderTxt="档案名称" @input="onSearch"> </search-component>
          </div>
          <div class="top-item-sub">
            <suc-button type="primary" :debounce="800" @on-click="onadd">填报</suc-button>
          </div>
        </div>
      </div>
      <div class="content">
        <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize">
          <template v-slot:operation="{ row }">
            <div class="btn">
              <span @click="onedit(row)">编辑</span>
              <span @click="ondelete(row)">删除</span>
            </div>
          </template>
        </table-page>
      </div>
    </div>
    <!-- 新增数据弹框 -->
    <repaire-modal :title="modalTitle" :model="model" @on-submit="oncreate" :loading="loading" :formParams="formParams" @toggle="toggle"></repaire-modal>
    <!-- 删除弹框 -->
    <div class="delete-view" v-show="delmodel">
      <delete-modal @getignore="cancel" @getsave="save" v-loading="delLoading"></delete-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucSelect, SucButton, SucInput, SucFormItem, SucMessage } from "@suc/ui";
import { SearchComponent, TablePage } from "@/components";
import { DeleteModal, ShjgModal, RepaireModal } from "../model";
import { infoApi, publicApi } from "@/api";
@Component({
  components: {
    SucSelect,
    SucButton,
    SucInput,
    SucFormItem,
    SearchComponent,
    TablePage,
    DeleteModal,
    ShjgModal,
    RepaireModal,
  },
})
export default class Enterprise extends Vue {
  daterangeData: any = [];
  olMap = this.$getMapConfig();
  modalTitle: string = ""; //弹窗标题
  loading: boolean = true;
  delLoading: boolean = false;
  btnFlag: string = ""; //区分编辑和新增
  tableData: any[] = [];
  gcOptions: any = [];
  formParams: any = {
    minIoFileList: [],
    // minIoFileList: [],
    // projectname: "",
    // projectscale: "",
    // river: "",
    // street: "",
    // address: "",
    // buildcompany: "",
    // buildlinkman: "",
    // buildtel: "",
    // implementcompany: "",
    // implementlinkman: "",
    // implementtel: "",
    // manage: "",
    // managelinkman: "",
    // managetel: "",
    // buildstep: "",
    // compilecompany: "",
    // compilelinkman: "",
    // compiletel: "",
    // plan: "",
    // area: "",
    // length: "",
    // permissioncompany: "",
    // adrsandcheck: "",
    // checkdate: "",
    // checkplan: "",
    // recorddate: "",
    // compenseplan: "",
    // auditdate: "",
    // projectprogress: "",
    // problem: "",
    // totalprogress: "",
    // opinion: "",
  };

  //   删
  delmodel: boolean = false;
  delParams: any = {};
  mounted() {
    this.onpage();
    this.getGc();
  }

  oncreate() {
    if (this.btnFlag == "add") {
      this.setCreate();
    } else if (this.btnFlag == "edit") {
      this.setEdit();
    }
    this.model = false;
  }
  async setCreate() {
    this.loading = true;
    let url = "wjServer/engOperator/ops";
    infoApi.oncreate(this.formParams, url).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("新增成功");
        this.model = false;
        this.loading = false;
      } else {
        this.$SucMessage.error("新增失败");
        this.model = false;
        this.loading = false;
      }
    });
    this.onpage();
  }
  // 新增
  onadd() {
    this.model = true;
    this.btnFlag = "add";
    this.modalTitle = "新增";
    this.formParams = {
      minIoFileList: [],
    };
  }
  dateChange(val: any) {
    if (val) {
      this.stationParams.startDate = val[0];
      this.stationParams.endDate = val[1];
    } else {
      this.stationParams.startDate = null;
      this.stationParams.endDate = null;
    }
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
  ondelete(row: any) {
    this.delmodel = true;
    this.delParams = {
      uuid: row.uuid,
    };
  }
  cancel(val: any) {
    this.delmodel = val;
  }

  async save() {
    this.delLoading = true;
    let url = "wjServer/engOperator/ops";
    infoApi.ondeleteWithParams(this.delParams, url).then((data: any) => {
      if (data.result == true) {
        this.delmodel = false;
        this.$SucMessage.info("删除成功");
        this.onpage();
        this.delLoading = false;
      } else {
        this.delLoading = false;
        this.$SucMessage.error("删除失败");
      }
    });
  }

  // 更新
  async setEdit() {
    this.loading = true;
    let url = "wjServer/engOperator/ops";
    infoApi.jsonUpdate(this.formParams, url).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info(data.desc);
        this.model = false;
        this.onpage();
        this.loading = false;
      } else {
        this.model = false;
        this.$SucMessage.error(data.desc);
        this.loading = false;
      }
    });

    this.onpage();
  }
  model: boolean = false;
  toggle(val: boolean) {
    this.model = val;
  }
  // 编辑
  onedit(row: any) {
    this.model = true;
    this.formParams = {
      minIoFileList: [],
    };
    this.btnFlag = "edit";
    this.modalTitle = "编辑";
    let uuid = row.uuid;
    this.editInfo(uuid);
  }
  // 详情
  async editInfo(uuidParams: any) {
    let url = "wjServer/engOperator/ops";
    let params = {
      uuid: uuidParams,
    };
    let data = await infoApi.getInfo(params, url);
    if (data.result == true) {
      //   this.formParams.rkdate = dayjs(Number(data.data.rkdate)).format("YYYY-MM-DD");
      // this.formParams = {
      //   projectname: data.data.projectname,
      //   projectscale: data.data.projectscale,
      //   river: data.data.river,
      //   street: data.data.street,
      //   permissiondate: data.data.permissiondate,
      //   address: data.data.address,
      //   buildcompany: data.data.buildcompany,
      //   buildlinkman: data.data.buildlinkman,
      //   totalprogress: data.data.totalprogress,
      //   uuid: data.data.uuid,
      //   areacode: data.data.areacode ? data.data.areacode.split(",") : [],
      // };
      this.formParams = data.data;
      if (data.data.minIoFileList.length != 0) {
        this.formParams.listUrl = data.data.minIoFileList.map((item: any) => {
          return {
            name: item.oldName,
            url: item.previewUrl,
          };
        });
      }
    } else {
      this.$SucMessage.error("获取详情失败");
    }
  }

  //   查
  columns: any[] = [
    {
      type: "index",
      title: "序号",
      width: 150,
    },
    {
      title: "档案名称",
      key: "name",
    },
    {
      title: "设施名称",
      key: "engname",
    },
    {
      title: "设施类型",
      key: "engtype",
    },
    {
      title: "问题描述",
      key: "problem",
    },
    {
      title: "处理时间",
      key: "solvedate",
    },
    {
      title: "处理人",
      key: "solveman",
    },
    {
      title: "处理单位",
      key: "solvecom",
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
    },
  ];

  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  pageYjParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  stationParams: any = {
    startDate: null,
    endDate: null,
    pageNumber: "",
    pageSize: "",
    engType: "",
    name: "",
  };

  // 列表
  async onpage() {
    this.stationParams.pageNumber = this.pageParams.current; //当前页码
    this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
    let url = "wjServer/engOperator/ops/page";
    let data = await publicApi.getWithParam(url, this.stationParams);
    if (data.result == true) {
      this.tableData = data.data.rows;
      this.pageParams.total = parseInt(data.data.total);
    } else {
      this.tableData = [];
      this.$SucMessage.error("获取失败");
    }
    this.loading = false;
  }
  getPage(page: any) {
    this.loading = true;
    this.pageParams.current = page;
    this.onpage();
  }
  getSize(size: any) {
    this.loading = true;
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
    this.onpage();
  }
  onSearch(val: string) {
    this.loading = true;
    this.pageParams.current = 1;
    this.stationParams.name = val;
    this.onpage();
  }
  onChange(val: any) {
    if (val === undefined) {
      this.stationParams.engType = "";
    }
  }
}
</script>
<style lang="scss" scoped>
.info {
  width: 100%;
  height: 100%;
  padding: 10px;
  position: relative;
  &-view {
    height: 100%;
    .top {
      padding: 15px;
      display: flex;
      justify-content: space-between;
      &-item {
        display: flex;
        &-sub {
          margin-right: 10px;
        }
      }
    }
    .content {
      height: calc(100% - 65px);
      border-top: 1px solid #dde4eb;
      .link-text {
        color: #5397ff;
        cursor: pointer;
      }
      .btn {
        color: #5397ff;
        cursor: pointer;
        span {
          display: inline-block;
          margin-right: 10px;
          &:nth-of-type(2) {
            color: #ff5a47;
          }
        }
      }
    }
  }
  .delete-view {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .el-progress {
    width: 100%;
  }
  .aa.el-progress-bar__inner {
    background-color: unset;
    background-image: linear-gradient(to right, #3587d8, #6855ff);
  }
}
</style>

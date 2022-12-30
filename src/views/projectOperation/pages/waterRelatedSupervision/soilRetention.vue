<template>
  <!-- 水土保持 -->
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
            <suc-select v-model="stationParams.town" :options="xzOptions" style="width: 200px" :config="{ placeholder: '所在乡镇', clearable: true }"> </suc-select>
          </div>
          <div class="top-item-sub">
            <suc-select v-model="stationParams.source" :options="lyOptions" style="width: 200px" :config="{ placeholder: '数据来源', clearable: true }"> </suc-select>
          </div>
          <div class="top-item-sub">
            <search-component placeholderTxt="项目名称" @input="onSearch"> </search-component>
          </div>
          <div class="top-item-sub">
            <suc-button type="success" @on-click="onDownTemplate">模板下载</suc-button>
          </div>
        </div>
        <div class="top-item">
          <el-upload
            type="success"
            style="margin-right: 10px;"
            size="small"
            :headers="uploadHeaders"
            :on-success="PicSuccess"
            action="api/wjServer/engOprt/climate/import"
            accept=".xls,.xlsx"
            :show-file-list="false"
          >
            <suc-button type="primary">导入</suc-button>
          </el-upload>
          <suc-button type="primary" :debounce="800" :config="{ ghost: true }" @on-click="dc">导出</suc-button>
        </div>
      </div>
      <div class="content">
        <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize">
          <template v-slot:approvalprogress="{ row }">
            <div>
              <span v-if="row.approvalprogress != ''">
                <el-progress :text-inside="true" :stroke-width="15" :percentage="Number(row.approvalprogress.replace(/%/g, ''))"></el-progress>
              </span>
            </div>
          </template>
          <template v-slot:buildprogress="{ row }">
            <div>
              <span v-if="row.buildprogress != ''">
                <el-progress :text-inside="true" :stroke-width="13" :percentage="Number(row.buildprogress.replace(/%/g, ''))"></el-progress>
              </span>
            </div>
          </template>
          <template v-slot:operation="{ row }">
            <div class="btn">
              <span @click="onedit(row)">编辑</span>
              <span @click="ondelete(row)">删除</span>
            </div>
          </template>
        </table-page>
      </div>
    </div>
    <!-- 修改数据弹框 -->
    <stbc-modal :title="modalTitle" :model="model" :loading="loading" :formParams="formParams" @on-submit="oncreate" @toggle="toggle" :chuan="chuan"></stbc-modal>
    <!-- 删除弹框 -->
    <div class="delete-view" v-show="delmodel">
      <delete-modal @getignore="cancel" @getsave="save" v-loading="delLoading"></delete-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucSelect, SucButton, SucInput, SucFormItem } from "@suc/ui";
import { SearchComponent, TablePage } from "@/components";
import { DeleteModal, StbcModal } from "../model";
import { infoApi, publicApi } from "@/api";
import { getType } from "../../../../api/apicture/river";
@Component({
  components: {
    SucSelect,
    SucButton,
    SucInput,
    SucFormItem,
    SearchComponent,
    TablePage,
    DeleteModal,
    StbcModal,
  },
})
export default class Enterprise extends Vue {
  daterangeData: any = "";
  olMap = this.$getMapConfig();
  // url: string = "wjServer/engOprt/climate";
  addvcd: any = "";
  modalTitle: string = ""; //弹窗标题
  loading: boolean = true;
  delLoading: boolean = false;
  btnFlag: string = ""; //区分编辑和新增
  tableData: any[] = [];
  xzOptions: any = [];
  lyOptions: any = [];
  chuan: any = [];

  formParams: any = {
    minIoFileList: [],
    verprojectname: "",
    town: "",
    source: "",
    permissiondate: "",
    address: "",
    buildcom: "",
    climatelinkman: "",
    approvalprogress: "",
    buildprogress: "",
    year: "",
    verlinkman: "",
    industrytype: "",
    buildstatus: "",
    approvalname: "",
    permissionnum: "",
    programtype: "",
    programcompany: "",
    programlinkman: "",
    liabilityarea: "",
    qifang: "",
    totalinvestment: "",
    compensation: "",
    monitorprogress: "",
    monitorcompany: "",
    acceptanceprogress: "",
    acceptancecompany: "",
    acceptancelinkman: "",
  };
  uploadHeaders: any = { Authorization: "bearer " + localStorage.getItem("refresh-token") };

  //   删
  delmodel: boolean = false;
  delParams: any = {}; //删除的参数
  PicSuccess(file: any) {
    if (file.result) {
      this.$SucMessage.success("导入成功");
    } else {
      this.$SucMessage.error("导入失败");
    }
    this.onpage();
  }
  markers: any[] = [];
  mounted() {
    this.onpage(); //获取页面信息
    this.getXz(); //获取所在乡镇
    this.getLy(); //获取来源
  }
  async oncreate() {
    this.model = false;
    this.setEdit();
  }

  dateChange(val: any) {
    if (val) {
      this.stationParams.permissionStartDate = val[0];
      this.stationParams.permissionEndDate = val[1];
    } else {
      this.stationParams.permissionStartDate = null;
      this.stationParams.permissionEndDate = null;
    }
  }

  async getXz() {
    let url = "wjServer/engOprt/climate/towns";
    let data = await publicApi.getNoParam(url);
    this.xzOptions = data.data.map((e: any) => {
      let item = {
        value: e.value,
        label: e.key,
      };
      return item;
    });
  }
  async getLy() {
    let url = "wjServer/engOprt/climate/source";
    let data = await publicApi.getNoParam(url);
    this.lyOptions = data.data.map((e: any) => {
      let item = {
        value: e.value,
        label: e.key,
      };
      return item;
    });
  }

  onDownTemplate() {
    location.href = "api/wjBaseServer/minio/file/downloadModel?fileName=水土保持.xls";
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
    let url = "wjServer/engOprt/climate";
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
    let url = "wjServer/engOprt/climate";
    // this.formParams.areacode = this.formParams.areacode.toString();
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
    this.formParams = {};
    this.btnFlag = "edit";
    this.modalTitle = "编辑";
    let uuid = row.uuid;
    this.editInfo(uuid);
  }
  // 详情
  async editInfo(uuidParams: any) {
    let url = "wjServer/engOprt/climate";
    let params = {
      uuid: uuidParams,
    };
    let data = await infoApi.getInfo(params, url);
    if (data.result == true) {
      //   this.formParams.rkdate = dayjs(Number(data.data.rkdate)).format("YYYY-MM-DD");
      // this.formParams = {
      //   verprojectname: data.data.verprojectname,
      //   town: data.data.town,
      //   source: data.data.source,
      //   permissiondate: data.data.permissiondate,
      //   address: data.data.address,
      //   buildcom: data.data.buildcom,
      //   climatelinkman: data.data.climatelinkman,
      //   approvalprogress: data.data.approvalprogress,
      //   buildprogress: data.data.buildprogress,
      //   uuid: data.data.uuid,
      //   areacode: data.data.areacode ? data.data.areacode.split(",") : [],
      // };
      this.formParams = data.data;
    } else {
      this.$SucMessage.error("获取失败");
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
      title: "核查项目名称",
      key: "verprojectname",
    },
    {
      title: "乡镇",
      key: "town",
    },
    {
      title: "来源",
      key: "source",
    },
    {
      title: "许可时间",
      key: "permissiondate",
    },
    {
      title: "位置",
      key: "address",
    },
    {
      title: "建设单位",
      key: "buildcom",
    },
    {
      title: "水保联系人",
      key: "climatelinkman",
    },
    {
      title: "审批进度",
      slot: "approvalprogress",
      // formatter: (e: any) => {
      //   console.log(e, "6666");
      //   return this.$utils.dateFormat(new Date(Number(e.createdate)), "yyyy-MM-dd HH:mm:ss");
      // },
    },
    {
      title: "施工进度",
      slot: "buildprogress",
      // key: "buildprogress",
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
    },
  ];
  dc() {
    location.href =
      "api/wjServer/engOprt/climate/export?permissionStartDate=" +
      this.stationParams.permissionStartDate +
      "&permissionEndDate=" +
      this.stationParams.permissionEndDate +
      "&town=" +
      this.stationParams.town +
      "&source=" +
      this.stationParams.source +
      "&source=" +
      this.stationParams.verProjectName;
  }

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
    pageNumber: "",
    pageSize: "",
    town: "",
    source: "",
    permissionStartDate: null,
    permissionEndDate: null,
    verProjectName: "",
  };

  // 列表
  async onpage() {
    this.stationParams.pageNumber = this.pageParams.current; //当前页码
    this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
    let url = "wjServer/engOprt/climate/page";
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
    this.stationParams.verProjectName = val;
    this.onpage();
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
}
</style>

<template>
  <!-- 涉河监管 -->
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
            <suc-select v-model="stationParams.projectScale" :options="gcOptions" style="width: 200px" :config="{ placeholder: '工程规模', clearable: true }"> </suc-select>
          </div>
          <div class="top-item-sub">
            <search-component placeholderTxt="项目名称" @input="onSearch"> </search-component>
          </div>
          <!-- <suc-button style="margin-right:15px" type="primary" :debounce="800" @on-click="downLoad"
            >模板下载</suc-button
          > -->
          <div class="top-item-sub">
            <suc-button type="success" @on-click="downLoad">模板下载</suc-button>
          </div>
        </div>
        <div class="top-item">
          <el-upload
            type="success"
            style="margin-right: 10px;"
            size="small"
            :headers="uploadHeaders"
            :on-success="PicSuccess"
            action="api/wjServer/engOprt/riverRegulatory/import"
            accept=".xls,.xlsx"
            :show-file-list="false"
          >
            <suc-button type="primary" :debounce="800">导入</suc-button>
          </el-upload>
          <suc-button type="primary" :debounce="800" :config="{ ghost: true }" @on-click="dc">导出</suc-button>
          
        </div>
      </div>
      <div class="content">
        <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize">
          <template v-slot:totalprogress="{ row }">
            <div v-if="row.totalprogress != ''">
              <el-progress type="line" :text-inside="true" class="aa" :stroke-width="13" :percentage="Number(row.totalprogress.replace(/%/g, ''))"></el-progress>
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
    <!-- 新增数据弹框 -->
    <shjg-modal :title="modalTitle" :model="model" @on-submit="setEdit" :loading="loading" :formParams="formParams" @toggle="toggle" :chuan="chuan"></shjg-modal>
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
import { DeleteModal, ShjgModal } from "../model";
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
  },
})
export default class Enterprise extends Vue {
  daterangeData: any = "";
  // customColor:any = "#67c23a";
  olMap = this.$getMapConfig();
  // url: string = "wjServer/engOprt/climate";
  addvcd: any = "";
  modalTitle: string = ""; //弹窗标题
  loading: boolean = true;
  delLoading: boolean = false;
  btnFlag: string = ""; //区分编辑和新增
  tableData: any[] = [];
  xzOptions: any = [];
  gcOptions: any = [];
  chuan: any = [];

  formParams: any = {
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
    this.getXz(); //所在乡镇信息
    this.getGc(); //工程信息
  }
  downLoad(){
    location.href = "api/wjBaseServer/minio/file/downloadModel?fileName=涉河监管.xls"
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
    let url = "wjServer/engOprt/riverRegulatory/street";
    let data = await publicApi.getNoParam(url);
    this.xzOptions = data.data.map((e: any) => {
      let item = {
        value: e.value,
        label: e.key,
      };
      return item;
    });
  }
  async getGc() {
    let url = "wjServer/engOprt/riverRegulatory/scales";
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
    let url = "wjServer/engOprt/riverRegulatory";
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
    let url = "wjServer/engOprt/riverRegulatory";
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
    let url = "wjServer/engOprt/riverRegulatory";
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
      title: "项目名称",
      key: "projectname",
    },
    {
      title: "工程规模",
      key: "projectscale",
    },
    {
      title: "涉及河道名称",
      key: "river",
    },
    {
      title: "所在乡镇(街道)",
      key: "street",
    },
    {
      title: "许可时间",
      key: "permissiondate",
    },
    {
      title: "建设地点",
      key: "address",
    },
    {
      title: "建设单位",
      key: "buildcompany",
    },
    {
      title: "联系人",
      key: "buildlinkman",
    },
    {
      title: "施工进度",
      slot: "totalprogress",
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
    },
  ];
  // 导出
  dc() {
    window.location.href =
      "api/wjServer/engOprt/riverRegulatory/export?permissionStartDate=" +
      this.stationParams.permissionStartDate +
      "&permissionEndDate=" +
      this.formParams.permissionEndDate +
      "&town" +
      this.stationParams.town +
      "&projectScale" +
      this.stationParams.projectScale +
      "&projectName" +
      this.stationParams.projectName;
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
    permissionStartDate: null,
    permissionEndDate: null,
    pageNumber: "",
    pageSize: "",
    town: "",
    projectScale: "",
  };

  // 列表
  async onpage() {
    this.stationParams.pageNumber = this.pageParams.current; //当前页码
    this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
    let url = "wjServer/engOprt/riverRegulatory/page";
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
    this.stationParams.projectName = val;
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
  .el-progress {
    width: 100%;
  }
  .aa.el-progress-bar__inner {
    background-color: unset;
    background-image: linear-gradient(to right, #3587d8, #6855ff);
  }
}
</style>

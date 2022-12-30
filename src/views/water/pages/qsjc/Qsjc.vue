<template>
  <!-- 取水监测 -->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
            <suc-select v-model="stationParams.areaName" :options="areaOptions" style="width: 200px" :config="{ placeholder: '请选择区域', clearable: true }"> </suc-select>
          </div>
          <div class="top-item-sub">
            <suc-select v-model="stationParams.qsType" :options="qsTypeList" style="width: 200px" :config="{ placeholder: '取水类型', clearable: true }" @on-change="onChange"> </suc-select>
          </div>
          <div class="top-item-sub">
            <suc-select v-model="stationParams.range" :options="qsNumber" style="width: 200px" :config="{ placeholder: '请选择年度取水量(万/m3)', clearable: true }"> </suc-select>
          </div>
          <div class="top-item-sub">
            <search-component placeholderTxt="企业名称" @input="onSearch"></search-component>
          </div>
          <!-- <div class="top-item-sub">
            <suc-button type="primary" :debounce="800" @on-click="onadd">填报</suc-button>
          </div> -->
        </div>
      </div>
      <div class="content">
        <!-- <vue-seamless-scroll :data="tableData" class="seamless-warp" :class-option="defaultOption"> -->
          <table-component :columns="columns" :tableData="tableData" v-loading="loading">
            <template v-slot:operation="{ row }">
              <div class="btn">
                <span @click="onedit(row)">历史数据</span>
                <!-- <span @click="ondelete(row)">删除</span> -->
              </div>
            </template>
          </table-component>
        <!-- </vue-seamless-scroll> -->
      </div>
    </div>
    <qsjc-modal :title="modalTitle" :model="model" :stationId="stationId" @on-submit="oncreate" :loading="loading" :formParams="formParams" @toggle="toggle"></qsjc-modal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucSelect, SucButton, SucInput, SucFormItem, SucMessage } from "@suc/ui";
import { SearchComponent, TablePage, TableComponent } from "@/components";
import { qsjcModal } from "../model";
import { infoApi, publicApi } from "@/api";
import vueSeamlessScroll from "vue-seamless-scroll";
import dayjs from "dayjs";
@Component({
  components: {
    SucSelect,
    SucButton,
    SucInput,
    SucFormItem,
    SearchComponent,
    TablePage,
    TableComponent,
    qsjcModal,
    vueSeamlessScroll,
  },
})
export default class Enterprise extends Vue {
  olMap = this.$getMapConfig();
  areaOptions: any = []; //区域
  qsTypeList: any = []; //取水类型
  qsNumber: any = []; //取水量
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
    this.getAreaLists(); //区域
    this.getQsType(); //取水类型
    this.getQsNumber(); //取水数量
  }
  // 监听属性 类似于data概念

  defaultOption() {
    return {
      step: 0.2, // 数值越大速度滚动越快
      limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
      hoverStop: true, // 是否开启鼠标悬停stop
      direction: 1, // 0向下 1向上 2向左 3向右
      openWatch: true, // 开启数据实时监控刷新dom
      singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
      singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
    };
  }
  // defaultOption: any = {
  //   step: 0.2, // 数值越大速度滚动越快
  //   limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
  //   hoverStop: true, // 是否开启鼠标悬停stop
  //   direction: 1, // 0向下 1向上 2向左 3向右
  //   openWatch: true, // 开启数据实时监控刷新dom
  //   singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
  //   singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
  //   waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
  // };

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
  //   onadd() {
  //     this.model = true;
  //     this.btnFlag = "add";
  //     this.modalTitle = "新增";
  //     this.formParams = {
  //       minIoFileList: [],
  //     };
  //   }

  //获取区域
  async getAreaLists() {
    let url = "wjServer/szszy/license/area";
    let data = await publicApi.getNoParam(url);
    if (data.result) {
      this.areaOptions = data.data.map((item: any) => {
        return {
          value: item.areaname,
          label: item.areaname,
        };
      });
    } else {
      this.$message.info("获取区域失败");
    }
  }

  //取水类型
  async getQsType() {
    let url = "wjServer/szszy/license/syType";
    let data = await publicApi.getNoParam(url);
    if (data.result) {
      this.qsTypeList = data.data.map((item: any) => {
        return {
          value: item.key,
          label: item.value,
        };
      });
    }
  }
  //   取水数量
  async getQsNumber() {
    let url = "wjServer/qushui/yearRange";
    let data = await publicApi.getNoParam(url);
    if (data.result) {
      this.qsNumber = data.data.map((item: any) => {
        return {
          value: item.key,
          label: item.value,
        };
      });
    }
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
  //   测站id
  stationId: any = "";
  // 编辑
  onedit(row: any) {
    this.model = true;
    this.modalTitle = "历史数据";
    if (row.stationId != "") {
      this.stationId = row.stationId;
    } else {
      this.$SucMessage.info("测站id为空");
    }

    //     this.formParams = {
    //       minIoFileList: [],
    //     };
    //     this.btnFlag = "edit";
    //     this.modalTitle = "编辑";
    //     let uuid = row.uuid;
    //     this.editInfo(uuid);
    //   }
    //   // 详情
    //   async editInfo(uuidParams: any) {
    //     let url = "wjServer/engOperator/ops";
    //     let params = {
    //       uuid: uuidParams,
    //     };
    //     let data = await infoApi.getInfo(params, url);
    //     if (data.result == true) {
    //       //   this.formParams.rkdate = dayjs(Number(data.data.rkdate)).format("YYYY-MM-DD");
    //       // this.formParams = {
    //       //   projectname: data.data.projectname,
    //       //   projectscale: data.data.projectscale,
    //       //   river: data.data.river,
    //       //   street: data.data.street,
    //       //   permissiondate: data.data.permissiondate,
    //       //   address: data.data.address,
    //       //   buildcompany: data.data.buildcompany,
    //       //   buildlinkman: data.data.buildlinkman,
    //       //   totalprogress: data.data.totalprogress,
    //       //   uuid: data.data.uuid,
    //       //   areacode: data.data.areacode ? data.data.areacode.split(",") : [],
    //       // };
    //       this.formParams = data.data;
    //       if (data.data.minIoFileList.length != 0) {
    //         this.formParams.listUrl = data.data.minIoFileList.map((item: any) => {
    //           return {
    //             name: item.oldName,
    //             url: item.previewUrl,
    //           };
    //         });
    //       }
    //     } else {
    //       this.$SucMessage.error("获取详情失败");
    //     }
  }

  columns: any[] = [
    {
      type: "index",
      title: "序号",
      width: 150,
    },
    {
      title: "区域",
      key: "areaName",
    },
    {
      title: "许可证号",
      key: "licensenum",
    },
    {
      title: "企业名称",
      key: "stationName",
      width: 200,
    },
    {
      title: "取水类型",
      key: "quType",
    },
    {
      title: "瞬时流量(m³)",
      key: "qins",
    },
    {
      title: "实时累计(m³)",
      key: "qtotal",
    },
    {
      title: "上报时间",
      key: "tm",
    },
    {
      title: "本月取水量(m³)",
      key: "qmon",
    },
    {
      title: "本年取水量(m³)",
      key: "qyear",
    },
    {
      title: "许可取水量(m³)",
      key: "yearsofwithdrawals",
    },
    {
      title: "设备状态",
      key: "status",
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
    },
  ];

  pageYjParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  stationParams: any = {
    areaName: "",
    qsType: "",
    range: "",
    name: "",
  };

  // 列表
  async onpage() {
    let url = "wjServer/qushui/list";
    let data = await publicApi.getWithParam(url, this.stationParams);
    if (data.result == true) {
      data.data.forEach((item: any) => {
        item.tm = this.$utils.dateFormat(new Date(Number(item.tm)), "yyyy-MM-dd HH:mm:ss");
        return data.data;
      });
      this.tableData = data.data;
    } else {
      this.tableData = [];
      this.$SucMessage.error("获取失败");
    }
    this.loading = false;
  }

  onSearch(val: string) {
    this.loading = true;
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
      .seamless-warp {
        width: 100%;
        height: 1000px;
        overflow: hidden;
        color: rgba(255, 255, 255, 1);
        position: relative;
        overflow-y: auto;
      }
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

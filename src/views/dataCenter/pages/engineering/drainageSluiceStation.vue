<template>
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
            <search-component placeholderTxt="闸站名称" @input="onSearch"> </search-component>
          </div>
        </div>
        <div class="top-item">
            <el-upload
              type="success"
              style="margin-right: 10px;"
              size="small"
              :headers="uploadHeaders"
              :on-success="PicSuccess"
              action="api/wjServer/dataCenter/pailaoZha/import"
              accept=".xls,.xlsx"
              :show-file-list="false"
            >
              <el-button size="small" type="success">导入排涝闸站</el-button>
            </el-upload>
          <suc-button type="primary" :debounce="800" @on-click="onadd">新增</suc-button>
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
    <plzz-modal :title="modalTitle" :model="model" v-loading="loading" :formParams="formParams" @on-submit="oncreate" @toggle="toggle" :chuan="chuan"></plzz-modal>
    <!-- 删除弹框 -->
    <div class="delete-view" v-show="delmodel">
      <delete-modal @getignore="cancel" @getsave="save" v-loading="delLoading"></delete-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucSelect, SucButton, SucInput, SucFormItem } from "@suc/ui";
// import { SelectConfig, SelectOptions } from "@suc/ui/interfaces";
import { SearchComponent, TablePage } from "@/components";
import { DeleteModal, QxdwModal, BzcsModal } from "../model";
import PlzzModal from "../model/PlzzModal.vue";
import { infoApi, publicApi } from "@/api";
import dayjs from "dayjs";
@Component({
  components: {
    SucSelect,
    SucButton,
    SucInput,
    SucFormItem,
    SearchComponent,
    TablePage,
    DeleteModal,
    QxdwModal,
    BzcsModal,
    PlzzModal,
  },
})
export default class Enterprise extends Vue {
  olMap = this.$getMapConfig();
  areaOptions: any = [];
  modalTitle: string = ""; //弹窗标题
  loading: boolean = true;
  delLoading: boolean = false;
  btnFlag: string = ""; //区分编辑和新增
  tableData: any[] = [];
  chuan: any = [];
  formParams: any = {};
  uploadHeaders:any = {"Authorization":'bearer ' + localStorage.getItem("refresh-token")}
  //   删
  delmodel: boolean = false;
  
  PicSuccess(file: any) {
        this.onpage();
  }
  delParams: any = {}; //删除的参数
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
    let url = "wjServer/dataCenter/pailaoZha";
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

  // 新增弹框
  onadd() {
    this.model = true;
    this.btnFlag = "add";
    this.modalTitle = "新增";
    this.formParams = {};
  }

  // 判断是新增还是编辑
  async oncreate() {
    if (this.btnFlag == "add") {
      this.setCreate();
    } else if (this.btnFlag == "edit") {
      this.setEdit();
    }
    this.model = false;
  }
  //  新增
  async setCreate() {
    this.loading = true;
    let url = "wjServer/dataCenter/pailaoZha";
    infoApi.oncreate(this.formParams, url).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("新增成功");
        this.model = false;
        this.onpage();
        this.loading = false;
      } else {
        this.$SucMessage.error("新增失败");
        this.model = false;
        this.loading = false;
      }     
    });
    this.onpage();
  }
  // 更新
  async setEdit() {
    this.loading = true; 
    let url = "wjServer/dataCenter/pailaoZha";
    infoApi.jsonUpdate(this.formParams, url).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("更新成功");
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
    let url = "wjServer/dataCenter/pailaoZha";
    let params = {
      uuid: uuidParams,
    };
    let data = await infoApi.getInfo(params, url);

    if (data.result == true) {
      // let  newArea =  data.data.area
      this.formParams = {
        uuid:data.data.uuid,
        name: data.data.name,
        belong: data.data.belong,
        mngsub: data.data.mngsub,
        protectsub: data.data.protectsub,
        localmngsub: data.data.localmngsub,
        busimngsub: data.data.busimngsub,
        mnglevel: data.data.mnglevel,
        cun: data.data.cun,
        polderareas: data.data.polderareas,

        insideriver: data.data.insideriver,
        outriver: data.data.outriver,
        engtyype: data.data.engtyype,
        combinetype: data.data.combinetype,
        bengnum: data.data.bengnum,
        bengversion: data.data.bengversion,
        bengsupplier: data.data.bengsupplier,
        bengq: data.data.bengq,

        countq: data.data.countq,
        motortype: data.data.motortype,
        motorprovider: data.data.motorprovider,
        p: data.data.p,
        countp: data.data.countp,
        openz: data.data.openz,
        colsez: data.data.colsez,
        zhanum: data.data.zhanum,
        width: data.data.width,
        countwidth: data.data.countwidth,
        zhastru: data.data.zhastru,
        hoisttype: data.data.hoisttype,
        crestlevel: data.data.crestlevel,
        bedlevel: data.data.bedlevel,
        area: data.data.area,
        location: data.data.location,
        year: data.data.year,
        updateyear: data.data.updateyear,
        informatization: data.data.informatization,
        areacode: data.data.areacode ? data.data.areacode.split(",") : [],
      };
    } else {
      this.$SucMessage.error("获取失败");
    }
  }
  //   查
  columns: any[] = [
    {
      type: "index",
      title: "序号",
      // width: 150,
    },
    {
      title: "闸站名称",
      key: "name",
    },
    {
      title: "工程产权归属",
      key: "belong",
    },
    {
      title: "工程管理主体",
      key: "mngsub",
    },

    {
      title: "工程管护主体",
      key: "protectsub",
    },
    {
      title: "属地管理主体",
      key: "localmngsub",
    },
    {
      title: "行业管理主体",
      key: "busimngsub",
    },
    {
      title: "管理等级",
      key: "mnglevel",
    },
    {
      title: "所在行政村",
      key: "cun",
    },
    {
      title: "所在圩区",
      key: "polderareas",
    },
    {
      title: "内河河道",
      key: "insideriver",
    },
    {
      title: "外河河道",
      key: "outriver",
    },

    {
      title: "工程样式",
      key: "engtyype",
    },
    {
      title: "堤防结合形式",
      key: "combinetype",
    },
    {
      title: "机泵数(台套)",
      key: "bengnum",
    },
    {
      title: "水泵型号",
      key: "bengversion",
    },
    {
      title: "水泵供应商",
      key: "bengsupplier",
    },

    {
      title: "单泵流量(m³/s)",
      key: "bengq",
    },
    {
      title: "总流量(m³/s)",
      key: "countq",
    },
    {
      title: "电机型号",
      key: "motortype",
    },
    {
      title: "电机供应商",
      key: "motorprovider",
    },
    {
      title: "单机功率(kw)",
      key: "p",
    },
    {
      title: "总功率(kw)",
      key: "countp",
    },
    {
      title: "开机水位(m)",
      key: "openz",
    },
    {
      title: "关机水位(m)",
      key: "colsez",
    },
    {
      title: "闸孔孔数",
      key: "zhanum",
    },
    {
      title: "单孔净宽(m)",
      key: "width",
    },
    {
      title: "闸门总净宽",
      key: "countwidth",
    },
    {
      title: "闸门结构形式",
      key: "zhastru",
    },
    {
      title: "启闭机形式",
      key: "hoisttype",
    },
    {
      title: "闸门顶高程(m)",
      key: "crestlevel",
    },
    {
      title: "闸门底高程(m)",
      key: "bedlevel",
    },
    {
      title: "受益面积(亩)",
      key: "area",
    },
    {
      title: "经纬度",
      key: "location",
    },
    {
      title: "建设年份",
      key: "year",
    },
    {
      title: "最近改造年份",
      key: "updateyear",
    },
    {
      title: "是否信息化",
      key: "informatization",
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
      fixed: "right",
    },
  ];

  // 从新定一个变量
  newColumns = [
    {
      type: "index",
      title: "序号",
      width: 150,
    },
    {
      title: "闸站名称",
      key: "name",
    },
    {
      title: "工程产权归属",
      key: "belong",
    },
    {
      title: "工程管理主体",
      key: "mngsub",
    },

    {
      title: "工程管护主体",
      key: "protectsub",
    },
    {
      title: "属地管理主体",
      key: "localmngsub",
    },
    {
      title: "行业管理主体",
      key: "busimngsub",
    },
    {
      title: "管理等级",
      key: "mnglevel",
    },
    {
      title: "所在行政村",
      key: "cun",
    },

    {
      title: "所在圩区",
      key: "polderareas",
    },
    {
      title: "内河河道",
      key: "insideriver",
    },
    {
      title: "外河河道",
      key: "outriver",
    },

    {
      title: "工程样式",
      key: "engtyype",
    },
    {
      title: "堤防结合形式",
      key: "combinetype",
    },
    {
      title: "机泵数(台套)",
      key: "bengnum",
    },
    {
      title: "水泵型号",
      key: "bengversion",
    },
    {
      title: "水泵供应商",
      key: "bengsupplier",
    },

    {
      title: "单泵流量(m³/s)",
      key: "bengq",
    },
    {
      title: "总流量(m³/s)",
      key: "countq",
    },
    {
      title: "电机型号",
      key: "motortype",
    },
    {
      title: "电机供应商",
      key: "motorprovider",
    },
    {
      title: "单机功率(kw)",
      key: "p",
    },
    {
      title: "总功率(kw)",
      key: "countp",
    },
    {
      title: "开机水位(m)",
      key: "openz",
    },
    {
      title: "关机水位(m)",
      key: "colsez",
    },
    {
      title: "闸孔孔数",
      key: "zhanum",
    },
    {
      title: "单孔净宽(m)",
      key: "width",
    },
    {
      title: "闸门总净宽",
      key: "countwidth",
    },
    {
      title: "闸门结构形式",
      key: "zhastru",
    },
    {
      title: "启闭机形式",
      key: "hoisttype",
    },
    {
      title: "闸门顶高程(m)",
      key: "crestlevel",
    },
    {
      title: "闸门底高程(m)",
      key: "bedlevel",
    },
    {
      title: "受益面积(亩)",
      key: "area",
    },
    {
      title: "经纬度",
      key: "location",
    },
    {
      title: "建设年份",
      key: "year",
    },
    {
      title: "最近改造年份",
      key: "updateyear",
    },
    {
      title: "是否信息化",
      key: "informatization",
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
      fixed: "right",
    },
  ];

  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };

  stationParams: any = {
    pageNumber: "",
    pageSize: "",
    name: "", //闸站名称
    areaCode: "",
  };

  mounted() {
    this.onpage(); //获取页面信息
  }

  // 列表
  async onpage() {
    this.stationParams.pageNumber = this.pageParams.current; //当前页码
    this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
    let url = "wjServer/dataCenter/pailaoZha/page";
    let data = await publicApi.getWithParam(url, this.stationParams);
    if (data.result == true) {
      this.tableData = data.data.rows;
      if (this.tableData.length == 0) {
        this.columns.pop();
      } else {
        this.columns = this.newColumns;
      }
      this.pageParams.total = parseInt(data.data.total);
    } else {
      this.tableData = [];
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
  //  点击查询拿到的值
  onSearch(val: string) {
    this.loading = true;
    this.pageParams.current = 1;
    this.stationParams.name = val;
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

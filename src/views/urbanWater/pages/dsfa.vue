<template>
  <!-- 调水方案 -->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub"> 
            <suc-input placeholder="请输入方案名称" v-model="stationParams.schemeName" style="margin-right:10px"> </suc-input>
            <suc-input placeholder="请输入监测河道名称" v-model="stationParams.riverName" style="margin-right:10px"> </suc-input>
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
            <suc-button class="lefts" type="primary" :debounce="800" @on-click="onSearch">搜索 </suc-button>
          </div>
        </div>
      </div>
      <div class="content">
        <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize">
           <template v-slot:operation="{ row }">
            <div class="btn">
              <span @click="onedit(row)">详情</span>
              <!-- <span @click="ondelete(row)">删除</span> -->
            </div>
          </template>
          <template v-slot:title="{ row }">
            <a :href="row.url"></a>
          </template>
        </table-page>
      </div>
      <dsfa-modal
        :title="modalTitle"
        :model="model"
        :loading="loading"
        :formParams="formParams"
        @on-submit="oncreate"
        @toggle="toggle"
      ></dsfa-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucSelect, SucButton, SucInput, SucFormItem, SucMessage } from "@suc/ui";
import { SearchComponent, TablePage } from "@/components";
import { infoApi, publicApi } from "@/api";
import { dsfaModal} from "./model";
@Component({
  components: {
    SucSelect,
    SucButton,
    SucInput,
    SucFormItem,
    SearchComponent,
    TablePage,
    dsfaModal,
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
  formParams: any = {};

  //   删
  delmodel: boolean = false;
  delParams: any = {};
  mounted() {
    this.onpage();
  }
  // async handleChange(value: any) {
  //   this.formParams.area = value.toString();
  // }
  // ondelete(row: any) {
  //   this.delmodel = true;
  //   this.delParams = {
  //     id: row.id,
  //   };
  // }
  dateChange(val: any) {
    if (val) {
      this.stationParams.startTime = val[0];
      this.stationParams.endTime = val[1];
    } else {
      this.stationParams.startTime = null;
      this.stationParams.endTime = null;
    }
  }

  cancel(val: any) {
    this.delmodel = val;
  }

  model: boolean = false;
  toggle(val: boolean) {
    this.model = val;
  }
   // 判断是新增还是编辑
  async oncreate() {
    this.formParams.year = this.$utils.dateFormat(
      new Date(this.formParams.year),
      "yyyy"
    );
    this.formParams.area =  this.formParams.area.toString();
    switch (this.formParams.type) {
      case "1":
        this.formParams.busiFxStFlooded.starttime = this.$utils.dateFormat(
          new Date(this.formParams.busiFxStFlooded.starttime),
          "yyyy-MM-dd"
        );
        this.formParams.busiFxStFlooded.endtime = this.$utils.dateFormat(
          new Date(this.formParams.busiFxStFlooded.endtime),
          "yyyy-MM-dd"
        );
        break;
      case "8":
        this.formParams.busiFxStWaterproject.starttime = this.$utils.dateFormat(
          new Date(this.formParams.busiFxStWaterproject.starttime),
          "yyyy-MM-dd"
        );
        this.formParams.busiFxStWaterproject.endtime = this.$utils.dateFormat(
          new Date(this.formParams.busiFxStWaterproject.endtime),
          "yyyy-MM-dd"
        );
        break;

      default:
        break;
    }
    if (this.btnFlag == "add") {
      return
    } else if (this.btnFlag == "edit") {
      this.setEdit();
    }
    this.model = false;
  }
   // 更新
  async setEdit() {
    // this.loading = true;
      this.model = false;
    // let url = "wjServer/fangxunjc/disaster/editInfo";
    // publicApi.putWithParamJson(url, this.formParams).then((data: any) => {
    //   if (data.result == true) {
    //     this.$SucMessage.info("更新成功");
    //     this.model = false;
    //     this.onpage();
    //     this.loading = false;
    //   } else {
    //     this.model = false;
    //     this.$SucMessage.error("更新失败");
    //     this.loading = false;
    //   }
    // });
    // this.onpage();
  }
  // 编辑
  onedit(row: any) {
    this.model = true;
    this.formParams = {
      minIoFileList: [],
    };
    this.btnFlag = "edit";
    this.modalTitle = "详情";
    let uuid = row.uuid;
    this.editInfo(uuid);
  }
  // 详情
  async editInfo(uuidParams: any) {
    let url = "wjServer/waterENVIR/scheme";
    let params = {
      uuid: uuidParams,
    };
    let data = await infoApi.getInfo(params, url);
    if (data.result == true) {
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
      title: "方案名称",
      key: "schemename",
    },
    {
      title: "方案类型",
      key: "falx",
    },
    {
      title: "监测河道",
      key: "targetrivername",
    },
    {
      title: "方案描述",
      key: "nt",
    },
    {
      title: "生成时间",
      key: "createtime",
    },
    {
      title: "执行时间",
      key: "dotime",
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
    startTime: null,
    endTime: null,
    pageNumber: "",
    pageSize: "",
    schemeName:"",
    riverName:"",
  };

  // 列表
  async onpage() {
    this.stationParams.pageNumber = this.pageParams.current; //当前页码
    this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
    let url = "wjServer/waterENVIR/scheme/page";
    let data = await publicApi.getWithParam(url, this.stationParams);
    if (data.result == true) {
      this.tableData = data.data.rows;
      for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].falx="调水方案"
          var time=parseInt(this.tableData[i].createtime)
          var d = new Date(time);    //根据时间戳生成的时间对象
          var year=d.getFullYear()
          var month=d.getMonth()+1
          var day=d.getDate()
          var hour=d.getHours()
          var minute=d.getMinutes()
          var second=d.getSeconds()
          let createtime=year + "-" + month + "-" +day +' '+ hour+':'+minute+':'+second
          this.tableData[i].createtime=createtime

          var time=parseInt(this.tableData[i].dotime)
          var d = new Date(time);    //根据时间戳生成的时间对象
          var year=d.getFullYear()
          var month=d.getMonth()+1
          var day=d.getDate()
          var hour=d.getHours()
          var minute=d.getMinutes()
          var second=d.getSeconds()
          let dotime=year + "-" + month + "-" +day +' '+ hour+':'+minute+':'+second
          this.tableData[i].dotime=dotime
      }

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
  
}
</script>
<style lang="scss" scoped>
.lefts{
    margin-left: 20px;
    margin-top: -3px;
}
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

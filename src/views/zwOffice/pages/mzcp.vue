<template>
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="content">
        <table-page
          :columns="columns"
          :tableData="tableData"
          :pageParams="pageParams"
          v-loading="loading"
          @get-page="getPage"
          @get-size="getSize"
        >
          <template  v-slot:operation="{ row }">
            <div class="btn">
              <span  @click="onedit(row)">开始测评</span>
            </div>
          </template>
          
        </table-page>
      </div>
    </div>

    <mzcp-modal
      :title="modalTitle"
      :model="model"
      :loading="loading"
      :formParams="formParams"
      @on-submit="oncreate"
      @toggle="toggle"
      :stationId="stationId"
    ></mzcp-modal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucButton, SucInput, SucDatePicker, SucSelect } from "@suc/ui";
import { SearchComponent, TablePage } from "@/components";
import { mzcpModal, DeleteModal } from "./model";
import { publicApi } from "@/api";
@Component({
  components: {
    SucButton,
    SucInput,
    SearchComponent,
    TablePage,
    mzcpModal,
    SucDatePicker,
    DeleteModal,
    SucSelect,
  },
})
export default class Enterprise extends Vue {
  modalTitle: string = ""; //弹窗标题
  loading: boolean = false;
  delLoading: boolean = false;
  btnFlag: string = ""; //区分编辑和新增
  tableData: any[] = [];
  time: any = "";
  params: any = {};
  bbType: any = [];
  bbOptions: any = [];
  formParams: any = {
    activeuseruuid:'',
    appraisaluuid:'',
    passiveuseruuid:'',
    passiveUserName:'',
    scoretwo:'',
    scorethree:'',
    scoreone:'',
    scorefour:'',
    scorefive:'',
  };
  areaOptions: any = [];
  stationId: any = '';
  uploadHeaders:any = {"Authorization":'bearer ' + localStorage.getItem("refresh-token")}
  
  mounted() {
    this.onpage();
  }
  model: boolean = false;
  toggle(val: boolean) {
    this.model = val;
  }
  // 编辑
  onedit(row: any) {
    this.model = true;
    this.modalTitle = "民主测评";
    this.stationId = row.appraisalUuid;
  }
 columns: any[] = [
    {
      title: "开始时间",
      key: "startTime",
    },
    {
      title: "结束时间",
      key: "endTime",
    },
    {
      title: "状态",
      key: "state",
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
    pageSize: 20,
  };
  stationParams: any = {
    pageNumber: "",
    pageSize: "",
  };
  // ↓ 测评结果（val是弹框页传的值，直接赋值给接口传参）。
  async oncreate(val:any){
    let url = "wjServer/oa/appraisal/pc";
    publicApi.postWithParamJson(url,val).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("测评成功");
        this.model = false;
        this.onpage();
        this.loading = false;
      } else {
        this.$SucMessage.error("测评失败");
        this.model = false;
        this.loading = false;
      }
    });
  }
  // 列表
    async onpage() {
    this.stationParams.pageNumber = this.pageParams.current; //当前页码
    this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
    let url = "wjServer/oa/appraisal/CpPage";
    let data = await publicApi.getWithParam(url, this.stationParams);
    if (data.result == true) {
      this.tableData = data.data.rows;
      for(var i=0;i<this.tableData.length;i++){
        var time=parseInt(this.tableData[i].startTime)
        var d = new Date(time);    //开始时间对象
        var year=d.getFullYear()
        var month=d.getMonth()+1
        var day=d.getDate()
        let startTime=year + "年" + month + "月" +day +'日'
        this.tableData[i].startTime=startTime

        var time=parseInt(this.tableData[i].endTime)
        var d = new Date(time);    //结束时间对象
        var year=d.getFullYear()
        var month=d.getMonth()+1
        var day=d.getDate()
        let endTime=year + "年" + month + "月" +day +'日'
        this.tableData[i].endTime=endTime
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

  onSearch() {
    this.loading = true;
    this.pageParams.current = 1;
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
        // width: 50%;
        &-sub {
          margin-right: 10px;
        }
      }
    }
    .content {
      height: calc(100% - 10px);
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

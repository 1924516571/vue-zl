<template>
  <!-- 维修档案 -->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
            <search-component :placeholderTxt="placeholderTxt" @input="onSearch" @test="test1" @input1="input1"> </search-component>
          </div>
         
        </div>
      </div>
      <div class="content">
        <!-- :simple="false"  这类是简洁模式 -->
        <table-page :columns="columns" showTotal   :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize">
          <template v-slot:bjList="{ row }">
            <div class="bjztClass" v-for="(item, index) in row.bjList" :key="index">
              <span v-if="item == 1">
                <img src="@/assets/monFlood/1.gif" />
              </span>
              <span v-if="item == 0">
                <img src="@/assets/monFlood/2.gif" />
              </span>
            </div>
          </template>
          <template v-slot:zwList="{ row }">
            <div class="bjztClass" v-for="(item, index) in row.zmList" :key="index">
              <span v-if="item != 0">
                <img src="@/assets/monFlood/3.gif" />
              </span>
              <span v-if="item == 0">
                <img src="@/assets/monFlood/4.gif" />
              </span>
            </div>
          </template>
        </table-page>
      </div>
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
  olMap = this.$getMapConfig();
  modalTitle: string = ""; //弹窗标题
  loading: boolean = true;
  delLoading: boolean = false;
  btnFlag: string = ""; //区分编辑和新增
  tableData: any[] = [];
  gcOptions: any = [];
  formParams: any = {
    minIoFileList: [],
  };
  placeholderTxt: any = "站点名称";

  //   删
  mounted() {
    this.onpage();
  }

  //   查
  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "站点名称",
      key: "stationName",
    },
    {
      title: "内河水位(m)",
      key: "nhsw",
    },
    {
      title: "外河水位(m)",
      key: "whsw",
    },
    {
      title: "泵机状态",
      key: "bjList",
      slot: "bjList",
    },
    {
      title: "警戒水位(m)",
      key: "jjsw",
    },
    {
      title: "闸门状态",
      slot: "zwList",
    },
    {
      title: "更新时间",
      key: "ntime",
    },
  ];

  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 40,
  };
  stationParams: any = {
    pageNumber: "",
    pageSize: "",
    stationName: "",
  };

  // 列表
  async onpage() {
    this.stationParams.pageNumber = this.pageParams.current; //当前页码
    this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
    let url = "wjServer/fangxunjc/zhabengzhanyx/infoList";
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
      .bjztClass {
        display: inline-block;
        padding-right: 2px;
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

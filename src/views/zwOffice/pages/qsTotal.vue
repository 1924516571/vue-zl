<template>
  <!--发文查询-->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
             <suc-select
              v-model="qsParams.depId"
              :options="swOptions"
              :config="{
                clearable: true,
                placeholder: '收文部门',
              }"
              style="width: 200px"
            >
            </suc-select>
          </div>
          <div class="top-item-sub">
            <suc-date-picker
              v-model="qsParams.yearMonth"
              :options="{
                type: 'month',
                clearable: true,
                placeholder: '请选择日期',
              }"
              style="width: 100%"
            ></suc-date-picker>
          </div>
          <div class="top-item-sub">
            <suc-button type="primary" @on-click="onSearch">搜索</suc-button>
          </div>
        </div>
      </div>
      <div class="content">
        <table-page
          :columns="columns"
          :tableData="tableData"
          :pageParams="pageParams"
          @get-page="getPage"
          @get-size="getSize"
        >
        </table-page>
      </div>
    </div>

    <!-- 删除弹框 -->
    <div class="delete-view" v-show="delmodel">
      <delete-modal
        @getignore="cancel"
        @getsave="save"
        v-loading="delLoading"
      ></delete-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucButton, SucInput, SucDatePicker, SucSelect } from "@suc/ui";
import { SearchComponent, TablePage } from "@/components";
import {  DeleteModal } from "./model";
import { publicApi } from "@/api";
@Component({
  components: {
    SucButton,
    SucInput,
    SearchComponent,
    TablePage,
    SucDatePicker,
    DeleteModal,
    SucSelect,
  },
})
export default class Enterprise extends Vue {
  loading: boolean = false;
  tableData: any[] = [];
  params: any = {};
  swOptions: any = [];

  mounted() {
    this.onpage();
    this.getSwbm();
  }

   //收文部门
  async getSwbm() {
    let url = "wjBaseServer/system/department/queryTree";
    let data = await publicApi.postNoParam(url);
    this.swOptions = data.data.map((e: any) => {
      let item = {
        value: e.departmentId,
        label: e.fullName,
      };
      return item;
    });
  }


  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "收文部门",
      key: "depName",
    },
    {
      title: "应收公文数",
      key: "ysFileNum",
    },
    {
      title: "实收公文数",
      key: "ssFileNum",
    },
    {
      title: "6小时内签收数",
      key: "js6FileNum",
    },
    {
      title: "24小时内签收数",
      key: "js24FileNum",
    },
  ];

  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  qsParams: any = {
    pageNumber: "",
    pageSize: "",
  };

  // 列表
  async onpage() {
    this.qsParams.pageNumber = this.pageParams.current;
    this.qsParams.pageSize = this.pageParams.pageSize;
    if (this.qsParams.yearMonth!='') {
      this.qsParams.yearMonth = this.$utils.dateFormat(
        new Date(this.qsParams.yearMonth),
        "yyyy-MM"
      );
    }
    
    let url = "wjServer/oa/sendfile/qianShouTongJi";
    let data = await publicApi.getWithParam(url, this.qsParams);
    this.pageParams.total = parseInt(data.data.total);
    this.tableData = data.data;
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

<template>
  <!--应急预警-->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
            <suc-date-picker
              v-model="tableParams.year"
              :options="{
                type: 'year',
                clearable: true,
                placeholder: '请选择申报年份',
              }"
              style="width: 200px"
            ></suc-date-picker>
          </div>
          <!-- <div class="top-item-sub">
            <suc-select
              v-model="tableParams.town"
              :options="areaOptions"
              :config="{
                clearable: true,
                placeholder: '请选择乡镇',
              }"
              style="width: 200px"
            >
            </suc-select>
          </div> -->
          <div class="top-item-sub">
            <search-component placeholderTxt="项目名称" @input="onSearch">
            </search-component>
          </div>
        </div>
        <div class="top-item">
          <suc-button type="primary" :debounce="800" @on-click="onadd"
            >新增</suc-button
          >
        </div>
      </div>
      <div class="content">
        <j-table
          :tableData="tableData"
          :pageParams="pageParams"
          @get-page="getPage"
          :border="false"
          v-loading="loading"
          @get-size="getSize"
        >
          <template v-slot:column>
            <el-table-column
              v-for="item in columns"
              :key="item"
              :type="item.type"
              :prop="item.key"
              :label="item.title"
              :width="item.width"
            >
            </el-table-column>
            <el-table-column label="操作" width="120">
              <div class="btn" slot-scope="scope">
                <span @click="onedit(scope.row)">编辑</span>
                <span @click="ondelete(scope.row)">删除</span>
              </div>
            </el-table-column>
          </template>
        </j-table>
      </div>
    </div>
    <jq-modal
      :title="modalTitle"
      :model="model"
      :loading="loading"
      :formParams="formParams"
      @on-submit="oncreate"
      @toggle="toggle"
    ></jq-modal>
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
import { SearchComponent, TablePage, TabActive, JTable } from "@/components";

import { DeleteModal, jqModal } from "../model";
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
    TabActive,
    JTable,
    jqModal,
  },
})
export default class Plan extends Vue {
  modalTitle: string = ""; //弹窗标题
  loading: boolean = false;
  delLoading: boolean = false;
  btnFlag: string = ""; //区分编辑和新增
  tableData: any[] = [];
  time: any = "";
  activeIndex: any = 0;
  params: any = {};
  bbType: any = [];
  levelOptions: any = [];
  tableRefresh: any = 0;
  formParams: any = {};
  uploadData: any = [];
  formParams1: any = {};
  areaOptions: any = [];
  model: boolean = false;
  tableParams: any = {
    pageNumber: "",
    pageSize: "",
  };
  //   删
  delmodel: boolean = false;
  delParams: any = {};

  columns: any = [
    {
      title: "序号",
      type: "index",
    },
    {
      title: "项目名称",
      key: "xmmc",
    },
    {
      title: "投资金额",
      key: "tzje",
    },
    {
      title: "补助金额",
      key: "bzje",
    },
    {
      title: "申报年份",
      key: "nf",
    },
    {
      title: "联系方式",
      key: "tel",
    },
  ];

  mounted() {
    this.onpage();
    this.getAreaData();
  }

  async getAreaData() {
    let url = "wjServer/szszy/carrier/townList";
    await publicApi.getNoParam(url).then((data: any) => {
      this.areaOptions = data.data.map((list: any) => {
        return {
          label: list.key,
          value: list.key,
        };
      });
    });
  }

  onSearch(val: string) {
    this.loading = true;
    this.pageParams.current = 1;
    this.tableParams.xmmc = val;
    this.onpage();
  }

  ondelete(row: any) {
    this.delmodel = true;
    this.delParams = {
      id: row.id,
    };
  }
  cancel(val: any) {
    this.delmodel = val;
  }
  async save() {
    this.delLoading = true;
    let url = "wjServer/szszy/jgProject/delInfo";
    await publicApi.deleteWithParam(url, this.delParams).then((data: any) => {
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
    this.modalTitle = "新增载体";
    this.formParams = {};
  }

  // 编辑
  onedit(row: any) {
    this.formParams = {
      imgList: [],
    };
    this.btnFlag = "edit";
    this.modalTitle = "编辑";
    let id = row.id;
    this.editInfo(id);
    this.model = true;
  }

  async editInfo(id: any) {
    let url = "wjServer/szszy/jgProject/getDetail";
    let params = {
      id: id,
    };
    let data = await publicApi.getWithParam(url, params);
    this.formParams = data.data;
  }

  async oncreate() {
    this.formParams.nf = this.$utils.dateFormat(
      new Date(this.formParams.nf),
      "yyyy"
    );
    if (this.btnFlag == "add") {
      this.setCreate();
    } else if (this.btnFlag == "edit") {
      this.setEdit();
    }
    this.model = false;
  }

  //  新增
  async setCreate() {
    var url = "wjServer/szszy/jgProject/addInfo";
    this.loading = true;
    publicApi.postWithParamJson(url, this.formParams).then((data: any) => {
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
    var url = "wjServer/szszy/jgProject/editInfo";
    this.loading = true;
    publicApi.putWithParamJson(url, this.formParams).then((data: any) => {
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

  toggle(val: boolean) {
    this.model = val;
  }

  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };

  // 列表
  async onpage() {
    this.tableParams.pageNumber = this.pageParams.current;
    this.tableParams.pageSize = this.pageParams.pageSize;
    this.tableParams.year = this.$utils.dateFormat(
      new Date(this.tableParams.year),
      "yyyy"
    );
    let url = "wjServer/szszy/jgProject/infoList";
    let data = await publicApi.getWithParam(url, this.tableParams);
    this.pageParams.total = parseInt(data.data.total);
    this.tableData = data.data.rows;
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
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";

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
      height: calc(100% - 130px);
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
  //表格换行
  #{$deep}.el-table .cell {
    white-space: pre-line;
  }
}
</style>

<template>
  <!--值班人员-->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
            <suc-date-picker
              v-model="zbParams.dutydate"
              :options="{
                type: 'date',
                clearable: true,
                placeholder: '请选择日期',
              }"
              style="width: 150px"
            ></suc-date-picker>
          </div>
          <div class="top-item-sub">
            <search-component placeholderTxt="人员姓名" @input="onSearch">
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
        <table-page
          :columns="columns"
          :tableData="tableData"
          :pageParams="pageParams"
          @get-page="getPage"
          @get-size="getSize"
        >
          <template v-slot:operation="{ row }">
            <div class="btn">
              <span @click="onedit(row)">编辑</span>
              <span @click="ondelete(row)">删除</span>
            </div>
          </template>
        </table-page>
      </div>
    </div>

    <zb-modal
      :title="modalTitle"
      :model="model"
      :loading="loading"
      :formParams="formParams"
      @on-submit="oncreate"
      @toggle="toggle"
    ></zb-modal>

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
import { zbModal, DeleteModal } from "../model";
import { publicApi } from "@/api";
@Component({
  components: {
    SucButton,
    SucInput,
    SearchComponent,
    TablePage,
    zbModal,
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

  formParams: any = {};

  //   删
  delmodel: boolean = false;
  delParams: any = {};

  mounted() {
    this.onpage(); //获取页面信息
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
    let url = "wjServer/fangxunjc/contacts/delInfo";
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
    let url = "wjServer/fangxunjc/ondutyer/addInfo";
    this.formParams.dutydate = this.$utils.dateFormat(new Date(this.formParams.dutydate),"yyyy-MM-dd")
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
    this.loading = true;
    let url = "wjServer/fangxunjc/ondutyer/editInfo";
    this.formParams.dutydate = this.$utils.dateFormat(new Date(this.formParams.dutydate),"yyyy-MM-dd"),
    publicApi.putWithParamJson(url, this.formParams).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("更新成功");
        this.model = false;
        this.onpage();
        this.loading = false;
      } else {
        this.model = false;
        this.$SucMessage.error("更新失败");
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
    this.editInfo(row.id);
  }
  // 详情
  async editInfo(params: any) {
    let url = "wjServer/fangxunjc/ondutyer/getInfoById";
    let detailParams = {
      id: params,
    };
    let data = await publicApi.getWithParam(url, detailParams);
    this.formParams = {
      dutydate: data.data.dutydate,
      skiller: data.data.skiller,
      dutyleader: data.data.dutyleader,
      dayshift: data.data.dayshift,
      id: data.data.id,
      nightshift: data.data.nightshift,
      type: data.data.type,
      tel: data.data.tel,
      task: data.data.task,
    };
  }

  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "值班日期",
      key: "dutydate",
    },
    {
      title: "值班领导",
      key: "dutyleader",
    },
    {
      title: "技术员",
      key: "skiller",
    },
    {
      title: "白班人员",
      key: "dayshift",
    },
    {
      title: "晚班人员",
      key: "nightshift",
    },
    {
      title: "值班类型",
      key: "type",
    },
    {
      title: "值班电话",
      key: "tel",
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
  zbParams: any = {
    pageNumber: "",
    pageSize: "",
    dutyer: "",
    dutydate:"",
  };

  // 列表
  async onpage() {
    this.zbParams.pageNumber = this.pageParams.current;
    this.zbParams.pageSize = this.pageParams.pageSize;
    this.zbParams.dutydate = this.$utils.dateFormat(new Date(this.zbParams.dutydate),"yyyy-MM-dd");
    let url = "wjServer/fangxunjc/ondutyer/infoList";
    let data = await publicApi.getWithParam(url, this.zbParams);
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

  onSearch(val: string) {
    this.loading = true;
    this.pageParams.current = 1;
    console.log("kanzhe",this.zbParams.dutydate);
    // this.pageParams.pageSize = 10;
    this.zbParams.dutyer = val;
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

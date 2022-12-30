<template>
  <!--后期处理-->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
            <suc-date-picker
              v-model="hqclParams.startTime"
              :options="{
                type: 'date',
                clearable: true,
                placeholder: '开始时间',
              }"
              style="width: 150px"
            ></suc-date-picker>
            <label style="width: 50px"> -- </label>
            <suc-date-picker
              v-model="hqclParams.endTime"
              :options="{
                type: 'date',
                clearable: true,
                placeholder: '结束时间',
              }"
              style="width: 150px"
            ></suc-date-picker>
          </div>

          <div class="top-item-sub">
            <suc-select
              :config="{ placeholder: '应急响应类型', clearable: true }"
              v-model="hqclParams.type"
              @on-change="getLevel"
              :options="typeOptions"
              style="width: 200px"
            >
            </suc-select>
          </div>

          <div class="top-item-sub">
            <suc-select
              :config="{ placeholder: '预警等级', clearable: true }"
              v-model="hqclParams.dangerLevel"
              :options="levelOptions"
              style="width: 200px"
            >
            </suc-select>
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
          <template v-slot:operation="{ row }">
            <div class="btn">
              <span style="color: #ccc" v-if="!row.self">变更</span>
              <span @click="onedit1(row)" v-if="row.self">变更</span>
              <span v-if="row.status == 0 && row.self" @click="onedit(row)">解除</span>
              <span style="color: #ccc" v-if="row.status == 0 &&!row.self">解除</span>
              <span v-if="row.status == 1" style="color: #ccc">已解除</span>
            </div>
          </template>
        </table-page>
      </div>
    </div>

    <hqcl-modal
      :title="modalTitle"
      :model="model"
      :loading="loading"
      :formParams="formParams"
      @on-submit="oncreate"
      @toggle="toggle"
    ></hqcl-modal>

    <!-- 变更弹框 -->
    <kq-modal
      :model1="model1"
      title="变更"
      :loading="loading"
      :activeIndex="formParams1.type"
      :formParams1="formParams1"
      @on-submit="oncreate1"
      @toggle1="toggle1"
    ></kq-modal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucButton, SucInput, SucDatePicker, SucSelect } from "@suc/ui";
import { SearchComponent, TablePage } from "@/components";
import { hqclModal, kqModal } from "./model";
import { publicApi } from "@/api";
@Component({
  components: {
    SucButton,
    SucInput,
    SearchComponent,
    TablePage,
    hqclModal,
    SucDatePicker,
    SucSelect,
    kqModal,
  },
})
export default class Enterprise extends Vue {
  model: boolean = false;
  model1: boolean = false;
  modalTitle: string = ""; //弹窗标题
  loading: boolean = false;
  tableData: any[] = [];
  params: any = {};
  rainOptions: any = [];
  levelOptions: any = [];
  typeOptions: any = [
    { label: "防汛应急预案", value: 0 },
    { label: "防台风应急预案", value: 1 },
  ];
  formParams: any = {};
  formParams1: any = {};

  mounted() {
    this.onpage();
    this.getRiver();
  }

  onedit1(row:any) {
    this.model1 = true;
    // this.modalTitle = "变更";
   this.editInfo1(row.id)
  }

  // 详情
  async editInfo1(params: any) {
    let url = "wjServer/fangxunjc/ermanager/planInfo";
    let detailParams = {
      id: params,
    };
    let data = await publicApi.getWithParam(url, detailParams);
    console.log("999",data);
    
    this.formParams1 = data.data;
    this.formParams1.ry = JSON.parse(localStorage.getItem("userInfo") || "").realname
  }

  async oncreate1() {
    this.loading = true;
    let url = "wjServer/fangxunjc/ermanager/planEdit";
    publicApi.putWithParamJson(url, this.formParams1).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("变更成功");
        this.model = false;
        this.onpage();
        this.loading = false;
      } else {
        this.model = false;
        this.$SucMessage.error("变更失败");
        this.loading = false;
      }
    });
    this.onpage();
    this.model1 = false;
  }

  async getRiver() {
    let url = "wjServer/dataCenter/baseinfo/riverinfo/getAllRiver";
    let data = await publicApi.getNoParam(url);
    this.rainOptions = data.data.map((e: any) => {
      let item = {
        value: e.rvCd,
        label: e.rvNm,
      };
      return item;
    });
  }

  async getLevel() {
    let url = "wjServer//fangxunjc/ermanager/dangerType";
    let data = await publicApi.getWithParam(url, {
      type: this.hqclParams.type,
    });
    this.levelOptions = data.data.map((e: any) => {
      let item = {
        value: e.code,
        label: e.name,
      };
      return item;
    });
  }

  async oncreate() {
    this.setEdit();
    this.model = false;
  }

  // 更新
  async setEdit() {
    this.loading = true;
    let url = "wjServer/fangxunjc/ermanager/clearWarning";
    publicApi
      .putWithParamJson(url, {
        id: this.formParams.id,
        duanxin: this.formParams.duanxin,
      })
      .then((data: any) => {
        if (data.result == true) {
          this.$SucMessage.info("解除成功");
          this.model = false;
          this.onpage();
          this.loading = false;
        } else {
          this.model = false;
          this.$SucMessage.error("解除失败");
          this.loading = false;
        }
      });
    this.onpage();
  }
  toggle(val: boolean) {
    this.model = val;
  }
  toggle1(val: boolean) {
    this.model1 = val;
  }
  // 编辑
  onedit(row: any) {
    this.model = true;
    this.formParams = {};
    this.modalTitle = "解除";
    this.editInfo(row.id);
  }
  // 详情
  async editInfo(params: any) {
    let url = "wjServer/fangxunjc/ermanager/getClearMsg";
    let detailParams = {
      id: params,
    };
    let data = await publicApi.getWithParam(url, detailParams);
    
    this.formParams = data.data;
  }

  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "应急响应类型",
      key: "type",
      width: 120,
    },
    {
      title: "预警等级",
      key: "dangerLevel",
      width: 100,
    },
    {
      title: "启动条件",
      key: "condition",
    },
    {
      title: "响应行动",
      key: "response",
    },
    {
      title: "负责人员",
      key: "principal",
      width: 100,
    },
    {
      title: "启动时间",
      key: "startTime",
      width: 150,
    },
    {
      title: "启动短信内容",
      key: "duanxin",
    },
    {
      title: "解除时间",
      key: "relieveTime",
      width: 150,
    },
    {
      title: "操作",
      slot: "operation",
      width: 100,
    },
  ];

  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  hqclParams: any = {
    pageNumber: "",
    pageSize: "",
  };

  // 列表
  async onpage() {
    this.hqclParams.pageNumber = this.pageParams.current;
    this.hqclParams.pageSize = this.pageParams.pageSize;
    this.hqclParams.startTime = this.$utils.dateFormat(
      new Date(this.hqclParams.startTime),
      "yyyy-MM-dd"
    );
    this.hqclParams.endTime = this.$utils.dateFormat(
      new Date(this.hqclParams.endTime),
      "yyyy-MM-dd"
    );
    let url = "wjServer/fangxunjc/ermanager/recordList";
    let data = await publicApi.getWithParam(url, this.hqclParams);
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

  onSearch() {
    this.loading = true;
    this.pageParams.current = 1;
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

  //表格换行
  #{$deep}.el-table .cell{
    white-space: pre-line;
  }
}


</style>

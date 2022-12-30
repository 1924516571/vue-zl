<template>
  <!--执法人员设备-->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <tab-active
            :btns="btns"
            @get-btn="getBtn"
            :activeIndex="activeIndex"
          ></tab-active>
        </div>
      </div>
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub" v-if="activeIndex == 1">
            <suc-select
              v-model="tableParams.zblx"
              :options="zbTypeOptions"
              @on-change="getZbName"
              :config="{
                clearable: true,
                placeholder: '装备种类',
              }"
              style="width: 200px"
            >
            </suc-select>
          </div>
          <div class="top-item-sub" v-if="activeIndex == 1">
            <suc-select
              v-model="tableParams.zbmc"
              :options="zbNameOptions"
              :config="{
                clearable: true,
                placeholder: '装备名称',
              }"
              style="width: 200px"
            >
            </suc-select>
          </div>
           <div class="top-item-sub" v-if="activeIndex == 0">
            <suc-input
              v-model="tableParams.name"
              placeholder= '人员姓名'
              style="width: 200px"
            >
            </suc-input>
          </div>
          <div class="top-item-sub">
            <search-component :placeholderTxt="activeIndex == 0?'执法证件编号':'品牌及型号'" @input="onSearch">
            </search-component>
          </div>
        </div>
        <div class="top-item">
          <suc-button type="primary" :debounce="800" @on-click="onadd"
            >{{activeIndex == 0?'添加执法人员证件':'添加执法装备'}}</suc-button
          >
        </div>
      </div>
      <div class="content">
        <!-- key很关键用于解决组件复用带来的表头渲染问题！！！！ -->
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
              :type='item.type'
              :prop="item.key"
              :label="item.title"
              :width="item.width"
              :key="item"
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
    <zfsb-modal
      :title="modalTitle"
      :model="model"
      :loading="loading"
      :activeIndex="activeIndex"
      :formParams="formParams"
      @on-submit="oncreate"
      @toggle="toggle"
    ></zfsb-modal>
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

import { DeleteModal, zfsbModal } from "../model";
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
    zfsbModal,
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
  zbTypeOptions: any = [];
  zbNameOptions: any = [];
  model: boolean = false;
  btns: any[] = ["执法人员证件信息", "执法装备信息"];
  tableParams: any = {
    pageNumber: "",
    pageSize: "",
  };
  //   删
  delmodel: boolean = false;
  delParams: any = {};

  columns1: any = [
    {
      title: "序号",
      type: "index",
    },
    {
      title: "姓名",
      key: "name",
    },
    {
      title: "执法政法编号",
      key: "zfzjbh",
    },
    {
      title: "所属单位",
      key: "ssdw",
    },
    {
      title: "最后修改时间",
      key: "lastTime",
    },
  ];
  //   查
  columns2: any = [
    {
      title: "序号",
      type: "index",
    },
    {
      title: "装备种类",
      key: "zblx",
    },
    {
      title: "装备名称",
      key: "zbmc",
    },
    {
      title: "品牌及型号",
      key: "ppjxh",
    },
    {
      title: "数量",
      key: "num",
    },
    {
      title: "所属乡镇",
      key: "ssxz",
    },
        {
      title: "所属队伍",
      key: "ssdw",
    },
        {
      title: "持有人（负责人）",
      key: "cyr",
    },
  ];
  columns: any = this.columns1;
  mounted() {
    this.onpage();
    this.getzbTypeData();
  }

  async getZbName(list:any){
    let url = "wjServer/szszy/exLaw/getZbmcList";
    await publicApi.getWithParam(url,{zblx:list}).then((data: any) => {
      this.zbNameOptions = data.data.map((list: any) => {
        return {
          label: list.zbmc,
          value: list.zbmc,
        };
      });
    });
  }

  getBtn(index: number) {
    this.loading = true;
    this.activeIndex = index;
    if (index == 0) {
      this.columns = this.columns1;
    } else {
      this.columns = this.columns2;
    }
    this.onpage();
  }

  async getzbTypeData() {
    let url = "wjServer/szszy/exLaw/getZblxList";
    await publicApi.getNoParam(url).then((data: any) => {
      this.zbTypeOptions = data.data.map((list: any) => {
        return {
          label: list.zblx,
          value: list.zblx,
        };
      });
    });
  }

  onSearch(val: string) {
    if (this.activeIndex == 0) {
      this.tableParams.zjbh = val;
    }
    else{
      this.tableParams.ppjxh = val;
    }
    this.loading = true;
    this.pageParams.current = 1;
    this.onpage();
  }

  ondelete(row: any) {
    this.delmodel = true;
    if (this.activeIndex == 0) {
      this.delParams = {
        id: row.zfzjbh,
      };
    }
    else{
       this.delParams = {
        id: row.id,
      };
    }
  }
  cancel(val: any) {
    this.delmodel = val;
  }
  async save() {
    this.delLoading = true;
    let url = "";
    if (this.activeIndex == 0) {
      url = "wjServer/szszy/exLaw/delZfryInfo";
    } else {
      url = "wjServer/szszy/exLaw/delZfzbInfo";
    }
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
    if (this.activeIndex == 0) {
      this.formParams = {
      ssdw:'水利局',
    };
    }
    else{
      this.formParams = {
        ssxz:'水利局'
      };
    }
    
  }

  // 编辑
  onedit(row: any) {
    this.formParams = {
     
    };
    this.btnFlag = "edit";
    this.modalTitle = "编辑";
    if (this.activeIndex == 0) {
      this.editInfo(row.zfzjbh);
    }
    else{
      this.editInfo(row.id);
    }
    this.model = true;
  }

  async editInfo(id: any) {
    let url = "";
    if (this.activeIndex == 0) {
      url = "wjServer/szszy/exLaw/getZfryDetail";
    } else {
      url = "wjServer/szszy/exLaw/getZfzbDetail";
    }
    let params = {
      id: id,
    };
    let data = await publicApi.getWithParam(url, params);
    this.formParams = data.data;
  }

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
    var url = "";
    if (this.activeIndex == 0) {
      url = "wjServer/szszy/exLaw/addZfryInfo";
    } else {
      url = "wjServer/szszy/exLaw/addZfzbInfo";
    }
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
    var url = "";
    if (this.activeIndex == 0) {
      url = "wjServer/szszy/exLaw/editZfryInfo";
    } else {
      url = "wjServer/szszy/exLaw/editZfzbInfo";
    }
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
    let url = "";
    if (this.activeIndex == 0) {
      url = "wjServer/szszy/exLaw/zfryInfoList";
    } else {
      url = "wjServer/szszy/exLaw/zfzbInfoList";
    }
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

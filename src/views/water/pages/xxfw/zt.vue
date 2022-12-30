<template>
  <!--应急预警-->
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
          <!-- <div class="top-item-sub">
            <suc-date-picker
              v-model="tableParams.startTime"
              :options="{
                type: 'month',
                clearable: true,
                placeholder: '开始时间',
              }"
              style="width: 200px"
            ></suc-date-picker>
          </div>
          <div class="top-item-sub">
            <suc-date-picker
              v-model="tableParams.endTime"
              :options="{
                type: 'month',
                clearable: true,
                placeholder: '结束时间',
              }"
              style="width: 200px"
            ></suc-date-picker>
          </div> -->
          <div class="top-item-sub">
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
          </div>
          <div class="top-item-sub">
            <search-component placeholderTxt="单位名称" @input="onSearch">
            </search-component>
          </div>
        </div>
        <div class="top-item">
          <el-upload
              type="success"
              style="margin-right:15px;display:inline-block"
              size="small"
              :headers="uploadHeaders"
              :on-success="PicSuccess"
              action="api/wjServer/szszy/carrier/import"
              accept=".xls,.xlsx"
              v-if="activeIndex == 1"
              :show-file-list="false"
            >
              <suc-button type="success" :debounce="800" >导入</suc-button>
            </el-upload>
          <suc-button v-if="activeIndex == 1" type="primary"  style="margin-right:15px;display:inline-block" :debounce="800" @on-click="exportExcel">导出</suc-button>
          <suc-button v-if="activeIndex == 0" type="primary" :debounce="800" @on-click="onadd"
            >{{activeIndex == 0?'新增水平测试':'新增载体'}}</suc-button
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
    <zt-modal
      :title="modalTitle"
      :model="model"
      :loading="loading"
      :activeIndex="activeIndex"
      :formParams="formParams"
      @on-submit="oncreate"
      @toggle="toggle"
    ></zt-modal>
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

import { DeleteModal, ztModal } from "../model";
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
    ztModal,
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
  btns: any[] = ["水平衡测试管理", "载体创建管理"];
  uploadHeaders:any = {"Authorization":'bearer ' + localStorage.getItem("refresh-token")}
  tableParams: any = {
    pageNumber: "",
    pageSize: "",
    town:'',
    dwmc:''
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
      title: "所属乡镇",
      key: "town",
    },
    {
      title: "管理单位名称",
      key: "dwmc",
    },
    {
      title: "所属类别",
      key: "sslb",
    },
    {
      title: "等级",
      key: "level",
    },
    {
      title: "通过时间",
      key: "accessTime",
    },
    {
      title: "次数",
      key: "num",
    },
    {
      title: "是否节水型企业",
      key: "ifjieshui",
    },
  ];
  //   查
  columns2: any = [
    {
      title: "序号",
      type: "index",
    },
    {
      title: "所属乡镇",
      key: "town",
    },
    {
      title: "管理单位名称",
      key: "dwmc",
    },
    {
      title: "最近水平衡测试时间",
      key: "zjcssj",
    },
    {
      title: "等级",
      key: "level",
    },
    {
      title: "公布节水型载体文件",
      key: "wj",
    },
  ];
  columns: any = this.columns1;
  mounted() {
    this.onpage();
    this.getAreaData();
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

  PicSuccess(file: any) {
    if (file.result) {
      this.$Message.success('导入成功')
        this.onpage();
    }
    else{
      this.$Message.error('导入失败')
    }
  }

  //  导出表格
  exportExcel() {
    let url =
      
      "/api/wjServer/szszy/carrier/export?town=" +
      this.tableParams.town +
      "&dwmc=" +
      this.tableParams.dwmc
    window.location.href = url; //原窗口打开
    // window.open(url); // 重新打开新窗口
  }

  onSearch(val: string) {
    this.loading = true;
    this.pageParams.current = 1;
    this.tableParams.dwmc = val;
    this.onpage();
  }

  ondelete(row: any) {
    console.log("00--", row);

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
    let url = "";
    if (this.activeIndex == 0) {
      url = "wjServer/szszy/carrier/delSphcsInfo";
    } else {
      url = "wjServer/szszy/carrier/delZtcjInfo";
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
    this.formParams = {
      minIoFileList: [],
      imgList: [],
    };
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
    let url = "";
    if (this.activeIndex == 0) {
      url = "wjServer/szszy/carrier/getSphcsDetail";
    } else {
      url = "wjServer/szszy/carrier/getZtcjDetail";
    }
    let params = {
      id: id,
    };
    let data = await publicApi.getWithParam(url, params);
    this.formParams = data.data;
    this.formParams.imgList = data.data.minIoFileList.map((item: any) => {
      return {
        name: item.oldName,
        percentage: 100,
        uid: item.fileId,
        url: item.previewUrl,
        response: {
          data: {
            result: true,
            code: "0",
            fileId: item.fileId,
            oldName: item.oldName,
            bucket: "file",
            previewUrl: item.previewUrl,
          },
        },
      };
    });
  }

  async oncreate() {
    this.formParams.accessTime = this.$utils.dateFormat(
      new Date(this.formParams.accessTime),
      "yyyy-MM"
    );
    this.formParams.nf = this.$utils.dateFormat(
      new Date(this.formParams.nf),
      "yyyy-MM"
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
    var url = "";
    if (this.activeIndex == 0) {
      url = "wjServer/szszy/carrier/addSphcsInfo";
    } else {
      url = "wjServer/szszy/carrier/addZtcjInfo";
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
      url = "wjServer/szszy/carrier/editSphcsInfo";
    } else {
      url = "wjServer/szszy/carrier/editZtcjInfo";
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
    // this.tableParams.startTime = this.$utils.dateFormat(
    //   new Date(this.tableParams.startTime),
    //   "yyyy-MM"
    // );
    // this.tableParams.endTime = this.$utils.dateFormat(
    //   new Date(this.tableParams.endTime),
    //   "yyyy-MM"
    // );
    let url = "";
    if (this.activeIndex == 0) {
      url = "wjServer/szszy/carrier/sphInfoList";
    } else {
      url = "wjServer/szszy/carrier/ztcjInfoList";
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

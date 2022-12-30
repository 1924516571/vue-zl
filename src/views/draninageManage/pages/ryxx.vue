<template>
  <!--排水企业-->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
             <div class="top-item-sub">
             <suc-date-picker
                v-model="ryxxParams.entryTime"
                :options="{
                type: 'date',
                clearable: true,
                placeholder: '请选择日期',
                }"
                style="width: 100%"
            ></suc-date-picker>
          </div>
           
          <div class="top-item-sub">
             <suc-input
              v-model="ryxxParams.name"
              style="width: 200px"
              placeholder= '人员姓名'
            >
            </suc-input>
          </div>
          <div class="top-item-sub">
            <suc-button type="primary" @on-click="onSearch">搜索</suc-button>
          </div>
        </div>
        <div class="top-item">
          <el-upload
              type="success"
              style="margin-right:15px;display:inline-block"
              size="small"
              :headers="uploadHeaders"
              :on-success="PicSuccess"
              action="api/wjServer/paishui/user/import"
              accept=".xls,.xlsx"
              :show-file-list="false"
            >
              <suc-button type="success" :debounce="800" >导入</suc-button>
            </el-upload>
          <suc-button type="primary" :debounce="800" @on-click="exportExcel">导出</suc-button>
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
              <span @click="onedit(row)">详情</span>
              <!-- <span @click="ondelete(row)">删除</span> -->
            </div>
          </template>
          <template v-slot:title="{ row }">
            <a :href="row.url"></a>
          </template>
        </table-page>
      </div>
    </div>

    <ryxx-modal
      :title="modalTitle"
      :model="model"
      :loading="loading"
      :formParams="formParams"
      @on-submit="oncreate"
      @toggle="toggle"
    ></ryxx-modal>

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
import { ryxxModal, DeleteModal } from "./model";
import { publicApi } from "@/api";
@Component({
  components: {
    SucButton,
    SucInput,
    SearchComponent,
    TablePage,
    ryxxModal,
    SucDatePicker,
    DeleteModal,
    SucSelect,
  },
})
export default class Psgw extends Vue {
  modalTitle: string = ""; //弹窗标题
  loading: boolean = false;
  delLoading: boolean = false;
  btnFlag: string = ""; //区分编辑和新增
  tableData: any[] = [];
  time: any = "";
  params: any = {};
  bbType: any = [];
  bbOptions: any = [];
  formParams: any = {};
  areaOptions: any = [];
  uploadHeaders:any = {"Authorization":'bearer ' + localStorage.getItem("refresh-token")}

  //   删
  delmodel: boolean = false;
  delParams: any = {};

  mounted() {
    this.onpage();
    this.getBb();
  }

  async getBb() {
    let url = "wjServer/paishui/PN/areas";
    let data = await publicApi.getNoParam(url);
    this.areaOptions = data.data.map((e: any) => {
      let item = {
        value: e.codeMyid,
        label: e.name,
      };
      return item;
    });
  }

  
  //  导出表格
  exportExcel() {
    if (this.ryxxParams.entryTime == '') {
        this.ryxxParams.entryTime = ''
    }
    else{
        this.ryxxParams.entryTime = this.$utils.dateFormat(new Date(this.ryxxParams.entryTime),"yyyy-MM-dd");
    }
    let url =
      "/api/wjServer/paishui/user/export?entryTime=" +
      this.ryxxParams.entryTime +
      '&name=' + this.ryxxParams.name
    window.location.href = url; //原窗口打开
    // window.open(url); // 重新打开新窗口
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

  async handleChange(value: any) {
    this.formParams.area = value.toString();
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
    let url = "wjServer/fangxunjc/disaster/delInfo";
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
    this.formParams = {
      busiFxStWaterproject: {},
      busiFxStFlooded: {},
    };
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
      this.setCreate();
    } else if (this.btnFlag == "edit") {
      this.setEdit();
    }
    this.model = false;
  }
  //  新增
  async setCreate() {
    let url = "wjServer/fangxunjc/disaster/addInfo";
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
  model: boolean = false;
  toggle(val: boolean) {
    this.model = val;
  }
  // 编辑
  onedit(row: any) {
    this.model = true;
    this.formParams = {
    };
    this.btnFlag = "edit";
    this.modalTitle = "详情";
    this.editInfo(row.id);
  }
  // 详情
  async editInfo(params: any) {
    let url = "wjServer/paishui/user";
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
      title: "姓名",
      key: "name",
    },
    {
      title: "性别",
      key: "sex",
    },
    {
      title: "出生年月",
      key: "birthtime",
    },
    {
      title: "籍贯",
      key: "nativeplace",
    },
    {
      title: "现学历",
      key: "currenteducation",
    },
    {
      title: "入职时间",
      key: "entrytime",
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
  ryxxParams: any = {
    pageNumber: "",
    pageSize: "",
    name:'',
    entryTime:'',
  };

  // 列表
  async onpage() {
    this.ryxxParams.pageNumber = this.pageParams.current;
    this.ryxxParams.pageSize = this.pageParams.pageSize;
    console.log("43",this.ryxxParams.entryTime == '');
    
    if (this.ryxxParams.entryTime == '') {
        this.ryxxParams.entryTime = ''
    }
    else{
        this.ryxxParams.entryTime = this.$utils.dateFormat(new Date(this.ryxxParams.entryTime),"yyyy-MM-dd");
    }
    let url = "wjServer/paishui/user/page";
    let data = await publicApi.getWithParam(url, this.ryxxParams);
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

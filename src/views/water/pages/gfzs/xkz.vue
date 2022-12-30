<template>
  <!--许可证监督-->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
            <suc-input v-model="tableParams.companyname" placeholder='单位名称' style="width:160px"></suc-input>
          </div>
          <div class="top-item-sub">
            <search-component placeholderTxt="许可证编号" @input="onSearch">
            </search-component>
          </div>
        </div>
        <div class="top-item">
            <el-upload
              type="success"
              style="margin-right: 10px;"
              size="small"
              :headers="uploadHeaders"
              :on-success="PicSuccess"
              action="api/wjServer/szszy/license/import"
              accept=".xls,.xlsx"
              :show-file-list="false"
            >
              <el-button size="small" type="success">导入Excel</el-button>
            </el-upload>
           <suc-button style="margin-right:15px" type="primary" :debounce="800" @on-click="downLoad"
            >模板下载</suc-button
          >
           <suc-button type="primary" :debounce="800" @on-click="dc"
            >导出</suc-button
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
          </template>
        </j-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucButton, SucInput, SucDatePicker, SucSelect } from "@suc/ui";
import { SearchComponent, TablePage, TabActive, JTable } from "@/components";

import { publicApi } from "@/api";
@Component({
  components: {
    SucButton,
    SucInput,
    SearchComponent,
    TablePage,
    SucDatePicker,
    SucSelect,
    TabActive,
    JTable,
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
  uploadHeaders:any = {"Authorization":'bearer ' + localStorage.getItem("refresh-token")}
  model: boolean = false;
  tableParams: any = {
    companyname:'',
    companycode:'',
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
      title: "所属乡镇",
      key: "areaname",
    },
    {
      title: "单位名称",
      key: "companyname",
    },
    {
      title: "许可证编号",
      key: "licensenum",
    },
    {
      title: "统一社会信用代码",
      key: "companycode",
    },
    {
      title: "取水权人名称",
      key: "qsrightperson",
    },
    {
      title: "取水地址",
      key: "address",
    },
    {
      title: "水源类型",
      key: "sytype",
    },
    {
      title: "取水类型",
      key: "qstype",
    },
    {
      title: "年取水量",
      key: "yearsofwithdrawals",
    },
    {
      title: "有效开始日期",
      key: "stratdateStr",
    },
    {
      title: "有效结束日期",
      key: "enddateStr",
    },
    {
      title: "联系人",
      key: "linkman",
    },
    {
      title: "联系电话",
      key: "tel",
    },
  ];

  PicSuccess(file: any) {
        this.onpage();
  }

  downLoad(){
    location.href = "api/wjBaseServer/minio/file/downloadLicenseModel"
    // let url = "wjBaseServer/minio/file/downloadLicenseModel";
    // publicApi.getNoParam(url).then((data: any) => {
    // });
  }

  mounted() {
    this.onpage();
    // this.getAreaData();
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
    this.tableParams.companycode = val;
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

  dc() {
    location.href = "api/wjServer/szszy/license/export?companyname=" + this.tableParams.companyname + '&companycode=' + this.tableParams.companycode
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
    // this.tableParams.year = this.$utils.dateFormat(
    //   new Date(this.tableParams.year),
    //   "yyyy"
    // );
    let url = "wjServer/szszy/license/page";
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
      height: calc(100% - 70px);
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

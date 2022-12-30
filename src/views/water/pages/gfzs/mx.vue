<template>
  <!--许可证监督-->
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
                placeholder: '请选择年份',
              }"
              style="width: 150px"
            ></suc-date-picker>
          </div>
          <!-- <div class="top-item-sub">
            <search-component placeholderTxt="许可证编号" @input="onSearch">
            </search-component>
          </div> -->
          <div class="top-item-sub">
            <suc-button type="primary" :debounce="800" @click="onSearch">搜索</suc-button>
          </div>
        </div>
        <div class="top-item">
            <el-upload
              type="success"
              style="margin-right: 10px;"
              size="small"
              :headers="uploadHeaders"
              :on-success="PicSuccess"
              action="api/wjServer/szszy/fee/import"
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
            <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="area" label="乡镇" width="120"></el-table-column>
                <el-table-column prop="year" label="年度" width="50"></el-table-column>
                <el-table-column label="1季度">
                    <el-table-column prop="firquarterwater" label="水量（m³）"></el-table-column>
                    <el-table-column prop="firquarterszyfee" label="规费（元）"></el-table-column>
                </el-table-column>
               <el-table-column label="2季度">
                    <el-table-column prop="secquarterwater" label="水量（m³）"></el-table-column>
                    <el-table-column prop="secquarterszyfee" label="规费（元）"></el-table-column>
                </el-table-column>
                <el-table-column label="3季度">
                    <el-table-column prop="thrquarterwater" label="水量（m³）"></el-table-column>
                    <el-table-column prop="thrquarterengfee" label="规费（元）"></el-table-column>
                </el-table-column>
                <el-table-column label="4季度">
                    <el-table-column prop="fourquarterwater" label="水量（m³）"></el-table-column>
                    <el-table-column prop="fourquarterszyfee" label="规费（元）"></el-table-column>
                </el-table-column>
                <el-table-column label="全年">
                    <el-table-column prop="yearwater" label="水量总计（m³）"></el-table-column>
                    <el-table-column prop="yearszyfee" label="规费总计（元）"></el-table-column>
                </el-table-column>
                <el-table-column prop="nt" label="备注"></el-table-column>
                <el-table-column label="操作" width="80">
                  <div class="btn" slot-scope="scope">
                    <span @click="onedit(scope.row)">详情</span>
                  </div>
                </el-table-column>
          </template>
        </j-table>
      </div>
    </div>
    <!-- 新增数据弹框 -->
    <mx-modal
      :title="modalTitle"
      :model="model"
      :cs="cs"
      @on-submit="oncreate"
      @toggle="toggle"
    ></mx-modal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucButton, SucInput, SucDatePicker, SucSelect } from "@suc/ui";
import { SearchComponent, TablePage, TabActive, JTable } from "@/components";
import { mxModal } from "../model";
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
    mxModal
  },
})
export default class Plan extends Vue {
  modalTitle: string = ""; //弹窗标题
  loading: boolean = false;
  delLoading: boolean = false;
  btnFlag: string = ""; //区分编辑和新增
  tableData: any[] = [];
  time: any = "";
  cs:any ='';
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
    pageNumber: "",
    pageSize: "",
    year:''
  };
  //   删
  delmodel: boolean = false;
  delParams: any = {};

  PicSuccess(file: any) {
        this.onpage();
  }

  downLoad(){
    location.href = "api/wjBaseServer/minio/file/downloadModel?fileName=雪堰2022年度月抄表情况明细表8月.xls"
  }

  mounted() {
    this.onpage();
    // this.getAreaData();
  }

  onedit(row: any) {
    console.log("00",row);
    this.model = true;
    this.modalTitle = "详情";
    this.cs = row.uuid
  }

  toggle(val: boolean) {
    this.model = val;
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
    location.href = "api/wjServer/szszy/fee/export?year=" + this.tableParams.year + '&area=""'
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
    if (this.tableParams.year) {
      this.tableParams.year = this.$utils.dateFormat(
        new Date(this.tableParams.year),
        "yyyy"
      );
    }
    else{
      this.tableParams.year = ''
    }
    let url = "wjServer/szszy/fee/yearPage";
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

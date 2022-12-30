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
            <div class="top-item-sub" >
                <suc-date-picker
                v-model="tableParams.year"
                :options="{
                    type: 'year',
                    clearable: true,
                    placeholder: '请选择年度',
                }"
                style="width: 200px"
                ></suc-date-picker>
            </div>
         <div class="top-item-sub" v-if="activeIndex == 1">
            <suc-select
              v-model="tableParams.ssxz"
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
              style="margin-right: 10px;"
              size="small"
              :on-success="PicSuccess"
              :action="activeIndex == 0? 'api/wjServer/szszy/rpaln/importXdjh': 'api/wjServer/szszy/rpaln/importJxkh'"
              accept=".xls,.xlsx"
              :show-file-list="false"
            >
              <el-button size="small" type="success">导入Excel</el-button>
            </el-upload>
          <suc-button type="primary" :debounce="800" @on-click="downLoad"
            >模板下载</suc-button
          >
        </div>
      </div>
      <div class="content">
          <!-- key很关键用于解决组件复用带来的表头渲染问题！！！！ -->
        <j-table
          :key="tableRefresh"   
          :tableData="tableData"
          :pageParams="pageParams"
          @get-page="getPage"
          @get-size="getSize"
        >
            <template v-slot:column >
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="year" label="年度" width="50"></el-table-column>
                <el-table-column prop="dwmc" label="单位名称" width="280"></el-table-column>
                <template v-if="activeIndex == 0">
                    <el-table-column prop="ysjhh" label="用水企业编号"></el-table-column>
                    <el-table-column label="计划用水量（吨）">
                        <el-table-column prop="nZilaishui" label="自来水"></el-table-column>
                        <el-table-column prop="nDbshui" label="地表水"></el-table-column>
                        <el-table-column prop="nDxshui" label="地下水"></el-table-column>
                    </el-table-column>
                </template>
                <template v-if="activeIndex == 1">
                    <el-table-column prop="ssxz" label="所属乡镇" width="150"></el-table-column>
                    <el-table-column label="计划用水量（m3）">
                    <el-table-column label="第一季度" width="120">
                        <el-table-column prop="jhYjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jhYjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jhYjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第二季度" width="120">
                        <el-table-column prop="jhEjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jhEjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jhEjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第三季度" width="120">
                        <el-table-column prop="jhSjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jhSjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jhSjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第四季度" width="120">
                        <el-table-column prop="jhFjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jhFjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jhFjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    </el-table-column>
                    <el-table-column label="实际用水量（m3）">
                    <el-table-column  label="第一季度" width="120">
                        <el-table-column prop="sjYjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="sjYjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="sjYjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第二季度" width="120">
                        <el-table-column prop="sjEjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="sjEjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="sjEjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第三季度" width="120">
                        <el-table-column prop="sjSjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="sjSjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="sjSjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第四季度" width="120">
                        <el-table-column prop="sjFjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="sjFjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="sjFjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    </el-table-column>
                    <el-table-column label="节超用水量（m3）">
                    <el-table-column label="第一季度" width="120">
                        <el-table-column prop="jcYjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jcYjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jcYjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第二季度" width="120">
                        <el-table-column prop="jcEjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jcEjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jcEjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第三季度" width="120">
                        <el-table-column prop="jcJcdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jcJcdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jcJcdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="第四季度" width="120">
                        <el-table-column prop="jcFjdZls" label="自来水" width="120"></el-table-column>
                        <el-table-column prop="jcFjdDbs" label="地表水" width="120"></el-table-column>
                        <el-table-column prop="jcFjdDxs" label="地下水" width="120"></el-table-column>
                    </el-table-column>
                    </el-table-column>
                    <el-table-column prop="bz" label="备注" width="120"></el-table-column>
                </template>
            </template>
          
        </j-table>
      </div>
      
    </div>
    <plan-modal
      :title="modalTitle"
      :model="model"
      :loading="loading"
      :activeIndex="activeIndex"
      :uploadData="uploadData"
      @on-submit="oncreate"
      @toggle="toggle"
    ></plan-modal>
  </div>
  
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucButton, SucInput, SucDatePicker, SucSelect } from "@suc/ui";
import { SearchComponent, TablePage, TabActive, JTable } from "@/components";

import { DeleteModal,planModal } from "../model";
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
    planModal
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
  tableRefresh:any = 0;
  formParams: any = {};
  uploadData:any = [];
  formParams1: any = {};
  areaOptions: any = [];
  model: boolean = false;
  btns: any[] = ["下达计划", "绩效考核"];
  tableParams: any = {
    pageNumber: "",
    pageSize: "",
  };
  //   删
  delmodel: boolean = false;
  delParams: any = {};
  mounted() {
    this.onpage();
    this.getAreaData();
  }

  getBtn(index: number) {
    this.activeIndex = index;
    this.onpage();
  }

  PicSuccess(file: any) {
    if (file.data instanceof Array) {
      this.uploadData = file.data;
      this.onadd()
    }
    else{
      this.uploadData = [];
      this.$Message.error(file.data)
    }
    
  }

  async getAreaData(){
    let url = 'wjServer/szszy/rpaln/townList';
    await publicApi.getNoParam(url).then((data: any) => {
        console.log("00",data);
        this.areaOptions = data.data.map((list:any)=>{
          return {
            label:list.key,
            value:list.key
          }
        })
        
    })
  }

  onSearch(val: string) {
    this.loading = true;
    this.pageParams.current = 1;
    this.tableParams.dwmc = val;
    this.onpage();
  }

  ondelete(row: any) {
    this.delmodel = true;
    this.delParams = {
      id: row.erId,
    };
  }
  cancel(val: any) {
    this.delmodel = val;
  }
  async save() {
    this.delLoading = true;
    let url = "wjServer/fangxunjc/ermanager/delInfo";
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
    this.modalTitle = "导入内容";
  }

  downLoad(){
    if (this.activeIndex == 0) {
      location.href = "api/wjServer/下达计划.xls"
    }
    else{
      location.href = "api/wjServer/绩效考核.xls"
    }
  }
  async oncreate() {
    this.$Message.success('导入成功!')
    this.model = false;
    this.onpage()
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
    let url = ''
    if (this.activeIndex == 0) {
      url = "wjServer/szszy/rpaln/planinfoList";
    }
    else{
      url = "wjServer/szszy/rpaln/khInfoList";
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
  @Watch('activeIndex')
  refresh(){
      console.log("000");
      
      this.tableRefresh++
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

<template>
  <!--发文查询-->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
            <suc-select
              v-model="fwParams.filetype"
              :options="typeOptions"
              style="width: 200px"
              :config="{ placeholder: '类别', clearable: true }"
            >
            </suc-select>
          </div>
          <div class="top-item-sub">
            <suc-input
              v-model="fwParams.keyword"
              style="width: 200px"
              placeholder= '关键词'
            >
            </suc-input>
          </div>
          <div class="top-item-sub">
            <suc-button type="primary" @on-click="onSearch">搜索</suc-button>
          </div>
        </div>
        <div class="top-item" v-if="qx">
          <suc-button type="primary" :debounce="800" @on-click="onadd"
            >新增发文</suc-button
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
          <template v-slot:operation="{ row }" >
            <div class="btn" >
              <span @click="swStatus(row)">收文状态</span>
              <span @click="onedit(row)">详情</span>
              <span @click="ondelete(row)">删除</span>
            </div>
          </template>
          <template v-slot:fileNumber="{ row }" >
            <span>{{row.fileXiala}}{{row.filenumber == ""?'': '('+row.fileYear+')'}}{{row.filenumber}}{{row.filenumber == ""?'':'号'}}</span>
          </template>
          <template v-slot:fj="{ row }" >
            <div class="btn" >
              <!-- <span @click="fjMod(row)">查看</span> -->
              <el-popover
                placement="right"
                width="300"
                :key="row.id"
                trigger="click">
                <span v-if="row.fujianList.length==0">暂无附件</span>
                <a style="display:block" v-for="(list,index) in row.fujianList" :key="index" @click="downFj(list.previewUrl)">附件：{{list.oldName}}</a>
                <span slot="reference">下载</span>
              </el-popover>
            </div>
          </template>
          <template  v-slot:fileTitle="{ row }">
            <a @click="filePre(row)">{{row.title}}</a>
          </template>
        </table-page>
      </div>
    </div>
    <el-popover>
      
    </el-popover>
    <fw-modal
      :title="modalTitle"
      :model="model"
      :loading="loading"
      :formParams="formParams"
      @on-submit="oncreate"
      @toggle="toggle"
    ></fw-modal>

    <sw-modal
      title="收文状态"
      :model="model1"
      :formParams="formParams1"
      @toggle="toggle1"
    ></sw-modal>


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
import { fwModal, DeleteModal,swModal } from "./model";
import { publicApi } from "@/api";
@Component({
  components: {
    SucButton,
    SucInput,
    SearchComponent,
    TablePage,
    fwModal,
    SucDatePicker,
    DeleteModal,
    SucSelect,
    swModal
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
  bbType: any = [];
  typeOptions: any = [];
  formParams: any = {};
  formParams1: any = [];
  areaOptions: any = [];
  qx:any = false;
  //   删
  delmodel: boolean = false;
  delParams: any = {};

  mounted() {
    this.onpage();
    this.getType();
  }

  filePre(e:any){
    let url = "wjServer/oa/sendfile/chashou";
    let params = {
      depid:localStorage.getItem("departmentId"),
      fileid:e.id,
    }
    publicApi.putWithParamJson(url, params)
    window.open(e.minIoFileList[0].previewUrl)
  }


  downFj(url:any){
    window.open(url)
  }
  //公文类型
  async getType() {
    let url = "wjServer/oa/sendfile/fileTypeList";
    let data = await publicApi.getNoParam(url);
    this.typeOptions = data.data.map((e: any) => {
      let item = {
        value: e.code,
        label: e.level,
      };
      return item;
    });
  }

  async handleChange(value: any) {
    this.formParams.area = value.toString();
  }

  fjMod(row:any){
    
    
  }

  ondelete(row: any) {
    this.delmodel = true;
    this.delParams = {
      id: row.id,
    };
  }

  async swStatus(row: any){
    let url = "wjServer/oa/sendfile/shouWenStatus";
    let data = await publicApi.getWithParam(url,{id:row.id});
    this.formParams1 = data.data
    this.model1 = true
  }
  cancel(val: any) {
    this.delmodel = val;
  }
  async save() {
    this.delLoading = true;
    let url = "wjServer/oa/sendfile/delInfo";
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
      imgList: [],
      imgList1: [],
      minIoFileList: [],
      fujianList: [],
    };
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
    this.formParams.yftime = this.$utils.dateFormat(
      new Date(this.formParams.yftime),
      "yyyy-MM-dd"
    );
    let url = "wjServer/oa/sendfile/addInfo";
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
    this.loading = false;
  }
  model: boolean = false;
  model1: boolean = false;
  toggle(val: boolean) {
    this.model = val;
  }
  toggle1(val: boolean) {
    this.model1 = val;
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
    let url = "wjServer/oa/sendfile/getDetail";
    let detailParams = {
      id: params,
    };
    let data = await publicApi.getWithParam(url, detailParams);
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
    this.formParams.imgList1 = data.data.fujianList.map((item: any) => {
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

  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "类别",
      key: "filetype",
      width:"100"
    },
    {
      title: "标题",
      key: "title",
      slot:'fileTitle',
    },
    {
      title: "文号",
      // key: "filenumber",
      slot:'fileNumber',
    },
    {
      title: "发送时间",
      key: "sendTimeStr",
    },
    {
      title: "发文状态",
      key: "filestatus",
    },
    {
      title: "收文状态",
      key: "jsStatus",
      isShow:false
    },
    {
      title: "操作",
      slot: "operation",
      isShow:false
    },
    {
      title: "附件",
      slot:'fj',
      width:'100'
    },
  ];

  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  fwParams: any = {
    pageNumber: "",
    pageSize: "",
    keyword: "",
    filetype: "",
  };

  // 列表
  async onpage() {
    this.fwParams.pageNumber = this.pageParams.current;
    this.fwParams.pageSize = this.pageParams.pageSize;
    let url = "wjServer/oa/sendfile/infoList";
    let data = await publicApi.getWithParam(url, this.fwParams);
    console.log("00", data);

    this.pageParams.total = parseInt(data.data.total);
    this.tableData = data.data.rows;
    this.columns[6].isShow = !data.data.ret
    this.columns[7].isShow = data.data.ret
    this.qx= data.data.ret
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
          &:nth-of-type(3) {
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

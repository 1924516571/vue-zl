<template >
  <div class="info">
    <div class="info-view bg-shadow ">
      <div class="top ">
        <div class="top-item">
          <div class="top-item-sub">
            <suc-select v-model="tableParams.tradeId" :options="hyOptions" :config="{ placeholder: '行业名称', clearable: false }" style="width:160px"></suc-select>
          </div>
           <div class="top-item-sub">
            <suc-input v-model="tableParams.companyId" placeholder='用水计划号' style="width:160px"></suc-input>
          </div>
          <div class="top-item-sub">
            <search-component placeholderTxt="企业名称" @input="onSearch"> </search-component>
          </div>
        </div>
        <div class="top-item">
          <suc-button  style="margin-right:15px" :debounce="800" @on-click="onDown">模板下载</suc-button>
          <suc-button type="primary" :debounce="800" @on-click="onadd">非居民用水单位注册</suc-button>
        </div>
      </div>
      <div class="content" >
        <table-page  :columns="columns" :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize">
          <template v-slot:operation="{ row }">
            <div class="btn">
              <span @click="onedit(row)">详情</span>
            </div>
          </template>
        </table-page>
      </div>
    </div>

    <!-- 新增数据弹框 -->
    <ysdw-modal :title="modalTitle" :model="model" :btnFlag='btnFlag' :loading="loading" :formParams="formParams" @on-submit="oncreate" @toggle="toggle"></ysdw-modal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucSelect, SucButton, SucInput, SucFormItem } from "@suc/ui";
// import { SelectConfig, SelectOptions } from "@suc/ui/interfaces";
import { SearchComponent, TablePage } from "@/components";
import { YsdwModal } from "../model";
import { infoApi, publicApi } from "@/api";
import dayjs from "dayjs";
import { hyName } from "@/constants/status";

@Component({
  components: {
    SucSelect,
    SucButton,
    SucInput,
    SucFormItem,
    SearchComponent,
    TablePage,
    YsdwModal,
  },
})
export default class Enterprise extends Vue {
  modalTitle: string = ""; //弹窗标题
  loading: boolean = true;
  btnFlag: string = ""; //区分编辑和新增
  tableData: any[] = [];
  model: boolean = false;
  hyOptions: Array<any> = hyName; //行业
  quchongId:any = '' //用于编辑去重接口提供旧companyId
  formParams: any = {};
 //   查
  columns: any[] = [
    {
      type: "index",
      title: "序号",
      width: 150,
    },
    {
      title: "所属乡镇",
      key: "town",
    },
    {
      title: "用水单位名称",
      key: "companyName",
    },
    {
      title: "用水计划号（水表号）",
      key: "companyId",
    },
    {
      title: "行业",
      key: "tradeId",
    },
    {
      title: "联系人",
      key: "leaderName",
    },
    {
      title: "联系电话",
      key: "leaderTel",
    },
    {
      title: "通讯地址",
      key: "address1",
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
  
  tableParams: any = {
    pageNumber: "",
    pageSize: "",
    tradeId: hyName[0].value,
    companyId: "",
    companyName: "",
  };
  // 新增弹框
  onadd() {
    this.model = true;
    this.btnFlag = "add";
    this.modalTitle = "信息填报";
    this.formParams = {};
  }

  onDown(){
    location.href = 'api/wjServer/%E7%94%A8%E6%B0%B4%E5%8D%95%E4%BD%8D%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF.xls'
  }

  // 判断是新增还是编辑
  async oncreate(params:any) {
    
    if (this.btnFlag == "add") {
      this.setCreate(params);
    } else if (this.btnFlag == "edit") {
      this.setEdit(params);
    }
    this.model = false;
  }
  //  新增
  async setCreate(params:any) {
    let url1 = "wjServer/szszy/waterUnit/cdIsExistedWhereAdd";
    infoApi.getWithParam(url1,{companyId:params.companyId}).then((data:any)=>{
      if (data.data) {
        this.$message.error("该用水计划号已经重复!")
      }
      else{
        this.loading = true;
        let url = "wjServer/szszy/waterUnit/addInfo";
        infoApi.oncreate(params, url).then((data: any) => {
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
      }
    })
    
    this.onpage();
  }
  // 更新
  async setEdit(params:any) {
    let url1 = "wjServer/szszy/waterUnit/cdIsExistedWhenEdit";
    let data = {
      newId:params.companyId,
      oldId:this.quchongId
    }
    infoApi.getWithParam(url1,data).then((data:any)=>{
      if (data.data) {
        this.$message.error("该用水计划号已经重复!")
      }
      else{
        this.loading = true;
        params.oldId = this.quchongId;
        let url = "wjServer/szszy/waterUnit/editInfo";
        infoApi.jsonUpdate(params, url).then((data: any) => {
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
      }
    })
    this.onpage();
  }
  toggle(val: boolean) {
    this.model = val;
  }
  // 编辑
  onedit(row: any) {
    this.model = true;
    this.formParams = {};
    this.btnFlag = "edit";
    this.modalTitle = "编辑";
    let uuid = row.companyId;
    this.quchongId = row.companyId;
    this.editInfo(uuid);
  }
  // 详情
  async editInfo(uuidParams: any) {
    let url = "wjServer/szszy/waterUnit/getInfoById";
    let params = {
      companyId: uuidParams,
    };
    let data = await infoApi.getWithParam(url,params);
    if (data.result == true) {
      this.formParams = data.data;
    } else {
      this.$SucMessage.error("获取失败");
    }
  }
 
  mounted() {
    this.onpage(); //获取页面信息
  }

  
  

  // 列表
  async onpage() {
    this.tableParams.pageNumber = this.pageParams.current; //当前页码
    this.tableParams.pageSize = this.pageParams.pageSize; //一页多少条
    let url = "wjServer/szszy/waterUnit/infoList";
    let data = await publicApi.getWithParam(url, this.tableParams);
    if (data.result == true) {
      this.tableData = data.data.rows;
      this.pageParams.total = parseInt(data.data.total);
    } else {
      this.tableData = [];
    }
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
    this.tableParams.companyName = val;
    this.onpage();
  }
}
</script>
<style lang="scss" scoped>
.la{
  font-size: 20px;
  background-color: #36d;
}
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

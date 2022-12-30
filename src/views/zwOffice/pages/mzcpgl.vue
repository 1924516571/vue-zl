<template>
    <div class="info">
      <div class="info-view bg-shadow">
        <div class="top">
          <suc-button type="primary" :debounce="800" @on-click="onadd">新增测评</suc-button>
        </div>
        <div class="content">
          <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize">
            <template v-slot:operation="{ row }">
              <div class="btn">
                <span @click="onedit(row)">编辑</span>
                <span @click="ondelete(row)">删除</span>
              </div>
            </template>
            <template v-slot:cpUsers="{row}">
              <suc-button style="margin-left:-4%" type="primary" :debounce="800" @on-click="cpUsers(row)">查看测评人数统计</suc-button>
            </template>
            <template v-slot:results="{row}">
              <suc-button style="margin-left:-2%" type="primary" :debounce="800" @on-click="result(row)">查看</suc-button>
            </template>
          </table-page>
        </div>
      </div>
      <!-- 新增数据弹框 -->
      <mzcpgl-modal :title="modalTitle" :model="model" :loading="loading" :formParams="formParams" @on-submit="oncreate" @toggle="toggle" ></mzcpgl-modal>
      <mzcpglxz-modal :title="modalTitle" :modelxz="modelxz" :loading="loading" :formParams="formParams" @on-submit="oncreate" @toggle="toggle" ></mzcpglxz-modal>
      <mzcpgljg-modal :title="modalTitle" :model2="model2" :loading="loading" :formParams1="formParams1" @on-submit="result" @toggle="toggle" ></mzcpgljg-modal>
      <mzcpgltj-modal :title="modalTitle" :model3="model3" :loading="loading" :mzcptjParams="mzcptjParams" @on-submit="cpUsers" @toggle="toggle" ></mzcpgltj-modal>
      
      <!-- 删除弹框 -->
      <div class="delete-view" v-show="delmodel">
        <delete-modal @getignore="cancel" @getsave="save" v-loading="delLoading"></delete-modal>
      </div>
    </div>
  </template>
  <script lang="ts">
  import { Vue, Component, Watch } from "vue-property-decorator";
  import { SucSelect, SucButton, SucInput, SucFormItem } from "@suc/ui";
  import { DeleteModal, mzcpglModal, mzcpgljgModal, mzcpgltjModal,mzcpglxzModal} from "./model";
  import { SearchComponent, TablePage } from "@/components";
  import { infoApi, publicApi } from "@/api";
  @Component({
    components: {
      SucSelect,
      SucButton,
      SucInput,
      SucFormItem,
      SearchComponent,
      TablePage,
      mzcpglModal,
      DeleteModal,
      mzcpgljgModal,
      mzcpgltjModal,
      mzcpglxzModal,

    },
  })
  export default class Enterprise extends Vue {
    olMap = this.$getMapConfig();
    url: string = "wjServer/dataCenter/baseinfo/getStationType";
    addvcd: any = "";
    modalTitle: string = ""; //弹窗标题
    loading: boolean = true;
    delLoading: boolean = false;
    btnFlag: string = ""; //区分编辑和新增
    tableData: any[] = [];
    areaOptions: any = [];
    formParams1:any =[]
    mzcptjParams:any ={
      cpUsers:'',
      willCpUsers:''
    }
    formParams: any = {
      startTime:"",
      endTime:"",
      nt:"",
      activeUserIds:[],
      passiveUserIds:[],
      activeUserNames:[],
      passiveUserNames:[],
    };
    cpyh:any=[]
    wcpyh:any=[]
    //   删
    delmodel: boolean = false;
    delParams: any = {}; //删除的参数
   
    markers: any[] = [];
    mounted() {
      this.onpage(); //获取页面信息
    }
  
    async getAreaCode() {
      let data = await publicApi.getAreaCode();
      this.areaOptions = this.getTreeData([data.data]);
    }
    getTreeData(data: any) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined;
        } else {
          this.getTreeData(data[i].children);
        }
      }
      return data;
    }
  
    ondelete(row: any) {
      this.delmodel = true;
      this.delParams = {
        uuid: row.appraisalUuid,
      };
    }
    cancel(val: any) {
      this.delmodel = val;
    }
  
    async save() {
      this.delLoading = true;
      let url = "wjServer/oa/appraisal";
      infoApi.ondeleteWithParams(this.delParams, url).then((data: any) => {
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
      this.modelxz = true;
      this.model3 = false;
      this.btnFlag = "add";
      this.modalTitle = "新增测评";
      this.formParams = {
        startTime:"",
        endTime:"",
        nt:"",
        activeUserNames:[],
        passiveUserNames:[],
        activeUserIds:[],
        passiveUserIds:[],
      };
      this.markers = [];
    }
     // 编辑
     onedit(row: any) {
      this.model = true;
      this.model3 = false;
      this.btnFlag = "edit";
      this.modalTitle = "编辑测评";
      let uuid = row.appraisalUuid;
      this.editInfo(uuid);
    }
    // 测评数据
    result(row:any){
      this.formParams1 =row
      this.modalTitle = "测评结果";
      this.model2 = true;
      this.model3 = false;
    }
    // 统计数据
    cpUsers(row:any){
      for (let i = 0; i < row.cpUsers.length; i++) {
        this.cpyh.push(row.cpUsers[i].realname)
      }
      for (let j= 0; j < row.willCpUsers.length; j++) {
        this.wcpyh.push(row.willCpUsers[j].realname)
      }
      
      this.mzcptjParams ={
        cpUsers:this.cpyh,
        willCpUsers:this.wcpyh
      }

      this.modalTitle = "测评进度";
      this.model3 = true;
      this.cpyh=[]
      this.wcpyh=[]
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
      this.loading = true;
      // this.formParams = {
      //   startTime:"",
      //   endTime:"",
      //   nt:"",
      //   activeUserNames:[],
      //   passiveUserNames:[],
      //   activeUserIds:[],
      //   passiveUserIds:[],
      // };
      let url = "wjServer/oa/appraisal";
      this.formParams.startTime = this.$utils.dateFormat(
        new Date(this.formParams.startTime),
        "yyyy-MM-dd HH:mm:ss"
      );
      this.formParams.endTime = this.$utils.dateFormat(
        new Date(this.formParams.endTime),
        "yyyy-MM-dd HH:mm:ss"
      );
      infoApi.oncreate(this.formParams, url).then((data: any) => {
        if (data.result == true) {
          this.$SucMessage.info("新增成功");
          this.modelxz = false;
          this.onpage();
          this.loading = false;
        } else {
          this.$SucMessage.error("新增失败");
          this.modelxz = false;
          this.loading = false;
        } 
      });
      this.onpage();
    }
   
    // 更新
    async setEdit() {
      this.loading = true;
      let url = "wjServer/oa/appraisal";
      this.formParams.startTime = this.$utils.dateFormat(
        new Date(this.formParams.startTime),
        "yyyy-MM-dd HH:mm:ss"
      );
      this.formParams.endTime = this.$utils.dateFormat(
        new Date(this.formParams.endTime),
        "yyyy-MM-dd HH:mm:ss"
      );
      
      infoApi.jsonUpdate(this.formParams, url).then((data: any) => {
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
    model: boolean = false;
    modelxz: boolean = false;
    model2: boolean = false;
    model3: boolean = false;
    toggle(val: boolean) {
      this.model = val;
      this.modelxz = val;
      this.model2 = val;
      this.model3 = false;
    }
   
    // 详情
    async editInfo(uuidParams: any) {
      let url = "wjServer/oa/appraisal";
      let params = {
        uuid: uuidParams,
      };
      let data = await infoApi.getInfo(params, url);
      if (data.result == true) {
        this.formParams = {
          startTime: data.data.startTime,
          endTime: data.data.endTime,
          nt: data.data.nt,
          activeUserNames: data.data.activeUserNames,
          passiveUserNames: data.data.passiveUserNames,
          activeUserIds: data.data.activeUserIds,
          passiveUserIds: data.data.passiveUserIds,
          appraisalUuid:data.data.appraisalUuid
        };
      } else {
        this.$SucMessage.error("获取失败");
      }
    }
    //   查
    columns: any[] = [
      {
        title: "开始时间",
        key: "startTime",
      },
      {
        title: "结束时间",
        key: "endTime",
      },
      {
        title: "备注",
        key: "nt",
      },
      {
        title: "已测评人数/未测评人数",
        key: "cpUsers",
        slot:'cpUsers'
      },
      {
        title: "测评状态",
        key: "state",
      },
      {
        title: "测评结果",
        key: "results",
        slot:'results'
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
    pageYjParams: any = {
      total: 0,
      current: 1,
      pageSize: 10,
    };
    stationParams: any = {
      pageNumber: "",
      pageSize: "",
    };
  
    // 列表
    async onpage() {
      this.stationParams.pageNumber = this.pageParams.current; //当前页码
      this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
      let url = "wjServer/oa/appraisal/page";
      let data = await publicApi.getWithParam(url, this.stationParams);
      if (data.result == true) {
        this.tableData = data.data.rows;
        for(var i=0;i<this.tableData.length;i++){
        var time=parseInt(this.tableData[i].startTime)
        var d = new Date(time);    //开始时间对象
        var year=d.getFullYear()
        var month=d.getMonth()+1
        var day=d.getDate()
        let startTime=year + "年" + month + "月" +day +'日'
        this.tableData[i].startTime=startTime

        var time=parseInt(this.tableData[i].endTime)
        var d = new Date(time);    //结束时间对象
        var year=d.getFullYear()
        var month=d.getMonth()+1
        var day=d.getDate()
        let endTime=year + "年" + month + "月" +day +'日'
        this.tableData[i].endTime=endTime
      }
        this.pageParams.total = parseInt(data.data.total);
      } else {
        this.tableData = [];
        this.$SucMessage.error("获取失败");
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
      this.stationParams.name = val;
      this.onpage();
    }
  }
  </script>
  <style lang="scss" scoped>
  .rightfloat{
  display: flex;
  justify-content:flex-end;
  margin-bottom: 15px;
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
        justify-content: flex-end;
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
  
<template>
  <!-- 调水模型 -->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub"> 
            <suc-input placeholder="请输入模型名称" v-model="stationParams.modelName" style="margin-right:10px"> </suc-input>
            <suc-input placeholder="请输入源头河道" v-model="stationParams.sourceRiverName" style="margin-right:10px"> </suc-input>
            <suc-input placeholder="请输入目标河道" v-model="stationParams.targetRiverName" style="margin-right:10px"> </suc-input>
            <suc-button type="primary" :debounce="800" @on-click="onSearch">搜索 </suc-button>
          </div>
        </div>
        <div class="top-item">
          <suc-button type="primary" :debounce="800" @on-click="onadd">新增</suc-button>
        </div>
      </div>
      <div class="content">
        <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize">
          <template v-slot:operation="{ row }">
            <div class="btn">
              <span @click="onedit(row)">编辑</span>
              <span @click="ondelete(row)">删除</span>
            </div>
          </template>
        </table-page>
      </div>
    </div>

    <!-- 新增数据弹框 -->
    <dsmx-modal :title="modalTitle" :model="model" v-loading="loading" :formParams="formParams" @on-submit="oncreate" @toggle="toggle" :chuan="chuan"></dsmx-modal>
    <!-- 删除弹框 -->
    <div class="delete-view" v-show="delmodel">
      <delete-modal @getignore="cancel" @getsave="save" v-loading="delLoading"></delete-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucSelect, SucButton, SucInput, SucFormItem } from "@suc/ui";
// import { SelectConfig, SelectOptions } from "@suc/ui/interfaces";
import { SearchComponent, TablePage } from "@/components";
import { DeleteModal, QxdwModal, BzcsModal } from "../model";
import DsmxModal from "../model/DsmxModal.vue";
import { infoApi, publicApi } from "@/api";
@Component({
  components: {
    SucSelect,
    SucButton,
    SucInput,
    SucFormItem,
    SearchComponent,
    TablePage,
    DeleteModal,
    QxdwModal,
    BzcsModal,
    DsmxModal,
  },
})

export default class Enterprise extends Vue {
  olMap = this.$getMapConfig();
  areaOptions: any = [];
  modalTitle: string = ""; //弹窗标题
  loading: boolean = true;
  delLoading: boolean = false;
  btnFlag: string = ""; //区分编辑和新增
  tableData: any[] = [];
  chuan: any = [];
  formParams: any = {
    minIoFileList: [],
    modelname:"",
    targetrivername:"",
    targetriver:'',
    targetsectionname:"",
    targetsection:'',
    sourceriver:'',
    sourcerivername:"",
    sourcesection:'',
    sourcesectionname:"",
    crossrivername:"",
    crosssectionname:"",
    nt:"",
  };
  xzindexs:any=0
  //   删
  delmodel: boolean = false;
  delParams: any = {}; //删除的参数
  ondelete(row: any) {
    this.delmodel = true;
    this.delParams = {
      uuid: row.uuid,
    };
  }
  cancel(val: any) {
    this.delmodel = val;
  }
  async save() {
    this.delLoading = true;
    let url = "wjServer/waterENVIR/model";
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
    this.model = true;
    this.btnFlag = "add";
    this.modalTitle = "新增";
    this.formParams = {};
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
    let url = "wjServer/waterENVIR/model";
    infoApi.oncreate(this.formParams, url).then((data: any) => {
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
    this.loading = true;
    let url = "wjServer/waterENVIR/model";
    infoApi.jsonUpdate(this.formParams, url).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("更新成功");
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
  toggle(val: boolean) {
    this.model = val;
    
  }
  
  // 编辑
  onedit(row: any) {
    this.model = true;
    this.formParams = {};
    this.btnFlag = "edit";
    this.modalTitle = "编辑";
    let uuid = row.uuid;
    this.editInfo(uuid);
  }

  // 详情
  async editInfo(ckidParams: any) {
    let url = "wjServer/waterENVIR/model";
    let params = {
      uuid: ckidParams,
    };
    let data = await infoApi.getInfo(params, url);
    if (data.result == true) {
      this.formParams = {
        uuid:data.data.uuid,
        modelname:data.data.modelname,

        targetrivername:data.data.targetrivername,
        targetriver:data.data.targetriver,
        targetsection:data.data.targetsection,
        targetsectionname:data.data.targetsectionname,

        sourcerivername:data.data.sourcerivername,
        sourceriver:data.data.sourceriver,
        sourcesection:data.data.sourcesection,
        sourcesectionname:data.data.sourcesectionname,

        crossrivername:data.data.targetrivername,
        crosssection:data.data.crosssection,
        crossriver:data.data.crossriver,
        crosssectionname:data.data.crosssectionname,

        area: data.data.area ? data.data.area.split(",") : [],
      };
    } else {
      this.$SucMessage.error("获取失败");
    }
  }
  //   查
  columns: any[] = [
    {
      type: "index",
      title: "序号",
      // width: 150,
    },
    {
      title: "模型名称",
      key: "modelname",
    },
    {
      title: "源头河道",
      key: "sourcerivername",
    },
    {
      title: "源头河道断面",
      key: "sourcesectionname",
    },
    {
      title: "目标河道",
      key: "targetrivername",
    },
    {
      title: "目标河道断面",
      key: "targetsectionname",
    },
    {
      title: "过水河道",
      key: "crossrivername",
    },
    {
      title: "过水河道断面",
      key: "crosssectionname",
    },
    {
      title: "更新时间",
      key: "updatetime",
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
      fixed: "right",
    },
  ];

  // 从新定一个变量
  newColumns = [
    {
      type: "index",
      title: "序号",
      // width: 150,
    },
    {
      title: "模型名称",
      key: "modelname",
    },
    {
      title: "源头河道",
      key: "sourcerivername",
    },
    {
      title: "源头河道断面",
      key: "sourcesectionname",
    },
    {
      title: "目标河道",
      key: "targetrivername",
    },
    {
      title: "目标河道断面",
      key: "targetsectionname",
    },
    {
      title: "过水河道",
      key: "crossrivername",
    },
    {
      title: "过水河道断面",
      key: "crosssectionname",
    },
    {
      title: "更新时间",
      key: "updatetime",
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
      fixed: "right",
    },
  ];
  
  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };

  stationParams: any = {
    pageNumber: "",
    pageSize: "",
    sourceRiverName: "", 
    targetRiverName:"",
    modelName:"",
  };
  mounted() {
    this.onpage(); //获取页面信息
    
  }
  
  // 列表
  async onpage() {
    this.stationParams.pageNumber = this.pageParams.current; //当前页码
    this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
    let url = "wjServer/waterENVIR/model/page";
    let data = await publicApi.getWithParam(url, this.stationParams);
    if (data.result == true) {
      this.tableData = data.data.rows;
      
      for(var i=0;i<this.tableData.length;i++){
        var time=parseInt(this.tableData[i].updatetime)
          var d = new Date(time);    //根据时间戳生成的时间对象
          var year=d.getFullYear()
          var month=d.getMonth()+1
          var day=d.getDate()
          var hour=d.getHours()
          var minute=d.getMinutes()
          var second=d.getSeconds()
          //   if(month<10){
          //   month='0'+month
          // }
          // if(day<10){
          //   day='0'+day
          // }
          // if(hour<10){
          //   hour='0'+hour
          // }
          // if(minute<10){
          //   minute='0'+minute
          // }
          // if(second<10){
          //   second='0'+second
          // }
          let updatetime=year + "年" + month + "月" +day +'日'+ hour+':'+minute+':'+second
          this.tableData[i].updatetime=updatetime
      }
      if (this.tableData.length == 0) {
        this.columns.pop();
      } else {
        this.columns = this.newColumns;
      }
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
  //  点击查询拿到的值
  onSearch(val: string) {
    this.loading = true;
    this.pageParams.current = 1;
    this.stationParams.modelName
    this.stationParams.targetRiverName
    this.stationParams.sourceRiverName
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

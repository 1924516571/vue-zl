<template>
  <el-dialog :append-to-body="true" :title="title" :visible.sync="modelbcpr" :close-on-click-modal="true" :before-close="onCancel">
    <el-form :model="bcprParams" ref="cprForm" label-width="auto" size="small">
      <div>
        <el-input  v-model="czParams" placeholder="请输入人员姓名查询" style="width:20%" ></el-input>
        <el-button style="margin-left:20px;margin-bottom:30px" type="primary"  @click="onSearch()">查询</el-button>
        <div class="content-item">
          <table-page
            :columns="columns"
            :tableData="tableData"
            :pageParams="pageParams"
            v-loading="loading"
            customHeight="445"
            @get-page="getPage"
            @get-size="getSize"
          >
          <template v-slot:selection="{ row }">
            <suc-checkbox v-model="row.status" :debounce="800" @on-change="onCheck(row)"></suc-checkbox>
          </template>
          </table-page>
        </div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button class="btn" type="primary" @click="onOk()">提 交</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { SucModal, SucForm, SucFormItem, SucInput, SucSelect ,SucCheckbox,SucTable, SucTableColumn,} from "@suc/ui";
import { TablePage, SearchComponent } from "@/components";
import { publicApi } from "@/api";
@Component({
  components: {
    SucModal,
    SucForm,
    SucFormItem,
    SucInput,
    SucSelect,
    SearchComponent,
    TablePage,
    SucCheckbox,
    SucTable,
    SucTableColumn
  },
})
export default class cprModal extends Vue {
  @Prop() title!: string;
  @Prop() modelbcpr!: boolean; //控制弹框显隐
  @Prop() loading!: boolean;
  @Prop({ type: Object, default: () => {} })
  bcprParams!: any; //新增接口需要的参数
  tableData: any[] = [];
  resultData: any[] = [];
  @Prop() czParams!: object;
  @Emit()
  // async onSubmit(tableData:any) {}
  async onSubmit(resultData:any) {}
  @Emit()
  toggle1(val: boolean) {
    return val;
  }
  
  onPage(page: number) {
    console.log(page,"555");
    
  }
  onSize(size: number) {}
  onCheck(row:any) {
    if (row.status){
      // console.log("选择了一行")
      this.bcprParams.passiveUserIds.push(row.id);
      this.resultData.push(row);

    } else {
      // console.log("取消了一行")
      this.bcprParams.passiveUserIds = this.bcprParams.passiveUserIds.filter((item: any) => item != row.id)

      for (let i = 0; i < this.resultData.length; i++){
        if (this.resultData[i].id == row.id){
          this.resultData.splice(i,1)
        }
      }
      // console.log('取消',this.resultData)
    }

  }

  created(){
  
     //获取页面信息
    // console.log('页面加载完成',this.cprParams)
  }
  onOk() {
    (this.$refs["cprForm"] as any).validate((valid: any) => {
      if (valid) {
        for (let i = 0; i < this.resultData.length; i++) {
          for (let j = i+1; j < this.resultData.length; j++) {
            if(this.resultData[i].id=== this.resultData[j].id){
              this.resultData.splice(j,1)
              j=j-1
            }
          }
        }
        this.onSubmit(this.resultData);
        // this.onpage()
        // console.log('确定cpr',this.resultData)
      } else {
        return false;
      }
    });
  }
  // 取消的时候将表单值置位空
  onCancel() {
    this.toggle1(false);

    // console.log('取消cpr',this.tableData)
    // (this.$refs["cprForm"] as any).resetFields();
  }
  
  columns: any[] = [
      {
        title: "",
        slot: "selection",
        width: 55,
      },
      {
        title: "姓名",
        key: "realname",
      },
      {
        title: "所属部门",
        key: "departmentName",
      },
      {
        title: "角色",
        key: "roleName",
      },
    ];
  onSearch() {
    this.loading = true;
    this.pageParams.current = 1;
    this.onpage();
  }
  mounted() {
    this.onpage();
    this.initResult(this.pageParams.total)
  }
  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  stationParams: any = {
    pageNumber: "",
    pageSize: "",
    realname:""
  };
  @Watch("bcprParams")
   async initResult(total:any) {
      this.stationParams.pageNumber = 1; //当前页码
      this.stationParams.pageSize =1000; //一页多少条
      this.stationParams.realname=this.czParams
      let url = "wjBaseServer/system/user/userList";
      let data = await publicApi.postWithParam(url, this.stationParams);
      if (data.result == true) {
        const apiData=data.data.rows
        // this.tableData = data.data.rows;
        for (let i = 0; i < apiData.length; i++) {
          if(this.bcprParams.passiveUserIds.includes(apiData[i].id)){
            this.resultData.push(apiData[i])
          }
        }
      } else {
        this.tableData = [];
      }
    }
  
   // 列表
   @Watch("bcprParams")
   async onpage() {
      this.stationParams.pageNumber = this.pageParams.current; //当前页码
      this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
      this.stationParams.realname=this.czParams
      let url = "wjBaseServer/system/user/userList";
      let data = await publicApi.postWithParam(url, this.stationParams);
      if (data.result == true) {
        this.tableData = data.data.rows;
        // console.log( this.tableData)
        for (let i = 0; i < this.tableData.length; i++) {
          if(this.bcprParams.passiveUserIds.includes(this.tableData[i].id)){
            this.tableData[i].status=true
            // this.resultData.push(this.tableData[i])
          }else{
            this.tableData[i].status=false
          }
        }
        this.pageParams.total = parseInt(data.data.total);
      } else {
        // this.tableData = [];
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

}

</script>
<style lang="scss" scoped>
$deep: "::v-deep";
.btn{
  font-size: 20px;
  margin-right: 38%;
  padding: 20px 100px;
}
::v-deep.el-dialog__wrapper {
  .el-dialog {
    .el-dialog__header {
      background-color: #5993fa;
    }
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
    .el-dialog__body {
      height: 600px !important;
      overflow-y: auto;
    }
    .el-dialog__footer {
      border-top: 1px solid #e8eaec;
    }
  }
}

::v-deep.suc-select {
  .ivu-select-selection .ivu-select-selected-value {
    font-size: 13px;
    color: #606266;
  }
}

::v-deep.el-input--small .el-input__inner {
  margin: 3px 0;
}
::v-deep .upload-demo {
  .el-upload-list .el-upload-list--picture {
    .el-upload-list__item {
      width: 300px;
    }
  }
}
</style>


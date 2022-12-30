<template>
  <!-- 通讯录 -->
  <div class="module-view">
    <div class="bg-shadow top">
      <div>
        <el-button icon="el-icon-plus" size="small" type="primary" @click="onadd()">
          新增通讯录
        </el-button>
        <el-button icon="el-icon-plus" size="small" type="primary" @click="onedit()">
          编辑通讯录
        </el-button>
        <el-button icon="el-icon-delete" size="small" type="danger" @click="handleDelete()">
          删除通讯录
        </el-button>
      </div>
      <div></div>
    </div>
    <div class="plan">
      <div class="bg-shadow left">
        <!-- <div>
          <search-component placeholderTxt="请输入名称进行查询" @input="onSearch"> </search-component>
        </div> -->
        <div class="tree scroll">
          <el-tree
            ref="checkTree"
            :data="treeData"
            default-expand-all
            @node-click="getNode"
            :expand-on-click-node="false"
            :props="defaultProps"
            :highlight-current='true'
            node-key="id"
            :current-node-key="currentNodekey"
          ></el-tree>
        </div>
      </div>
      <div class="bg-shadow right scroll">
        <div class="right-title">
          <span v-text="rightTitle"></span>
        </div>
        <div class="right-content" v-if="rightTitle">
          <div class="top-item rightfloat">
            <el-upload
              type="primary"
              style="margin-right: 18px; display:inline-block;"
              size="small"
              :headers="uploadHeaders"
              :on-success="PicSuccess"
              :action="'api/wjBaseServer/system/user/import/'+this.selectNodeId"
              accept=".xls,.xlsx"
              :show-file-list="false"
            >
              <el-button style="background-color:#5584ff;" type="primary">模板导入</el-button>
            </el-upload>
           <suc-button style="margin-right:15px" type="primary" :debounce="800" @on-click="downLoad"
            >模板下载</suc-button
          >
            <suc-button type="primary" :debounce="800" @on-click="onaddpne">新增联系人</suc-button>
          </div>
           <table-page
            :columns="columns"
            :tableData="tableData"
            :pageParams="pageParams"
            @get-page="getPage"
            @get-size="getSize"
            >
            <template v-slot:operation="{ row }">
                <div class="btn">
                <span @click="oneditpne(row)">编辑</span>
                <span @click="ondelete(row)">删除</span>
                </div>
            </template>
            </table-page>
        </div>
      </div>
    </div>
    <xzfz-modal
      :title="fileTitle"
      :model="modelfz"
      :loading="loading"
      :formParams="formParams"
      @on-submit="oncreate"
      @toggle="toggle"
    >
    </xzfz-modal>
    <xzlx-modal :title="modalTitle" :model="model" :loading="loading" :formParam="formParam" @on-submit="oncreate" @toggle="toggle" :chuan="chuan"></xzlx-modal>
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
import { SucButton, SucTree, SucModal, SucForm, SucFormItem, SucSelect, SucInput } from "@suc/ui";
import { xzfzModal, DeleteModal, xzlxModal} from "./model";
import { SearchComponent, TablePage } from "@/components";
import { infoApi, publicApi } from "@/api";
import fileIcon from "@/constants/fileIcon";
@Component({
  components: {
    SucButton,
    SucTree,
    SucModal,
    DeleteModal,
    xzfzModal,
    xzlxModal,
    SucForm,
    SucFormItem,
    SucSelect,
    SucInput,
    TablePage,
    SearchComponent,
  },
})
export default class TransferPlan extends Vue {
  chuan: any = [];
  treeData: any = [];
  tableData: any[] = [];
  fileIcon: any = fileIcon;
  delLoading: boolean = false;
  modelfz: boolean = false;
  model: boolean = false;
  modalTitle: any = '';
  fileTitle: any = '';
  delmodel: boolean = false;
  delParams: any = {};
  currentNodekey: any = "";
  parentId: string = "";
  btnFlag: string = '';
  rightTitle: any = "";
  editParentName:any = '';
  tag: any = "1";
  loading: boolean = false;
  uploadHeaders:any = {"Authorization":'bearer ' + localStorage.getItem("refresh-token")}
  firstEdit: boolean = true; //编辑时候提交按钮判断第一级还是第二级
  fileList: any = [];
  gxParams: any = {};
  formParams: any = {
  };
  formParam: any = {
    realname:"",
    tel:"",
    area:"",
    departmentName:"",
    remarks:"",
    id:'',
  };
  formPar: any ="";
  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "姓名",
      key: "realname",
    },
    {
      title: "联系电话",
      key: "tel",
    },
    {
      title: "所属部门",
      key: "departmentName",
    },
    {
      title: "所属乡镇",
      key: "area",
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
    },
  ];
  fileTableParams:any = {};
  selectNodeId: string = ""; //选中节点id
  selectNodeIds:any =[ ];
  searchParams: string = "";
  defaultProps: any = {
    children: "children",
    label: "name",
  };
  // PicSuccess(file: any) {
  //       this.onpage(id:any);
  // }
  downLoad(){
    location.href = "api/wjBaseServer/minio/file/downloadModel?fileName=SystemUser.xls"
  }
  mounted() {
    this.getTree();
  }
  PicSuccess(file: any) {
    console.log("--",file);
    this.onpage(this.selectNodeId);
  }
  jiekou(data: any){
    console.log(data)
    'api/wjBaseServer/system/user/import/'+data
  }
  // 新增弹框
  onadd() {
    this.modelfz = true;
    this.btnFlag = 'add';
    this.fileTitle = "新增通讯录";
    this.formParams = {
      parentName:this.editParentName,
      pid:this.parentId
    }

  }
 
  // 新增联系人弹框
  onaddpne() {
    this.model = true;
    this.btnFlag = 'addlxr';
    this.modalTitle = "新增联系人";
    this.formParam = {
        realname: '',
        tel: '',
        area:"",
        departmentName:"",
        remarks: '',
        id:'',
      };
  }
  // 编辑
  onedit() {
    this.modelfz = true;
    this.btnFlag = "edit";
    this.fileTitle = "编辑通讯录";
    this.formParams = {
      parentName:this.editParentName,
      name:this.rightTitle
    }
  }
  
  // 编辑联系人
  oneditpne(row: any) {
      this.model = true;
      this.btnFlag = "editlxr";
      this.modalTitle = "编辑联系人";
      this.formParam = {
        realname: row.realname,
        tel: row.tel,
        area:row.area,
        departmentName:row.departmentName,
        remarks: row.remarks,
        id: row.id,
      };
    }
  // 判断是新增还是编辑
  async oncreate() {
    if (this.btnFlag == "add") {
      this.setCreate();
    } else if (this.btnFlag == "edit") {
      this.setEdit();
    } else if (this.btnFlag == "addlxr") {
      this.setCreatepne();
    }else if (this.btnFlag == "editlxr") {
      this.setEditpne();
    }
    this.modelfz = false;
    this.model = false;
  }

  //  新增通讯录
  async setCreate() {
    let url = "wjBaseServer/system/contact";
    publicApi.postWithParamJson(url,this.formParams).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("新增成功");
        this.modelfz = false;
        this.getTree();
        this.loading = false;
      } else {
        this.$SucMessage.error("新增失败");
        this.modelfz = false;
        this.loading = false;
      }
    });
        this.getTree();
  }

   //  新增联系人
   async setCreatepne() {
    let xzmail={
      realname:this.formParam.realname,
      tel:this.formParam.tel,
      departmentName:this.formParam.departmentName,
      area:this.formParam.area,
      remarks:this.formParam.remarks,
      contactId:this.selectNodeId,
    }
    
    let url = "wjBaseServer/system/user/save";
    publicApi.postWithParamJson(url,xzmail).then((data: any) => {
      if (data.result == true) {
        console.log('新增',data)
        this.$SucMessage.info("新增成功");
        this.model = false;
        this.onpage(this.selectNodeId);
        this.loading = false;
      } else {
        this.$SucMessage.error("新增失败");
        this.model = false;
        this.loading = false;
      }
    });
      this.onpage(this.selectNodeId);
  }
  // 更新
  async setEdit() {
    this.loading = true;
    let params = {
      name:this.formParams.name,
      uuid:this.selectNodeId
    }
    let url = "wjBaseServer/system/contact";
    publicApi.putWithParamJson(url, params).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("更新成功");
        this.modelfz = false;
        this.getTree();
        this.loading = false;
      } else {
        this.modelfz = false;
        this.$SucMessage.error("更新失败");
        this.loading = false;
      }
    });
    this.getTree();
  }


   //更新联系人
   setEditpne(){
    this.loading = true;
    let formParam={
      realname:this.formParam.realname,
      tel:this.formParam.tel,
      departmentName:this.formParam.departmentName,
      area:this.formParam.area,
      remarks:this.formParam.remarks,
      id:this.formParam.id,
    }
    let url = "wjBaseServer/system/user/updateContact";
    publicApi.putWithParamJson(url, formParam).then((data: any) => {
      if (data.result == true) {
        console.log('data',data)
        this.$SucMessage.info("更新成功");
        this.model = false;
        this.onpage(this.selectNodeId);
        this.loading = false;
      } else {
        this.model = false;
        this.$SucMessage.error("更新失败");
        this.loading = false;
      }
    });
    this.onpage(this.selectNodeId);
  }

  async save() {
    this.delLoading = true;
    let url = "wjBaseServer/system/user/deleteContact";
    await publicApi.deleteWithParam(url, this.delParams).then((data: any) => {
      if (data.result == true) {
        this.delmodel = false;
        this.$SucMessage.info("删除成功");
        this.onpage(this.selectNodeId)
        this.delLoading = false;
      } else {
        this.delLoading = false;
        this.$SucMessage.error("删除失败");
      }
    });
  }

  cancel(val: any) {
    this.delmodel = val;
  }

  

  toggle(val: boolean) {
    this.modelfz = val;
    this.model = val;
  }

  // 获取树
  async getTree() {
    let url = 'wjBaseServer/system/contact/TreeGroup'
    let data = await publicApi.getNoParam(url);
    this.treeData = data.data.children;
    this.rightTitle = data.data.children.name;
    for (let i = 0; i < data.data.children.length; i++) {
      this.selectNodeId=data.data.children[i].id
    }
    this.$nextTick(()=>{
      (this.$refs['checkTree'] as any).setCurrentKey( data.data.children.id)
    })
    this.onpage(this.selectNodeId);
  }

  onSearch(val: string) {
    this.searchParams = val;
    this.getTree();
  }

  async onpage(id:any) {
    this.fileTableParams.pageNumber = this.pageParams.current;
    this.fileTableParams.pageSize = this.pageParams.pageSize;
    this.fileTableParams.contactId=id;
    let url = "wjBaseServer/system/user/ContactsDetail";
    let data = await publicApi.getWithParam(url, this.fileTableParams);
    this.pageParams.total = parseInt(data.total);
    this.tableData = data.data;
    this.loading = false;
  }

  getPage(page: any) {
    this.loading = true;
    this.pageParams.current = page;
    this.onpage(this.selectNodeId);
  }
  getSize(size: any) {
    this.loading = true;
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
    this.onpage(this.selectNodeId);
  }
 

  ondelete(row: any) {
    this.delmodel = true;
    this.delParams = {
     id: row.id,
    };
  }

  //点击树节点
  async getNode(data: any) {
    let a = (this.$refs['checkTree'] as any).getNode(data);
    this.editParentName = a.data.name;
    this.rightTitle = data.name;
    this.selectNodeId = data.id;
    this.parentId = data.id
    this.onpage(data.id)
    this.jiekou(data.id)
  }

  handleDelete() {
    if (this.rightTitle == undefined) {
      alert('请选择一个分组')
    } else {
      this.$confirm(`此操作将永久删除"${this.rightTitle}"及其子节点, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let url = "wjBaseServer/system/contact";
          publicApi
            .deleteWithParam( url,{ uuid: this.selectNodeId })
            .then((data: any) => {
              if (data.result == true) {
                this.$SucMessage.info(data.desc);
                this.getTree();
                this.parentId=''
                this.editParentName =''
              } else {
                this.$SucMessage.error(data.desc);
              }
            })
            .finally(() => {
              // this.delLoading = false;
            });

        });
      }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";

.rightfloat{
  display: flex;
  justify-content:flex-end;
  margin-bottom: 15px;
}
.module-view {
  position: relative;
  padding: 10px;
  background-color: $pages-bg;
  .bg-shadow {
    background-color: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  }
  .top {
    padding: 14px 15px;
    display: flex;
    justify-content: space-between;
    .button-pannel {
      display: inline-block;
      margin-right: 16px;
    }
  }
  .plan {
    display: flex;
    margin-top: 10px;
    height: calc(100% - 70px);
    .left {
      padding-top: 10px;
      padding: 10px;
      width: 400px;
      height: 100%;
      .tree {
        margin-top: 20px;
      }
    }
    .right {
      margin-left: 10px;
      width: calc(100% - 210px);
      height: 100%;
      overflow: scroll;
      &-title {
        padding: 15px;
        border-bottom: 1px solid $border-color;
      }
      &-content {
        padding-left: 5%;
        padding-right: 5%;
        padding-top: 2%;
        height: calc(100% - 125px);
        border-top: 1px solid #dde4eb;
        .upload{
            text-align: right;
            margin-bottom: 10px;
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
      .submit {
        width: 35%;
        margin-top: 30px;
        display: flex;
        float: right;
        button {
          flex: 1;
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

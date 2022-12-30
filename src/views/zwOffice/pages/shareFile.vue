<template>
  <!-- 资料库 -->
  <div class="module-view">
    <div class="bg-shadow top">
      <div>
        <el-button icon="el-icon-plus" size="small" type="primary" @click="onadd()">
          新建文件夹
        </el-button>
        <el-button icon="el-icon-plus" size="small" type="primary" @click="onedit()">
          编辑文件夹
        </el-button>
        <el-button icon="el-icon-delete" size="small" type="danger" @click="handleDelete()">
          删除文件夹
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
            <div class="upload">
                <el-upload
                    v-if="selectNodeId != '1'"
                    :on-success="PicSuccess"
                    :show-file-list="false"
                    action="api/wjBaseServer/minio/file/upload"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
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
                <span @click="onDownload(row)">下载</span>
                <span @click="ondelete(row)">删除</span>
                </div>
            </template>
            </table-page>
        </div>
      </div>
    </div>
    <file-modal
      :title="fileTitle"
      :model="model"
      :loading="loading"
      :formParams="formParams"
      @on-submit="oncreate"
      @toggle="toggle"
    >
    </file-modal>
    
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
import { fileModal, DeleteModal } from "./model";
import { SearchComponent, TablePage } from "@/components";
import { infoApi, publicApi } from "@/api";
import fileIcon from "@/constants/fileIcon";
@Component({
  components: {
    SucButton,
    SucTree,
    SucModal,
    DeleteModal,
    fileModal,
    SucForm,
    SucFormItem,
    SucSelect,
    SucInput,
    TablePage,
    SearchComponent,
  },
})
export default class TransferPlan extends Vue {
  treeData: any = [];
  tableData: any[] = [];
  fileIcon: any = fileIcon;
  delLoading: boolean = false;
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
  firstEdit: boolean = true; //编辑时候提交按钮判断第一级还是第二级
  fileList: any = [];
  formParams: any = {
  };
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
      title: "文件名称",
      key: "basename",
    },
    {
      title: "文件大小",
      key: "fsize",
    },
    {
      title: "创建时间",
      key: "createdate",
      formatter:(e:any)=>{
        return this.$utils.dateFormat(new Date(Number(e.createdate)), "yyyy-MM-dd HH:mm:ss")
      }
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
    },
  ];
  fileTableParams:any = {};
  selectNodeId: string = ""; //选中节点id
  searchParams: string = "";
  defaultProps: any = {
    children: "children",
    label: "name",
  };

  mounted() {
    this.getTree();
  }

  // 新增弹框
  onadd() {
    this.model = true;
    this.btnFlag = 'add';
    this.fileTitle = "新建文件夹";
    this.formParams = {
      parentId: this.selectNodeId,
      parentName:this.rightTitle,
    };
  }

  // 编辑
  onedit() {
    this.model = true;
    this.btnFlag = "edit";
    this.modalTitle = "编辑文件夹";
    this.formParams = {
      name:this.rightTitle,
      parentName:this.editParentName
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
    let url = "wjBaseServer/fileNode/fileupload/Insert";
    publicApi.postWithParam(url, this.formParams).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("新增成功");
        this.model = false;
        this.getTree();
        this.loading = false;
      } else {
        this.$SucMessage.error("新增失败");
        this.model = false;
        this.loading = false;
      }
    });
        this.getTree();
  }

  // 更新
  async setEdit() {
    this.loading = true;
    let params = {
      name:this.formParams.name,
      parentId:this.parentId,
      id:this.selectNodeId,

    }
    let url = "wjBaseServer/fileNode/fileupload/Update";
    publicApi.postWithParam(url, params).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("更新成功");
        this.model = false;
        this.getTree();
        this.loading = false;
      } else {
        this.model = false;
        this.$SucMessage.error("更新失败");
        this.loading = false;
      }
    });
    this.getTree();
  }

  async save() {
    this.delLoading = true;
    let url = "wjBaseServer/fileNode/fileupload/delFile";
    await publicApi.postWithParam(url, this.delParams).then((data: any) => {
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
    this.model = val;
  }

  // 获取树
  async getTree() {
    let url = 'wjBaseServer/fileNode/fileupload/nodeTreeByCurrentUser'
    let data = await publicApi.getNoParam(url);
    this.treeData = [data.data];
    this.rightTitle = data.data.name;
    this.selectNodeId = data.data.id;
    this.$nextTick(()=>{
      (this.$refs['checkTree'] as any).setCurrentKey(data.data.id)
    })
    this.onpage(data.data.id);
  }

  async PicSuccess(file: any) {
    if (file.result) {
        file.data.parentId =this.selectNodeId
        let url = 'wjBaseServer/fileNode/fileupload/saveFileinfoFromMinio'
        let data = await publicApi.postWithParamJson(url,file.data)
        if (data.result) {
          this.onpage(this.selectNodeId)
          this.$SucMessage.success("上传成功！");
        }
        else{
          this.onpage(this.selectNodeId)
          this.$SucMessage.error("上传失败！");

        }
    }
    
  }

  onSearch(val: string) {
    this.searchParams = val;
    this.getTree();
  }

  async onpage(id:any) {
    this.fileTableParams.pageNumber = this.pageParams.current;
    this.fileTableParams.pageSize = this.pageParams.pageSize;
    this.fileTableParams.parentId = id;
    this.fileTableParams.filetype = 'all';
    let url = "wjBaseServer/fileNode/fileupload/selectFileInfosByPid";
    let data = await publicApi.postWithParam(url, this.fileTableParams);
    this.pageParams.total = parseInt(data.total);
    this.tableData = data.rows;
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

  onDownload(row:any){
    let url ='api/wjBaseServer/minio/file/download?fileId='+row.id
    location.href=url
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
    this.editParentName = a.parent.data.name;
    this.rightTitle = data.name;
    this.selectNodeId = data.id;
    this.parentId = data.parentId;
    this.onpage(data.id)
  }

  handleDelete() {
    if (this.selectNodeId == '1') {
      this.$SucMessage.warning("根目录无法删除!");
    } else {
      this.$confirm(`此操作将永久删除"${this.rightTitle}"及其子节点, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let url = "wjBaseServer/fileNode/fileupload/delNode";
          publicApi
            .postWithParam( url,{ id: this.selectNodeId })
            .then((data: any) => {
              if (data.result == true) {
                this.$SucMessage.info(data.desc);
                this.getTree();
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

<template>
  <el-dialog :title="title" :visible.sync="model" :close-on-click-modal="true" :before-close="onCancel">
      <div class="button">
        <el-upload
          class="upload-demo"
          :on-success="PicSuccess"
          action="api/wjServer/szszy/waterUnit/importWaterUnit"
          accept=".xls,.xlsx"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">导入Excel</el-button>
        </el-upload>
    </div>
    <h3>（一）非居民用水单位注册信息</h3>
    <el-row class="table">
        <el-col :span="12">
            <div class="desc" style="color:red">用水单位名称</div>
            <div class="cont"><suc-input v-model="ysdwParams.companyName" style="width:100%" size="mini"></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc" style="color:red">用水计划号</div>
            <div class="cont"><suc-input v-model="ysdwParams.companyId" style="width:100%" size="mini"></suc-input></div>
        </el-col>
        <el-col :span="24">
            <div class="desc" style="color:red">所属乡镇</div>
            <div class="cont"><suc-input v-model="ysdwParams.town" style="width:100%" size="mini"></suc-input></div>
        </el-col>
        <!-- <el-col :span="24">
            <div class="desc">行业类别</div>
            <div class="cont"><suc-select :options="szckData" :config="{ clearable: true }" style="width:100%" size="mini"></suc-select></div>
        </el-col> -->
          <el-col :span="24">
            <div class="desc" style="color:red">行业类别</div>
            <div class="cont"><suc-input v-model="ysdwParams.tradeId" style="width:100%" size="mini"></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">水平衡测试时间</div>
            <div class="cont"><suc-input v-model="ysdwParams.csNian" style="width:25%" size="mini"></suc-input>年<suc-input v-model="ysdwParams.csYue" style="width:25%" size="mini"></suc-input>月</div>
        </el-col>
        <el-col :span="12">
            <div class="desc">是否为节水型载体</div>
            <div class="cont"><suc-input v-model="ysdwParams.isjsphzt" style="width:100%" size="mini"></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">主管科室</div>
            <div class="cont"><suc-input v-model="ysdwParams.chargeDept" style="width:100%" size="mini"></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">科室电话</div>
            <div class="cont"><suc-input v-model="ysdwParams.deptTel" style="width:100%" size="mini"></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">分管领导</div>
            <div class="cont"><suc-input v-model="ysdwParams.leaderName" style="width:100%" size="mini"></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">分管领导电话</div>
            <div class="cont"><suc-input v-model="ysdwParams.leaderTel" style="width:100%" size="mini"></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc ts">联系人1</div>
            <div class="cont ts"><suc-input v-model="ysdwParams.linkmanName1" style="width:100%;height:100%"></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">移动电话</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanMobile1" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">办公电话</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanTel1" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">传真</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanFax1" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">QQ</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanQq1" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">电子邮箱</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanEmail1" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc ts">联系人2</div>
            <div class="cont ts"><suc-input v-model="ysdwParams.linkmanName2" style="width:100%;height:100%"></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">移动电话</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanMobile2" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">办公电话</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanTel2" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">传真</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanFax2" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">QQ</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanQq2" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">电子邮箱</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanEmail2" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc ts">联系人3</div>
            <div class="cont ts"><suc-input v-model="ysdwParams.linkmanName3" style="width:100%;height:100%"></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">移动电话</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanMobile3" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">办公电话</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanTel3" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">传真</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanFax3" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">QQ</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanQq3" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="12">
            <div class="desc">电子邮箱</div>
            <div class="cont"><suc-input v-model="ysdwParams.linkmanEmail3" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="8">
            <div class="desc">通讯地址1</div>
            <div class="cont"><suc-input v-model="ysdwParams.address1" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="8">
            <div class="desc">辖区</div>
            <div class="cont"><suc-input v-model="ysdwParams.district1Id" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="8">
            <div class="desc">邮编</div>
            <div class="cont"><suc-input v-model="ysdwParams.postcode1" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="8">
            <div class="desc">通讯地址2</div>
            <div class="cont"><suc-input v-model="ysdwParams.address2" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="8">
            <div class="desc">辖区</div>
            <div class="cont"><suc-input v-model="ysdwParams.district2Id" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="8">
            <div class="desc">邮编</div>
            <div class="cont"><suc-input v-model="ysdwParams.postcode2" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="8">
            <div class="desc">通讯地址3</div>
            <div class="cont"><suc-input v-model="ysdwParams.address3" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="8">
            <div class="desc">辖区</div>
            <div class="cont"><suc-input v-model="ysdwParams.district3Id" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
        <el-col :span="8">
            <div class="desc">邮编</div>
            <div class="cont"><suc-input v-model="ysdwParams.postcode3" style="width:100%" size="mini" ></suc-input></div>
        </el-col>
            <el-col :span="24">
            <div class="desc bz">备注</div>
            <div class="cont bz"><suc-input v-model="ysdwParams.remark" style="width:100%;height:100%" type="textarea"></suc-input></div>
        </el-col>
    </el-row>

    <!-- <el-button type="primary" size="mini" @click="onBdShow()">企业绑定水表</el-button> -->

    <h3 >（二）企业绑定水表</h3>
    <el-button type="primary" size="small" style="float:right;margin:5px;" @click="onadd()">插入水表</el-button>
    <div class="content">
        <table-no :columns="columns" :tableData="tableData">
          <template v-slot:operation="{ index }">
            <div class="btn">
              <span @click="ondelete(index)">删除</span>
            </div>
          </template>
        </table-no>
      </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onOk()">提 交</el-button>
      <el-button type="success" v-if="btnFlag=='edit'" @click="onExport()">原样导出</el-button>
    </div>
    <qybd-modal title="企业绑定水表" :model1="model1" :formParams1="formParams1" @on-submit="oncreate" @toggle1="toggle1"></qybd-modal>

  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { SearchComponent, TableNo } from "@/components";
import { SucModal, SucForm, SucFormItem, SucInput, SucButton,SucSelect  } from "@suc/ui";
import { infoApi, publicApi } from "@/api";
import dayjs from "dayjs";
import  qybdModal  from "./qybdModal.vue";

@Component({
  components: {
    SucModal,
    SucForm,
    SucFormItem,
    SucInput,
    SucButton,
    SucSelect,
    TableNo,
    qybdModal
  },
})
export default class CreateYsdw extends Vue {
  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "水源类型",
      key: "sytype",
    },
    {
      title: "单位名称",
      key: "companyName",
    },
    {
      title: "计划号",
      key: "companyId",
    },
    {
      title: "自来水户标号",
      key: "meterId",
    },
    {
      title: "水表名称、地址",
      key: "remark",
    },
    {
      title: "操作",
      slot: "operation",
      width: 90,
    },
  ];
  tableData: any[] = [];
  szckData: any = [];
  formParams1: any = {};
  // bdShow:any = false;
  model1:any = false;
  @Prop() title!: string;
  @Prop() btnFlag!: string;
  @Prop() loading!: boolean; //控制加载
  @Prop() model!: boolean; //控制弹框显隐
  @Prop({ type: Object, default: () => {} })
  formParams!: any; //新增接口需要的参数

  ysdwParams:any = this.formParams
  @Emit()
  async onSubmit(params:any) {}
  @Emit()
  toggle(val: boolean) {
    return val;
  }

  @Watch('formParams')
  infoList(){

    console.log("00",this.formParams);
    
    this.ysdwParams = this.formParams
    if (this.formParams.list) {
      this.tableData = this.formParams.list
    }
    // if (this.formParams.companyId) {
    //   this.bdShow = true
    // }
  }
  onOk() {
      this.ysdwParams.list = this.tableData;
      if (!this.ysdwParams.companyName || this.ysdwParams.companyName == '') {
        this.$message.error('用水单位名称不能为空!')
      }
      else if(!this.ysdwParams.companyId || this.ysdwParams.companyId == ''){
        this.$message.error('用水计划号不能为空!')
      }
      else if(!this.ysdwParams.town || this.ysdwParams.town == ''){
        this.$message.error('所属乡镇!')
      }
      else if(!this.ysdwParams.tradeId || this.ysdwParams.tradeId == ''){
        this.$message.error('行业类别!')
      }
      // else if((!this.ysdwParams.address1 && !this.ysdwParams.address2 && !this.ysdwParams.address3) || (this.ysdwParams.address1 == '' && this.ysdwParams.address2 == '' && this.ysdwParams.address3 == '')){
      //   this.$message.error('通讯地址不能为空!')
      // }
      else{
        this.onSubmit(this.ysdwParams);
        this.tableData = []
        this.ysdwParams = {}
      }
       
  }

  onExport(){
    let url = 'api/wjServer/szszy/waterUnit/exportAsIs?companyId=' + this.ysdwParams.companyId
    location.href = url
    
  }
  // 取消的时候将表单值置位空
  onCancel() {
    this.toggle(false);
    // this.bdShow = false;
    this.tableData = [];
    this.ysdwParams = {}
  }
  mounted() {
  }
  

  // onBdShow(){
  //   this.bdShow = true
  // }

  onadd(){
    this.model1 = true
  }

  toggle1(val: boolean) {
    this.model1 = val;
    this.formParams1 = {}
  }

  PicSuccess(file: any) {
    this.ysdwParams = file.data
  }

  async oncreate() {
    console.log("----",this.tableData);
    console.log("----",this.formParams1);
    
    this.model1 = false;
    this.tableData.push(this.formParams1)
    this.formParams1 = {}
  }

  ondelete(index:any){
    this.tableData.splice(index,1)
  }
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
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
      height: 600px;
      overflow-y: auto;
    }
    .el-dialog__footer {
      border-top: 1px solid #e8eaec;
    }
  }
}



h3{
    text-align: center;
    margin-bottom: 5px;
}

.table{
        margin-bottom: 30px;
#{$deep} .suc-input .ivu-input {
  border:none;
  width:100%
}

#{$deep} .suc-select .ivu-select .ivu-select-selection{
    margin-bottom: 3px;
    border:none
}
.desc{
        text-align: center;
        display: inline-block;
        border: 1px solid #ebeef5;
        height: 36px;
        line-height: 36px;
        width: 120px;
        vertical-align: top;
        color: #909399;
        margin-bottom: -1px;
        background: #fafafa;
        
    }
    .cont{
        border: 1px solid #ebeef5;
        height: 36px;
        line-height: 36px;
        width: calc(100% - 120px);
        display: inline-block;
        vertical-align: top;
        margin-bottom: -1px;
    }
    .ts{
            height: 176px;
            line-height: 200px;
        }
    .bz{
        height: 96px;
            line-height: 96px;
    }
}
    .content {
      clear: both;
      height: calc(100% - 165px);
      // border-top: 1px solid #dde4eb;
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

</style>

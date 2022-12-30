<template>
  <div class="module-view">
    <div class="view-left bg-shadow">
      <span class="headerTitle">
        发送短信
      </span>
      <div>
        <span class="title">分组名称:</span>
        <span>
          <el-cascader
            :options="treeGroup"
            :props="{ expandTrigger: 'hover', value: 'id', label: 'name', children: 'children',  multiple: true}"
            size="small"
            style="margin-left: 16px;"
            placeholder="所属分组"
            collapse-tags
            clearable
            :show-all-levels="false"
            v-model="group"
            @change="handleChange"
          ></el-cascader>
        </span>
      </div>
      <div>
        <span class="title">联系人员:</span>
        <span>
          <el-select v-model="postParams.tels" filterable multiple collapse-tags size="small" style="margin-left: 16px;" placeholder="请选择" @change="getValue">
            <el-checkbox v-model="checked" @change="selectAll">全选</el-checkbox>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </span>
      </div>
      <div>
        <span class="title">短信内容:</span>
        <span>
          <el-input type="textarea" :rows="5" placeholder="请输入内容" style="padding-left:20px;padding-top:10px;" v-model="postParams.msg"> </el-input>
        </span>
      </div>
      <div style="text-align:center">
        <el-button type="primary" icon="el-icon-mobile-phone" size="medium" @click="sendMessage">发送短信</el-button>
      </div>
    </div>
    <div class="view-right bg-shadow">
      <div class="top">
        <div class="headerTitle">
          发送记录
        </div><br/>
        <div class="top-item">
          <suc-select :options="messageType" v-model="onPageParams.smsType" :config="{ placeholder: '短信类型', clearable: true }" style="width:50%"></suc-select>
          <suc-button type="primary" style="margin-left:10px" :debounce="800" @on-click="onSearch">搜索</suc-button>
        </div>
      </div>
      <div class="content">
        <table-page :columns="columns" :size="size" :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize">
          <template v-slot:status="{ row }">
            <div v-if="row.status == '0'" style="color:red">
              失败
            </div>
            <div v-else style="color:green">
              成功
            </div>
          </template>
        </table-page>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucSelect, SucButton } from "@suc/ui";
import { SearchComponent, TablePage } from "@/components";
import { publicApi } from "@/api";
@Component({
  components: {
    SearchComponent,
    SucButton,
    SucSelect,
    TablePage,
  },
})
export default class Message extends Vue {
  treeGroup: any = []; //分组数据
  size: any = "medium";
  messageType: any = [];
  checked: boolean = false;
  onPageParams: any = {
    smsType: "",
    pageNumber: "",
    pageSize: "",
  };
  loading: boolean = true;
  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  postParams: any = {
    tels: [],
    msg: "",
  };
  group: any = "";
  columns: any = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "接收人",
      key: "receiver",
    },
    {
      title: "接收成功/失败",
      // key: "status",
      slot: "status",
    },
    {
      title: "短信内容",
      key: "mes",
    },
    {
      title: "发送时间",
      key: "setTime",
    },
  ];
  tableData: any = [
    {
      gateCd: "3",
      gateNm: "测试名称",
      xzqq: "行政区域",
      szhl: "河流名称",
      gateHoleNum: "5",
      gateTw: "测试宽",
      gczt: "zhuagntai",
    },
  ];
  options: any = [];
  contactPeopleParams: any = {
    contactIds: "",
  };
  contactPeople:any=''
  handleChange(value: any) {
    this.contactPeople=value
    this.contactPeopleParams.contactIds=this.contactPeople.toString();
    this.getContactPeople();
  }
  async getContactPeople() {
    this.options = [];
    let url = "wjBaseServer/system/user/linkMansByContacts";
    let data = await publicApi.getWithParam(url, this.contactPeopleParams);
    this.options = data.data.map((item: any) => {
      return {
        value: item.tel,
        label: item.realname + ":" + item.tel,
      };
    });
  }

  onSearch() {
    this.getPageList();
  }
  mounted() {
    this.getGroupList(); //获取分组列表
    this.getMessType();
    this.getPageList();
  }
  async getMessType() {
    let url = "wjServer/fangxunjc/sms/smsTypeList";
    let data = await publicApi.getNoParam(url);
    if (data.result) {
      this.messageType = data.data.map((item: any) => {
        return {
          value: item.code,
          label: item.level,
        };
      });
    }
  }
  async getPageList() {
    this.onPageParams.pageNumber = this.pageParams.current;
    this.onPageParams.pageSize = this.pageParams.pageSize;
    let url = "wjServer/fangxunjc/sms/infoList";
    let data = await publicApi.getWithParam(url, this.onPageParams);
    if (data.result) {
      this.loading = false;
      this.tableData = data.data.rows;
      this.pageParams.total = parseInt(data.data.total);
    } else {
      this.loading = false;
      this.tableData = [];
    }
  }
  async getGroupList() {
    let url = "wjBaseServer/system/contact/TreeGroup";
    let data = await publicApi.getNoParam(url);
    this.treeGroup = this.getTreeData(data.data.children);
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

  getPage(page: any) {
    this.loading = true;
    this.pageParams.current = page;
    this.getPageList();
  }
  getSize(size: any) {
    this.loading = true;
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
    this.getPageList();
  }
  //  全选
  selectAll() {
    this.postParams.tels = [];
    if (this.checked) {
      this.options.map((item: any) => {
        this.postParams.tels.push(item.value);
      });
    } else {
      this.postParams.tels = [];
    }
  }
  // 下拉框选择事件
  getValue(val: any) {
    if (val.length === this.options.length) {
      this.checked = true;
    } else {
      this.checked = false;
    }
  }
  // 发短信
  async sendMessage() {
    if (this.postParams.tels.length == 0) {
      this.$Message.error("请根据分组选择联系人");
      return;
    }
    if (this.postParams.msg == "") {
      this.$Message.error("请填写短信内容");
      return;
    }
    let url = "wjServer/oa/sendsms";
    let data = await publicApi.postWithParam(url, this.postParams);
    if (data.result) {
      this.$Message.success("发送短信成功");
      this.getPageList();
    } else {
      this.$Message.success("发送短信失败");
    }
    this.group = "";
    this.postParams = {
      tels: [],
      msg: "",
    };
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";
$deep: "::v-deep";
.module-view {
  position: relative;
  padding: 20px;
  background-color: $pages-bg;
  display: flex;
  .view-left {
    width: 30%;
    background: #ffffff;
    padding: 15px;
    position: relative;

    div:nth-child(2) {
      padding-top: 10%;
    }
    div:nth-child(3) {
      padding-top: 10%;
    }
    div:nth-child(4) {
      padding-top: 10%;
    }
    div:nth-child(5) {
      padding-top: 5%;
    }
  }
  .view-right {
    width: calc(70% - 10px);
    background: #ffffff;
    margin-left: 10px;
    height: 100%;
    position: relative;
    .top {
      padding: 15px;
      &-item {
        width: 50%;
        padding-top: 20px;
      }
    }
    .content {
      height: calc(100% - 100px);
      border-top: 1px solid #dde4eb;
    }
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    color: #9499a2;
  }
  .title::before {
    content: "*";
    color: red;
  }
}
.headerTitle {
  position: absolute;
  font-size: 16px;
  color: #333333;
  width: 93%;
  padding-left: 5px;
}
.headerTitle::before {
  content: "";
  position: absolute;
  top: 5px;
  left: -5px;
  width: 4px;
  height: 14px;
  background-color: #3983f3;
  border-radius: 4px;
}
#{$deep}.el-checkbox {
  text-align: right;
  padding-right: 10px;
  width: 100%;
}
</style>

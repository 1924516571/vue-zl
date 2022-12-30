<template>
  <!--图像采集设备 -->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
            <search-component placeholderTxt="请输入视频点名称" @input="onSearch"> </search-component>
          </div>
        </div>
        <div class="top-item">
          <suc-button type="primary" :debounce="800" @on-click="onadd">新增</suc-button>
        </div>
      </div>
      <div class="content">
        <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize">
          <template v-slot:primissDistribution="{ row }">
            <div class="link-text" @click="getLink(row)" style="padding-left:10px">
              关联
            </div>
          </template>
          <template v-slot:gongan="{ row }">
            <div>
              <span v-if="row.gongan == true" style="color:#409EFF;padding-left:20px">是</span>
              <span v-if="row.gongan == false" style="color:red;padding-left:20px">否</span>
            </div>
          </template>
          <template v-slot:operation="{ row }">
            <div class="btn">
              <span @click="onedit(row)">编辑</span>
              <span @click="ondelete(row)">删除</span>
            </div>
          </template>
        </table-page>
      </div>
    </div>
    <video-modal :title="modalTitle" :model="model" :loading="loading" :formParams="formParams" @on-submit="oncreate" @toggle="toggle"></video-modal>
    <div class="delete-view" v-show="delmodel">
      <delete-modal @getignore="cancel" @getsave="save" v-loading="delLoading"></delete-modal>
    </div>
    <!-- 关联弹框 -->
    <link-video
      :loading="linkLoading"
      :model="linkshow"
      @toggle="linkupdate1"
      :columns="linkCol"
      :tableData="linkData"
      :pageParams="pagedfParams"
      :title="linkTitle"
      :videoPageParams="videoPageParams"
      @on-check="onLinkCheck"
      @on-page="onLinkPage"
      @on-size="onLinkSize"
    >
    </link-video>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucSelect, SucButton, SucInput, SucFormItem } from "@suc/ui";
// import { SelectConfig, SelectOptions } from "@suc/ui/interfaces";
import { SearchComponent, TablePage } from "@/components";
import { DeleteModal, VideoModal, LinkVideo } from "../model";
import { infoApi, publicApi } from "@/api";
import { postWithParam } from "../../../../api/public";
@Component({
  components: {
    SucSelect,
    SucButton,
    SucInput,
    SucFormItem,
    SearchComponent,
    TablePage,
    DeleteModal,
    VideoModal,
    LinkVideo,
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
  formParams: any = {};
  //   删
  delmodel: boolean = false;
  delParams: any = {}; //删除的参数
  linkLoading: boolean = false;
  bindParams: any = {
    roleId: "",
    videoId: "",
    bind: "",
  }; //绑定参数对象
  linkshow: boolean = false;
  linkTitle: any = "权限分配";
  // 弹框列表分页
  videoPageParams: { pageNumber: string; pageSize?: string; videoId?: string } = {
    pageNumber: "",
    pageSize: "",
    videoId: "",
  };
  linkCol: any = [];
  pagedfParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  linkData: any = []; //表单数据

  ondelete(row: any) {
    this.delmodel = true;
    this.delParams = {
      zdbh: row.zdbh,
    };
  }
  cancel(val: any) {
    this.delmodel = val;
  }
  async save() {
    this.delLoading = true;
    let url = "wjServer/dataCenter/device/image/delInfo";
    infoApi.ondeleteWithParams(this.delParams, url).then((data: any) => {
      if (data.result == true) {
        this.delmodel = false;
        this.$SucMessage.info("删除成功");
        this.onpage();
        this.delLoading = false;
      } else {
        this.delLoading = false;
        this.$SucMessage.error("删除失败");
        this.delLoading = false;
        this.onpage();
      }
    });
  }
  // 新增弹框
  onadd() {
    this.model = true;
    this.btnFlag = "add";
    this.modalTitle = "新增";
    this.formParams = {};
    this.formParams = {
      gongan: false,
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
    this.loading = true;
    // let checkUrl = "wjServer/dataCenter/device/image/cdIsExistedWhereAdd";
    // let a = {
    //   zdbh: this.formParams.zdbh,
    // };
    // let checkData = await infoApi.onpage(a, checkUrl);
    // if (checkData.data == 0) {
    //   let url = "wjServer/dataCenter/device/image/addInfo";
    //   infoApi.oncreate(this.formParams, url).then((data: any) => {
    //     if (data.result == true) {
    //       this.$SucMessage.info("新增成功");
    //       this.model = false;
    //       this.onpage();
    //       this.loading = false;
    //     } else {
    //       this.$SucMessage.error("新增失败");
    //       this.model = false;
    //       this.loading = false;
    //     }
    //   });
    // } else {
    //   this.model = false;
    //   this.$SucMessage.error("新增失败,设备编码已经存在,重新输入");
    // }
    let url = "wjServer/dataCenter/device/image/addInfo";
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
    let url = "wjServer/dataCenter/device/image/editInfo";
    infoApi.jsonUpdate(this.formParams, url).then((data: any) => {
      if (data.result == true) {
        this.$SucMessage.info("更新成功");
        this.model = false;
        this.onpage();
        this.loading = false;
      } else {
        this.model = false;
        this.$SucMessage.error("更新失败");
        this.loading = false;
        this.onpage();
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
    let zdbh = row.zdbh;
    this.editInfo(zdbh);
  }
  // 详情
  async editInfo(zdbh: any) {
    let url = "wjServer/dataCenter/device/image/getInfoByCd";
    let params = {
      zdbh: zdbh,
    };
    let data = await infoApi.getInfo(params, url);
    this.formParams = {
      zdbh: data.data.zdbh,
      spdmc: data.data.spdmc,
      sply: data.data.sply,
      splb: data.data.splb,
      spdwz: data.data.spdwz,
      appurl: data.data.appurl,
      gongan: data.data.gongan,
      nt: data.data.nt,
    };
  }
  //   查
  columns: any[] = [
    {
      type: "index",
      title: "序号",
      width: 60,
    },
    {
      title: "站点编号",
      key: "zdbh",
      width: 100,
    },
    {
      title: "视频点名称",
      key: "spdmc",
      width: 200,
    },
    {
      title: "视频来源",
      key: "sply",
    },
    {
      title: "视频类别",
      key: "splb",
    },
    {
      title: "app播放地址",
      key: "appurl",
    },
    {
      title: "视频点位置",
      key: "spdwz",
    },
    {
      title: "是否为公安视频",
      slot: "gongan",
    },
    {
      title: "备注",
      key: "nt",
    },
    {
      title: "权限分配",
      slot: "primissDistribution",
    },
    {
      title: "操作",
      slot: "operation",
      width: 120,
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
  };
  mounted() {
    this.onpage(); //获取页面信息
  }
  // 列表
  async onpage() {
    this.stationParams.pageNumber = this.pageParams.current; //当前页码
    this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
    let url = "wjServer/dataCenter/device/image/infoList";
    let data = await infoApi.onpage(this.stationParams, url);
    if (data.result == true) {
      this.pageParams.total = parseInt(data.data.total);
      this.tableData = data.data.rows;
      this.loading = false;
    } else {
      this.loading = false;
    }
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
    this.stationParams.spdmc = val;
    this.onpage();
  }
  // 关联弹框方法
  getLink(row: any) {
    this.linkshow = true;
    this.linkLoading = true;
    this.videoPageParams = {
      videoId: row.zdbh,
      pageNumber: "1",
      pageSize: "10",
    };
    this.linkCol = [
      // {
      //   title: "",
      //   slot: "selection1",
      //   heading: "asea",
      //   width: 200,
      // },
      {
        title: "",
        slot: "selection",
        width: 100,
      },
      {
        title: "角色",
        key: "roleName",
      },
    ];
    this.getInfo();
  }
  // 弹框列表分页
  onLinkPage(pageNum: any) {
    this.videoPageParams.pageNumber = pageNum;
    this.getInfo();
  }
  // 弹框每页大小 执行的事件
  onLinkSize(size: any) {
    this.videoPageParams.pageSize = size;
    this.getInfo();
  }
  // 取消弹框
  linkupdate1(val: any) {
    this.linkshow = val;
  }
  // 关联列表接口
  async getInfo() {
    var url = "wjServer/dataCenter/device/image/roleBindInfos";
    var data = await publicApi.getWithParam(url, this.videoPageParams);
    if (data.result) {
      this.linkLoading = false;
      this.pagedfParams.total = parseInt(data.data.total);
      this.linkData = data.data.rows.map((item: any) => {
        return {
          roleName: item.roleName,
          checked: item.bind,
          roleId: item.roleId,
          videoId: item.videoId,
        };
      });
    } else {
      this.linkLoading = false;
      this.$Message.error("获取失败");
    }
  }
  // 子组件绑定
  async onLinkCheck(row: any) {
    console.log(row, "555");

    this.bindParams = {
      roleId: row.roleId,
      videoId: row.videoId,
      bind: row.checked,
    };
    // let bindUrl = "wjServer/dataCenter/baseinfo/bindStationOld"; //绑定测站
    // let unbindUrl = "wjServer/dataCenter/baseinfo/unbindStation"; //解绑测站
    // let res = row.checked ? await infoApi.onlink(this.bindParams, bindUrl) : await infoApi.ondeleteWithParams(this.bindParams, unbindUrl);
    // let txt = row.checked ? "关联" : "取消关联";
    // let info = res.result ? "成功" : "失败";
    // this.$SucMessage.info(txt + info);
    let url = "wjServer/dataCenter/device/image/RolePermission";
    let res = await publicApi.postWithParamJson(url, this.bindParams);
    if (res.result) {
      this.$SucMessage.info(res.desc);
    } else {
      this.$SucMessage.info(res.desc);
    }
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

<template>
  <!--企业规费汇总表 -->
  <div class="info">
    <div class="info-view bg-shadow">
      <div class="top">
        <div class="top-item">
          <div class="top-item-sub">
            <search-component placeholderTxt="企业名称" @input="onSearch">
            </search-component>
          </div>
        </div>
        <div class="top-item">
          <suc-button type="primary" :debounce="800" @on-click="onadd"
            >新增</suc-button
          >
        </div>
      </div>
      <div class="content">
        <j-table
          border
          :span-method="spanMethod"
          :tableData="tableData"
          :pageParams="pageParams"
          @get-page="getPage"
          @get-size="getSize"
        >
          <template v-slot:column>
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column
              v-for="item in columns"
              :key="item"
              :prop="item.key"
              :label="item.title"
              width="120"
            >
            </el-table-column>
            <el-table-column label="操作" width="80">
              <div class="btn">
                <span @click="onedit(row)">编辑</span>
                <span @click="ondelete(row)">删除</span>
              </div>
            </el-table-column>
          </template>
        </j-table>
      </div>
    </div>

    <!-- 新增数据弹框 -->
    <my-template-modal
      :title="modalTitle"
      :model="model"
      :loading="loading"
      :formParams="formParams"
      @on-submit="oncreate"
      @toggle="toggle"
      :areaOptions="areaOptions"
    ></my-template-modal>
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
import { SucSelect, SucButton, SucInput, SucFormItem } from "@suc/ui";
// import { SelectConfig, SelectOptions } from "@suc/ui/interfaces";
import { SearchComponent, JTable } from "@/components";
import { DeleteModal } from "../model";
import { infoApi, publicApi } from "@/api";
@Component({
  components: {
    SucSelect,
    SucButton,
    SucInput,
    SucFormItem,
    SearchComponent,
    JTable,
    DeleteModal,
  },
})
export default class Enterprise extends Vue {
  olMap = this.$getMapConfig();
  areaOptions: any = [];
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
  ondelete(row: any) {
    this.delmodel = true;
    this.delParams = {
      templateId: row.id,
    };
  }
  cancel(val: any) {
    this.delmodel = val;
  }
  async save() {
    this.delLoading = true;
    let url = "wjServer/hs/template/delTemplate";
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

  spanMethod({ row, column, rowIndex, columnIndex }: any) {
    if (columnIndex === 1) {
      if (rowIndex % 2 === 0) {
        return {
          rowspan: 2,
          colspan: 1,
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    }
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
    let checkUrl = "wjServer/hs/template/checkNameWhenAdd";
    let a = {
      templateName: this.formParams.name,
    };
    let checkData = await infoApi.onpage(a, checkUrl);
    if (!checkData.data) {
      let url = "wjServer/hs/template/addTemplate";
      this.formParams.creater = localStorage.getItem("userId");
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
    } else {
      this.model = false;
      this.$SucMessage.error("新增失败,模板名称已经存在,重新输入");
    }

    this.onpage();
  }
  // 更新
  async setEdit() {
    this.loading = true;
    let checkUrl = "wjServer/hs/template/checkNameWhenEdit";
    let checkParam = {
      oldName: this.oldName,
      newName: this.formParams.name,
    };
    let checkData = await infoApi.onpage(checkParam, checkUrl);
    if (!checkData.data) {
      let url = "wjServer/hs/template/editTemplate";
      this.formParams.creater = localStorage.getItem("userId");
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
        }
      });
    } else {
      this.model = false;
      this.$SucMessage.error("更新失败，模板名称已经存在，重新输入");
    }

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
    let id = row.id;
    this.editInfo(id);
  }
  newString: any = ""; //新的字符串
  oldName: any = "";
  // 详情
  async editInfo(id: any) {
    let url = "wjServer/hs/template/getTemplateInfo";
    let params = {
      templateId: id,
    };
    let data = await infoApi.getInfo(params, url);
    const list: any = [];
    data.data.yhnrList.forEach((item: any) => {
      list.push(item.id);
    });
    this.oldName = data.data.name;
    this.formParams = {
      name: data.data.name,
      yhnr: list,
      id: data.data.id,
    };
  }
  //   查
  columns: any[] = [
    {
      title: "企业名称",
      key: "name",
      width: 180,
    },
    {
      title: "规费合计",
      key: "operation",
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
    userId: "",
  };
  mounted() {
    this.onpage(); //获取页面信息
    this.getAreaCode(); //获取所属区域
  }
  //获取下拉行政区域下拉
  async getAreaCode() {
    let data = await infoApi.getAreaCode();
    this.areaOptions = this.getTreeData([data.data]);
  }
  getTreeData(data: any) {
    // 循环遍历json数据
    for (var i = 0; i < data.length; i++) {
      if (data[i].children.length < 1) {
        // children若为空数组，则将children设为undefined
        data[i].children = undefined;
      } else {
        // children若不为空数组，则继续 递归调用 本方法
        this.getTreeData(data[i].children);
      }
    }
    return data;
  }

  // 列表
  async onpage() {
    // this.stationParams.userId = localStorage.getItem("userId");
    // this.stationParams.pageNumber = this.pageParams.current; //当前页码
    // this.stationParams.pageSize = this.pageParams.pageSize; //一页多少条
    let url = "wjServer/test/hebingTest";
    let data = await publicApi.getNoParam(url);
    console.log("777", data);

    // this.pageParams.total = parseInt(data.data.total);
    this.tableData = data.data;
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
    this.stationParams.templateName = val;
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

<template>
  <div class="module-view">
    <div class="bg-shadow">
      <div class="top-nav">
        <div class="top-nav-item">
          <div class="btn">
            <!-- <suc-select
                            v-model="formParams.pqid"
                            :options="pqOptions"
                            :config="{ placeholder: '片区', clearable: true }"
                            style="width: 120px"
                        ></suc-select> -->
            <el-cascader
              :options="areaOptions"
              v-model="formParams.areaCode"
              :props="{ expandTrigger: 'hover', value: 'myId', label: 'name', children: 'children', checkStrictly: true }"
              style="width:100%;"
              size="small"
              placeholder="所属区域"
              clearable
              @change="handleChange"
            >
            </el-cascader>
          </div>
          <!-- <div class="btn">
            <suc-select v-model="formParams.target" :options="targetOptions" :config="{ placeholder: '对象', clearable: true }" style="width: 120px"></suc-select>
          </div> -->
          <div class="btn">
            <suc-date-picker v-model="date" :options="options" style="width:350px" @on-change="getTime"></suc-date-picker>
          </div>
          <div class="btn">
            <suc-input placeholder="请输入泵站名称" v-model="formParams.bzname"></suc-input>
          </div>
          <div class="btn">
            <search-component :value="formParams.companyName" placeholderTxt="输入养护单位" @input="search"></search-component>
          </div>
          <!-- <div class="btn">
            <suc-button type="primary" @click="exportExcel">导出</suc-button>
          </div> -->
        </div>
      </div>
      <div class="content">
        <div class="content-item">
          <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" @get-page="getPage" @get-size="getSize">
            <template v-slot:task="{ row }">
              <div :class="['status', row.problemStatus == '异常' ? 'red-state' : 'green-state']">{{ row.problemStatus }}</div>
            </template>
            <template v-slot:operation="{ row }">
              <a @click="goRecords(row)">查看详情</a>
              <!-- <a style="margin-left: 12px" @click="goProblems(row)">查看养护问题</a> -->
            </template>
          </table-page>
        </div>
      </div>
    </div>
    <!--        <div class="detail" v-if="show">-->
    <!--            <record-detail origin="养护" @goback="show = false"></record-detail>-->
    <!--        </div>-->
    <!-- 养护记录 -->
    <suc-modal :config="inspectConfig" v-model="inspectModel" @on-visible-change="oninspecttoggle">
      <inspect-modal v-if="inspectModel" ref="inspect" :inspectId="inspectId" target="养护" :loadingShow="loadingShow"></inspect-modal>
    </suc-modal>
    <!-- 养护问题 -->
    <suc-modal :config="config" v-model="model" @on-visible-change="ontoggle">
      <problem-modal v-if="model" ref="problem" :inspectId="inspectId" target="养护"></problem-modal>
    </suc-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SearchComponent, TablePage } from "@/components";
import { SucButton, SucSelect, SucDatePicker, SucModal, SucInput } from "@suc/ui";
import { maintenanceApi, publicApi, infoApi } from "@/api";
import dayjs from "dayjs";
// import {RecordDetail, ProblemModal, InspectModal} from "./recordPage"
import { InspectModal } from "../model";
import { Mutation } from "vuex-class";
import { ModalConfig } from "@suc/ui/interfaces/index";

@Component({
  components: {
    SearchComponent,
    TablePage,
    SucButton,
    SucSelect,
    SucDatePicker,
    // RecordDetail,
    SucModal,
    SucInput,
    // ProblemModal,
    InspectModal,
  },
})
export default class MaintenanceRecord extends Vue {
  @Mutation setPlanItem: any;
  areaOptions: Array<any> = [];
  loadingShow: boolean = false;
  targetOptions: any[] = [
    {
      label: "水体",
      value: "水体",
    },
    {
      label: "排水设施",
      value: "排水设施",
    },
  ];
  pqOptions: any[] = [];
  columns: any[] = [
    {
      type: "index",
      title: "序号",
    },
    {
      title: "街道",
      key: "areaName",
    },
    {
      title: "泵站名称",
      key: "stationName",
    },
    {
      title: "养护人",
      key: "yhUser",
      // width:200
    },
    {
      title: "养护单位",
      key: "yhCompany",
    },
    {
      title: "养护时间",
      key: "yhTime",
    },
    {
      title: "问题情况",
      slot: "task",
    },
    {
      title: "操作",
      slot: "operation",
      align: "right",
    },
  ];
  tableData: any[] = [];
  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  formParams: any = {
    areaCode: "",
    // target: "",
    endDate: "",
    beginDate: "",
    // mc: "",
    bzname: "",
    companyName: "",
  };
  options: any = {
    type: "datetimerange",
    clearable: true,
    placeholder: "时间段",
  };
  show: boolean = false;
  date: any[] = ["", ""];
  config: ModalConfig = {
    transfer: false,
    title: "养护问题",
    width: 640,
    "footer-hide": true,
  };
  inspectConfig: ModalConfig = {
    transfer: false,
    title: "养护记录",
    width: 1000,
    "footer-hide": true,
  };
  model: boolean = false;
  inspectModel: boolean = false;
  inspectId: string = "";

  ontoggle(val: boolean) {
    this.model = val;
  }
  oninspecttoggle(val: boolean) {
    this.inspectModel = val;
  }

  goProblems(row: any) {
    if (row.taskDetail == "正常") {
      this.$SucMessage.info("暂无养护问题");
      return;
    }
    this.inspectId = row.id;
    this.model = true;
    this.$nextTick(() => {
      (this.$refs.problem as any).init();
    });
  }

  goRecords(item: any) {
    // this.setPlanItem(item)
    this.inspectId = item.recordId;
    this.loadingShow = true;
    this.inspectModel = true;
    this.$nextTick(() => {
      (this.$refs.inspect as any).init(); //关键地方
    });
  }

  search(val: string) {
    this.pageParams.current = 1;
    this.formParams.companyName = val;
    this.getTableData();
  }

  getPage(page: number) {
    this.pageParams.current = page;
    this.getTableData();
  }

  getSize(size: number) {
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
    this.getTableData();
  }

  getTableData() {
    maintenanceApi
      .getPlanList({
        areaCode: this.formParams.areaCode,
        beginDate: this.date[0] ? dayjs(this.date[0]).format("YYYY-MM-DD hh:mm:ss") : "",
        endDate: this.date[1] ? dayjs(this.date[1]).format("YYYY-MM-DD hh:mm:ss") : "",
        pageNumber: this.pageParams.current,
        pageSize: this.pageParams.pageSize,
        bzname: this.formParams.bzname,
        companyName: this.formParams.companyName,
        moduletype:'3'
        // name: this.formParams.mc,
        // target: this.formParams.target,
        // type: "养护",
      })
      .then((data: any) => {
        this.tableData = data && data.data.rows ? data.data.rows : [];
        this.pageParams.total = data ? parseInt(data.data.total) : 0;
      })
      .catch(() => {
        this.$Message.error("获取数据列表失败");
      });
  }

  mounted() {
    this.init();
  }

  init() {
    this.getAreaCode();
    // this.getPqList();
    this.getTableData();
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
        data[i].children = undefined;
      } else {
        this.getTreeData(data[i].children);
      }
    }
    return data;
  }

  async handleChange(value: any) {
    this.formParams.areaCode = value.toString();
  }
  // exportExcel() {
  //   const params: any = {
  //     area: this.formParams.pqid,
  //     cycle: "",
  //     name: this.formParams.mc,
  //     target: this.formParams.target,
  //     beginDate: this.date.length > 0 ? dayjs(this.date[0]).format("YYYY-MM-DD") : "",
  //     endDate: this.date.length > 0 ? dayjs(this.date[1]).format("YYYY-MM-DD") : "",
  //     type: "养护",
  //   };
  //   let str = "";
  //   for (let key in params) {
  //     str += key + "=" + params[key] + "&";
  //   }
  //   const relStr = str.substr(0, str.length - 1);
  //   publicApi.ondownload("/jnsw/maintain/plan/downloadPlanRecord/v2?" + relStr);
  // }

  // 获取片区列表
  //   getPqList() {
  //     maintenanceApi.getPqList().then((data: any) => {
  //       this.pqOptions = data
  //         ? data.map((item: any) => {
  //             return {
  //               label: item + "片",
  //               value: item,
  //             };
  //           })
  //         : [];
  //     });
  //   }

  getTime(val:any){
     console.log(val,"6666");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";
.module-view {
  padding: 10px;
  background-color: $pages-bg;
  position: relative;
  .bg-shadow {
    height: 100%;
    background-color: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  }
  .top-nav {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    &-item {
      display: flex;
      .btn {
        margin-right: 10px;
      }
    }
  }
  .content {
    padding: 10px;
    height: calc(100% - 62px);
    border-top: 1px solid $border-color;
    &-item {
      height: 100%;
      .status {
        display: flex;
        justify-content: center;
        padding: 3px 8px;
        width: 50px;
        border-radius: 2px;
        color: #ffffff;
      }
      .green-state {
        background-color: $state-green;
      }
      .red-state {
        background-color: $state-red;
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
  .detail {
    width: 100%;
    height: 100%;
    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: $pages-bg;
  }
}
</style>

<template>
  <!-- 水质 -->
  <div class="module-view">
    <div class="top bg-shadow">
      <div class="top-item flex-class">
        <!-- <suc-select v-model="type" :options="options" :config="{ placeholder: '', clearable: false }" @on-change="changeType"></suc-select> -->
        <!--时间 -->
        <div class="top-item-sub">
          <suc-date-picker
            v-model="paramMonth"
            :options="{
              type: 'month',
              clearable: false,
              placeholder: '请选择年月',
            }"
          ></suc-date-picker>
        </div>
        <div class="top-item-sub">
          <suc-input v-model="qulityParams.sectionName" placeholder="请输入断面名称" :config="{ clearable: true }"></suc-input>
        </div>
        <div class="top-item-sub">
          <search-component placeholderTxt="请输入河道名称" @input="onsearch"></search-component>
        </div>
      </div>
      <div class="top-item">
        <Poptip trigger="hover" placement="bottom-start" width="755">
          <span style="color: #ffcf31; font-size: 20px" class="iconfont icon-zhushi"></span>
          <div slot="content">
            <suc-table :data="tableData" border>
              <template v-for="(item, index) in cols">
                <suc-table-column :prop="item.value" :label="item.title" :width="item.width" :align="item.align" :key="index">
                  <template v-for="(it, id) in item.cols">
                    <suc-table-column :prop="it.value" :label="it.title" :width="it.width" :align="it.align" :key="id"> </suc-table-column>
                  </template>
                </suc-table-column>
              </template>
            </suc-table>
          </div>
        </Poptip>
      </div>
    </div>
    <div class="noData" v-show="show2">暂无数据</div>
    <div class="list">
      <div class="list-item bg-shadow" v-for="(item, index) in listArr" :key="'list' + index" @click="getDetail(item)">
        <div class="list-item-header">
          <div class="header-item">
            <span class="iconfont icon-dizhi blue-color"></span>
            <span class="normal-color">{{ item.sectionName }}</span>
          </div>
        </div>
        <!-- 列表结构 -->
        <div class="list-item-content">
          <div class="content-item">
            <div class="content-item-sub">
              <span class="content-name">监测河道</span><span>{{ item.riverName }}</span>
            </div>
            <div class="content-item-sub">
              <span class="content-name">所属区域</span>
              <span v-if="item.areaName != ''">{{ item.areaName }}</span>
              <span v-else class="content-name">无</span>
            </div>
            <div class="content-item-sub">
              <span class="content-name">当前水质</span>
              <span v-if="item.nowWq != ''" :class="item.class1">{{ item.nowWq }}</span>
              <span v-else class="content-name">无</span>
            </div>
            <div class="content-item-sub">
              <span class="content-name">目标水质</span>
              <span v-if="item.targetWq != ''" :class="item.class">{{ item.targetWq }}</span>
              <span v-else class="content-name">{{ item.targetWq }}</span>
            </div>
          </div>
          <div class="content-item">
            <div class="content-item-factors">
              <span class="content-name">超标因子</span>
              <div class="factors" v-if="item.over != ''">
                <div class="factors-item">
                  <span>{{ item.over }}</span>
                </div>
              </div>
              <div v-else>
                <span class="content-name">无</span>
              </div>
            </div>
            <div class="content-item-factors">
              <span class="content-name">预警因子</span>
              <div class="factors" v-if="item.warn != ''">
                <div class="factors-item">
                  <span>{{ item.warn }}</span>
                </div>
              </div>
              <div v-else>
                <span class="content-name">无</span>
              </div>
            </div>
            <div class="content-item-factors">
              <span class="content-name">达标状况</span>
              <span :class="[item.stand == ('达标' || '已达标') ? 'styleGreen' : 'styleRed']">{{ item.stand }}</span>
            </div>
          </div>
        </div>
        <div class="list-item-foot">
          <div class="foot-item">
            <span style="margin-right: 10px">更新时间</span>
            <span>{{ item.tm }}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <suc-page
        size="small"
        :total="pageParams.total"
        :current="pageParams.current"
        :page-size="pageParams.pageSize"
        :show-total="false"
        :show-sizer="true"
        :show-elevator="true"
        :page-size-opts="[12]"
        @on-change="getPage"
        @on-page-size-change="getSize"
      />
    </div>
    <div class="detail-item" v-if="show">
      <detail :url="url" @goback="getshow" :itemData="itemData"></detail>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import { SucSelect, SucButton, SucInput, SucPage, SucTable, SucTableColumn, SucDatePicker } from "@suc/ui";
import { SelectConfig, SelectOptions } from "@suc/ui/interfaces";
import { Poptip } from "iview";
import { SearchComponent } from "@/components";
import { Detail } from "./qulityPage";
import { riverApi } from "@/api";
import { statusConst } from "@/constants/status";

@Component({
  components: {
    SucSelect,
    SucButton,
    SucInput,
    SucPage,
    SucTable,
    SucTableColumn,
    Poptip,
    SearchComponent,
    Detail,
    SucDatePicker,
  },
})
export default class WaterQulity extends Vue {
  @Mutation setQulity: any;
  show: boolean = false;
  url: string = this.$route.path;
  itemData: object = {};
  type: string = "zd";
  options: SelectOptions = [
    {
      label: "自动站",
      value: "zd",
    },
    {
      label: "手动站",
      value: "sd",
    },
    {
      label: "污水处理",
      value: "wscl",
    },
    {
      label: "应急装置",
      value: "yjzz",
    },
  ];
  cols: Array<object> = [
    {
      title: "项目名称",
      value: "name",
      width: 120,
      align: "center",
    },
    {
      title: "标准限制(mg/L)",
      value: "",
      width: 600,
      align: "center",
      cols: [
        {
          title: "Ⅰ类标准",
          value: "level1",
          width: 120,
          align: "center",
        },
        {
          title: "Ⅱ类标准",
          value: "level2",
          width: 120,
          align: "center",
        },
        {
          title: "Ⅲ类标准",
          value: "level3",
          width: 120,
          align: "center",
        },
        {
          title: "Ⅳ类标准",
          value: "level4",
          width: 120,
          align: "center",
        },
        {
          title: "Ⅴ类标准",
          value: "level5",
          width: 120,
          align: "center",
        },
      ],
    },
  ];
  tableData: Array<object> = [
    {
      name: "高锰酸盐指数",
      compare: "≤",
      level1: 2,
      level2: 4,
      level3: 6,
      level4: 10,
      level5: 15,
    },
    {
      name: "氨氮",
      compare: "≤",
      level1: 0.15,
      level2: 0.5,
      level3: 1.0,
      level4: 1.5,
      level5: 2.0,
    },
    {
      name: "总磷",
      compare: "≤",
      level1: 0.02,
      level2: 0.1,
      level3: 0.2,
      level4: 0.3,
      level5: 0.4,
    },
    {
      name: "溶解氧",
      compare: "≥",
      level1: 15,
      level2: 15,
      level3: 20,
      level4: 30,
      level5: 40,
    },
    {
      name: "总氮",
      compare: "≤",
      level1: 0.2,
      level2: 0.5,
      level3: 1.0,
      level4: 1.5,
      level5: 2.0,
    },
    {
      name: "化学需氧量",
      compare: "≤",
      level1: 15,
      level2: 15,
      level3: 20,
      level4: 30,
      level5: 40,
    },
  ];
  listArr: any[] = [];
  show2: boolean = true;
  pageParams: any = {
    current: 1,
    total: 0,
    pageSize: 12,
  };
  paramMonth: any = new Date(new Date().setMonth(new Date().getMonth())); //当前月
  qulityParams: any = {
    month: "",
    sectionName: "",
    riverName: "",
    pageNumber: 1,
    pageSize: 12,
    // riverType: "",
  };
  onsearch(val: string) {
    this.qulityParams.riverName = val;
    this.getQulityData();
  }
  mounted() {
    this.getQulityData();
  }
  created() {}
  statusName(status: string) {
    return (status && statusConst[status] && statusConst[status].name) || "";
  }
  statusStyle(status: string) {
    return (status && statusConst[status] && statusConst[status].style) || "";
  }
  async getQulityData() {
    this.listArr = [];
    this.qulityParams.month = this.$utils.dateFormat(this.paramMonth, "yyyy-MM");
    this.qulityParams.pageNumber = this.pageParams.current;
    this.qulityParams.pageSize = this.pageParams.pageSize;
    // let data = this.type == 'zd' ? await riverApi.getQulityData(this.qulityParams) : await riverApi.getManualQulityData(this.qulityParams)
    let data: any = {};
    let list: any = [];
    data = await riverApi.getSzjcTable(this.qulityParams);
    list = data.data.rows;
    this.pageParams.total = parseInt(data.data.total);
    // if (this.type == "zd") {
    //   data = await riverApi.getQulityData(this.qulityParams);
    //   this.pageParams.total = data.totalRecord;
    //   list = data.list;
    // } else if (this.type == "sd") {
    //   data = await riverApi.getManualQulityData(this.qulityParams);
    //   this.pageParams.total = data.totalRecord;
    //   list = data.list;
    // } else if (this.type == "wscl") {
    //   let params = {
    //     pageSize: this.pageParams.pageSize,
    //     currentPage: this.pageParams.current,
    //     mc: this.qulityParams.name,
    //     lx: 1,
    //   };
    //   data = await riverApi.getWsclData(params);
    //   this.pageParams.total = data.totalCount;
    //   list = data.data;
    // } else if (this.type == "yjzz") {
    //   let params = {
    //     pageSize: this.pageParams.pageSize,
    //     currentPage: this.pageParams.current,
    //     mc: this.qulityParams.name,
    //     lx: 1,
    //   };
    //   data = await riverApi.getYjzzData(params);
    //   this.pageParams.total = data.totalCount;
    //   list = data.data;
    // }

    this.listArr = list.map((e: any) => {
      let item: any = {};
      item = {
        sectionId: e.sectionId,
        sectionName: e.sectionName,
        areaName: e.areaName,
        riverName: e.riverName,
        nowWq: e.nowWq,
        targetWq: e.targetWq,
        over: e.over, //超标因子
        stand: e.stand, //达标情况
        warn: e.warn, //预警因子
        tm: e.tm, //更新时间
        lon: e.lon,
        lat: e.lat,
        state: e.standard,
        type: e.riverType,
        class: this.calcColor(e.targetWq),
        class1: this.calcColor(e.nowWq),
      };
      return item;
    });
    if (this.listArr.length) {
      this.show2 = false;
    } else {
      this.show2 = true;
    }
  }

  // 给class 颜色
  calcColor(level: string) {
    switch (level) {
      case "Ⅰ类":
        return "green-label";
      case "Ⅱ类":
        return "green-label";
      case "Ⅲ类":
        return "green-label";
      case "Ⅳ类":
        return "orange-label";
      case "Ⅴ类":
        return "red-label";
      case "劣Ⅴ类":
        return "darkRed-label";
      default:
        return "blue-label";
    }
  }

  getshow(val: boolean) {
    this.show = val;
  }
  getPage(page: number) {
    this.pageParams.current = page;
    this.getQulityData();
  }
  getSize(size: number) {
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
    this.getQulityData();
  }
  getDetail(data: any) {
    data.originPage = this.type; // 区分自动站还是手动站
    this.itemData = data;
    this.setQulity(data);
    this.show = true;
  }
  changeType() {
    this.getQulityData();
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";
.module-view {
  position: relative;
  padding: 10px;
  background-color: $pages-bg;
  .flex-class {
    display: flex;
    align-items: center;
  }
  .top {
    width: 100%;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    // background-color: #ffffff;
    // box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    &-item {
      &-sub {
        margin-right: 10px;
      }
    }
  }
  .noData {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .list {
    // margin-top: 10px;
    padding-top: 10px;
    width: 100%;
    height: calc(100% - 100px);
    overflow-y: auto;
    // display: flex;
    // flex-wrap: wrap;
    // align-items: flex-start;
    &-item {
      padding: 15px;
      margin: 0 10px 10px 0;
      float: left;
      width: calc((100% - 30px) / 4);
      height: calc(33% - 10px);
      // height: calc(50% - 10px);
      // background-color: #ffffff;
      // box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
      font-size: $font-size-base;
      color: $heading-color;
      cursor: pointer;
      &:nth-of-type(4n) {
        margin-right: 0;
      }
      &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      &-content {
        padding: 10px 15px;
        height: 80%;
        .content-item {
          color: $heading-color;
          .darkRed-label {
            color: #ce1717;
          }
          .red-label {
            color: #ff5a47;
          }
          .orange-label {
            color: #ffab3d;
          }
          .blue-label {
            color: #3a7bef;
          }
          .green-label {
            color: #32bb53;
          }
          .styleGreen {
            color: #6ecd52;
          }
          .styleRed {
            color: red;
          }
          &:first-of-type {
            display: flex;
            flex-wrap: wrap;
          }
          &-sub {
            width: 50%;
          }
          &-factors {
            display: flex;
          }
          &:nth-of-type(2) {
            .factors {
              display: flex;
              flex-wrap: wrap;
              &-item {
                // width: 50%;
                margin-right: 10px;
                font-size: $font-size-small;
              }
            }
          }
        }
        .content-name {
          display: inline-block;
          padding-right: 10px;
          width: 80px;
          color: $help-color;
          white-space: nowrap;
        }
        .circle {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #ff5a47;
        }
      }
      &-foot {
        padding: 0 15px;
        .foot-item {
          color: $help-color;
        }
      }
      .normal-color {
        font-size: $font-size-large;
        color: $heading-color;
      }

      .blue-color {
        color: $state-blue;
      }
      .state {
        padding: 3px 10px;
        font-size: $secondary-color;
        color: #ffffff;
      }
      .red-state {
        background-color: $state-red;
      }
      .warn-state {
        background-color: $state-warn;
      }
      .green-state {
        background-color: $state-green;
      }
    }
  }
  .detail-item {
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

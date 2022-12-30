<template>
  <!-- 水质监测详情 -->
  <div class="detail-view">
    <div class="detail-item">
      <div class="nav-item">
        <div class="nav-item-sub" @click="goback">
          <span class="iconfont icon-fanhui"></span>
          <span>返回</span>
        </div>
        <div class="nav-item-sub">
          <span>{{ waterQulity.qulity.sectionName }}</span>
        </div>
        <div :class="[itemData.stand == '达标' ? 'greenbgc nav-item-sub' : 'redbgc nav-item-sub']">
          <span>{{ itemData.stand }}</span>
        </div>
      </div>
      <div class="nav-item" v-show="btnShow">
        <div class="button-pannel" v-for="(button, index) in buttons" :key="index">
          <suc-button :type="button.type" :config="button.iviewProps" :debounce="800" @on-click="onclick(button, index)">{{ button.label }} </suc-button>
        </div>
      </div>
    </div>
    <div class="detail-item">
      <div class="left-item">
        <div class="left-item-sub">
          <!-- <yx-site-map v-if="waterQulity.qulity.siteId == '3'"></yx-site-map> -->
          <site-map></site-map>
        </div>
        <div class="left-item-sub">
          <tabs-list :tabs="tabs"></tabs-list>
        </div>
      </div>
      <div class="right-item">
        <qulity-list></qulity-list>
      </div>
    </div>
    <create-task v-if="model" :model="model" @toggle-model="toggle" :sbParams="sbParams"></create-task>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import { SucButton } from "@suc/ui";
import { SiteMap, QulityList, TabsList, YxSiteMap } from "./component";
import { CreateTask } from "@/components";
@Component({
  components: {
    SucButton,
    QulityList,
    SiteMap,
    TabsList,
    CreateTask,
    YxSiteMap,
  },
})
export default class ModuleView extends Vue {
  @State waterQulity: any;
  // @Prop({
  //   type: Array,
  //   default: () => [1, 2, 3, 4, 5],
  // })
  tabs: any = [];
  @Prop() url!: string;
  @Prop() itemData!: object;
  buttons: any[] = [
    {
      label: "创建任务事件",
      type: "primary",
    },
    // {
    //   label: "模型调水",
    //   type: "primary",
    //   iviewProps: {
    //     ghost: true,
    //   },
    // },
  ];
  btnShow: boolean = false;
  model: boolean = false;
  sbParams: any = {};
  @Watch("waterQulity", { immediate: true, deep: true })
  waterQulityChange(data: any) {
    if (data.qulity) {
      this.sbParams = {
        sbid: data.qulity.riverId || data.qulity.bid,
        sbmc: data.qulity.riverName || data.qulity.mc,
        jd: data.qulity.jd || "",
        wd: data.qulity.wd || "",
        pqid: data.qulity.area || "",
        rwlx: "水环境",
      };
    }
  }

  onclick(val: any, index: number) {
    if (index == 0) {
      this.model = !this.model;
    }
  }
  toggle(state: boolean) {
    this.model = state;
  }
  @Emit()
  goback() {
    return false;
  }
  // dom创建前
  created() {
    // this.tabs = this.waterQulity.qulity.originPage == "sd" ? [1, 2] : [1, 2, 3, 4, 5];
    // if (this.waterQulity.qulity.originPage == "sd") {
    //   this.tabs = [1, 2];
    // } else if (this.waterQulity.qulity.originPage == "zd") {
    //   this.tabs = [1, 2, 3, 4, 5];
    // } else if (this.waterQulity.qulity.originPage == "wscl") {
    //   this.tabs = [2, 6];
    // } else if (this.waterQulity.qulity.originPage == "yjzz") {
    //   this.tabs = [1, 6];
    // }
    // this.hideBtn();

    this.tabs = [1, 2, 3, 4, 5];
  }
  // 根据操作权限判断按钮的显示或隐藏
  // hideBtn() {
  //   var questUrl = "";
  //   if ((this.url = "/main/environment/waterqulity")) {
  //     questUrl = "environment_waterqulity";
  //   }
  //   if ((this.url = "/main/environment/report")) {
  //     questUrl = "environment_report";
  //   }
  //   // if (this.url = "/main/pieNetwork/task") {
  //   //   questUrl = "pieNetwork_task";
  //   // }
  //   this.$http.get("jnsw/rest/authox/check?resource=" + questUrl + "&op=" + "manage").then((res: any) => {
  //     this.btnShow = res.data.allowed;
  //   });
  // }
}
</script>

<style lang="scss" scoped>
.detail-view {
  width: 100%;
  height: 100%;
  pointer-events: auto;
  .detail-item {
    &:first-of-type {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      background-color: #ffffff;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    }
    &:nth-of-type(2) {
      height: calc(100% - 60px);
      padding-top: 10px;
      .right-item {
        float: right;
        width: 25%;
        height: 100%;
        background-color: #ffffff;
      }
      .left-item {
        float: left;
        padding-right: 10px;
        width: 75%;
        height: 100%;
        &-sub {
          background-color: #ffffff;
          &:first-of-type {
            margin-bottom: 10px;
            padding: 10px;
            height: calc(60% - 10px);
          }
          &:nth-of-type(2) {
            height: 40%;
          }
        }
      }
    }
    .greenbgc {
      color: #fff !important;
      background: #32bb53;
    }
    .redbgc {
      color: #fff !important;
      background: #ff5a47;
    }

    .nav-item {
      &:first-of-type {
        display: flex;
        align-items: center;
      }
      &:last-of-type {
        .button-pannel {
          display: inline-block;
          margin-right: 16px;
        }
      }
      &-sub {
        padding-left: 15px;
        font-size: 16px;
        color: #333;
        &:first-of-type {
          font-size: 14px;
          color: #3983f3;
          cursor: pointer;
        }
        &:nth-of-type(2) {
          position: relative;
          &::before {
            content: "";
            width: 1px;
            height: 100%;
            position: absolute;
            top: 0;
            left: 8px;
            background-color: #dde4eb;
          }
        }
        &:nth-of-type(3) {
          margin-left: 10px;
          font-size: 12px;
          padding: 5px 10px;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>

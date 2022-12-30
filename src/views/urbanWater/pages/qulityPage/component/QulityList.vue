<template>
  <div class="module-view">
    <panel-view heading="引水水源地水质">
      <!-- <div class="list-container scroll">
        <div class="list-item" v-for="(list, index) in listArr" :key="'list' + index">
          <div class="list-item-site">
            <div>
              <span class="state-blue iconfont icon-dizhi"></span>
              <span>{{ list.zdmc + "(" + list.site + ")" }}</span>
            </div>
            <div v-if="list.state" :class="[list.state == '超标' ? 'state-red' : 'state-green']">
              <span style="color: #fff">{{ list.state }}</span>
            </div>
            <div v-else><span>-</span></div>
          </div>
          <div class="list-item-info">
            <div class="info-item">
              <div style="margin-right: 10px">
                <span class="info-name">当前水质</span>
                <span :style="{ color: list.xzcolor }">{{ list.qulity }}类</span>
              </div>
              <div>
                <span class="info-name">目标水质</span><span :style="{ color: list.mbcolor }">{{ list.aim }}类</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-name">站点类型</span>
              <span class="info-name">{{ list.type }}</span>
            </div>
            <div class="info-item">
              <span class="info-name">污染程度</span>
              <span class="info-name">{{ list.grade }}</span>
            </div>
            <div class="info-item">
              <span class="info-name">更新时间</span>
              <span class="info-name">{{ list.time }}</span>
            </div>
          </div>
        </div>
      </div> -->
      <div class="list-container scroll" v-if="allShow">
        <div class="list-item" v-if="topShow">
          <div class="list-item-site">
            <div>
              <span class="state-blue iconfont icon-dizhi"></span>
              <span>{{ sourceObjData.sourceSectionName + "(" + sourceObjData.sourceRiverName + ")" }}</span>
            </div>
            <div>
              <span>{{ sourceObjData.sourceTp }}</span>
            </div>
          </div>
          <div class="list-item-info">
            <div class="info-item">
              <div style="margin-right: 10px">
                <span class="info-name">当前水质</span>
                <span>{{ sourceObjData.sourceNowWq }}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-name">目标水质</span>
              <span>{{ sourceObjData.sourceTargetWq }}</span>
            </div>
            <div class="info-item">
              <span class="info-name">超标因子</span>
              <span class="info-name">{{ sourceObjData.sourceOver }}</span>
            </div>
            <div class="info-item">
              <span class="info-name">更新时间</span>
              <span class="info-name">{{ sourceObjData.sourceTm }}</span>
            </div>
          </div>
        </div>
        <!-- 第二个 -->
        <div class="list-item" v-if="bottomShow">
          <div class="list-item-site">
            <div>
              <span class="state-blue iconfont icon-dizhi"></span>
              <span>{{ sourceObjData.crossSectionName + "(" + sourceObjData.crossRiverName + ")" }}</span>
            </div>
            <div>
              <span></span>
            </div>
          </div>
          <div class="list-item-info">
            <div class="info-item">
              <div style="margin-right: 10px">
                <span class="info-name">当前水质</span>
                <span style="color:red">{{ sourceObjData.crossNowWq }}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-name">目标水质</span>
              <span style="color:red">{{ sourceObjData.crossTargetWq }}</span>
            </div>
            <div class="info-item">
              <span class="info-name">超标因子</span>
              <span class="info-name">{{ sourceObjData.crossOver }}</span>
            </div>
            <div class="info-item">
              <span class="info-name">更新时间</span>
              <span class="info-name">{{ sourceObjData.crossTm }}</span>
            </div>
          </div>
        </div>
      </div>
    </panel-view>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import { PanelView } from "@/components";
import { riverApi } from "@/api";
import { djColor } from "@/constants/status";
@Component({
  components: {
    PanelView,
  },
})
export default class MonitorList extends Vue {
  @State waterQulity: any;
  listArr: any[] = [];
  allShow: boolean = false;
  topShow: boolean = true;
  bottomShow: boolean = true;

  mounted() {
    this.getQulityData();
  }
  qulityParams: any = {
    riverId: "",
  };

  sourceObjData: any = {};

  async getQulityData() {
    this.listArr = [];
    let data = await riverApi.getSource({
      sectionId: this.waterQulity.qulity.sectionId,
    });
    data.data == "" || {} ? (this.allShow = false) : (this.allShow = true);
    this.listArr = data.map((e: any) => {
      let mbcolor = djColor[e.MBSZLB];
      let xzcolor = djColor[e.XZSZ];
      let item = {
        site: e.RIVER_NAME,
        state: e.DBQK,
        // area: e.area,
        qulity: e.XZSZ,
        aim: e.MBSZLB,
        abnormal: [],
        alarm: [],
        time: e.MONTH,
        mbcolor: mbcolor,
        xzcolor: xzcolor,
        grade: e.grade,
        type: e.type,
        zdmc: e.zdmc,
      };
      return item;
    });
    if (data.data.source) {
      this.topShow = true;
    } else {
      this.topShow = false;
    }
    if (data.data.cross) {
      this.bottomShow = true;
    } else {
      this.bottomShow = false;
    }
    this.sourceObjData = data.data;
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";
.module-view {
  width: 100%;
  height: 100%;
  .list-container {
    padding: 0 0 10px;
    height: calc(100% - 52px);
    border-top: 1px solid $border-color;
    overflow: auto;
    .list-item {
      padding: 10px;
      border-bottom: 1px solid $border-color;
      &-site {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div {
          &:first-of-type {
            font-size: $font-size-large;
            color: $heading-color;
          }
          &:last-of-type {
            padding: 3px 8px;
          }
        }
      }
      &-info {
        padding: 10px 0 0 14px;
        .info-item {
          padding-bottom: 10px;
          display: flex;
          font-size: $font-size-base;
          color: $heading-color;
          .factors {
            display: flex;
            flex-wrap: wrap;
            width: calc(100% - 64px);
            &-item {
              width: 50%;
            }
          }
        }
        .info-name {
          display: inline-block;
          padding-right: 8px;
          color: $help-color;
        }
      }
      .green-color {
        color: #32bb53;
      }
      .state-blue {
        color: $state-blue;
      }
      .state-red-txt {
        color: $state-red;
      }
      .state-green {
        background-color: $state-green;
      }
      .state-red {
        background-color: $state-red;
      }
    }
  }
}
</style>

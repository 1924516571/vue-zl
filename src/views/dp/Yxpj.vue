<!-- <template>
  <div class="mainContain">
    <h1>我是协同处置模块！！！！</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
@Component({
  components: {},
})
export default class OperateMonitore extends Vue {}
</script>

<style lang="scss" scoped>
$deep: "::v-deep";
.mainContain {
  width: 100%;
  height: calc(100% - 84px);
  color: #fff;
}
</style> -->
<template>
  <div class="mainContain">
    <!-- 左页面 -->
    <async-left></async-left>
    <!--下页面 -->
    <async-bottom></async-bottom>
    <!-- 右面 -->
    <!-- <async-right></async-right> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { DpMap, TableNo } from "@/components";
import { State, Mutation, Action, namespace } from "vuex-class";
import { getSwzIcon } from "@/constants/mapIcon";
import { AsyncLeft, AsyncBottom, AsyncRight, AsyncHead } from "./yxpjAsync";
import { SucCheckboxGroup, SucCheckbox } from "@suc/ui";
const mapStore = namespace("mapStore");
@Component({
  components: {
    DpMap,
    AsyncLeft,
    AsyncBottom,
    AsyncRight,
    AsyncHead,
    SucCheckboxGroup,
    SucCheckbox,
  },
})
export default class OperateMonitore extends Vue {
  @mapStore.Mutation setMarkers: any;
  olMap = this.$getMapConfig();
 

}

</script>

<style lang="scss" scoped>
$deep: "::v-deep";
.mainContain {
  width: 100%;
  height: calc(100% - 84px);
  color: #fff;
  .mainContain_map {
    width: 100%;
    height: 100%;
    .tkOut {
      // width: 206px;
      // height: 9px;
      // background: url("../../~@/assets/dp/Xtcz/背景.png") no-repeat;
      // background-size: 100% 100%;
      // position: relative;
      .tkTitle {
        position: absolute;
        width: 48px;
        height: 13px;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #0f2142;
        line-height: 40px;
        left: 79px;
        top: -8px;
      }
      .tkContent {
        width: calc(100% - 21px);
        height: 70px;
        position: absolute;
        top: 39px;
        left: 21px;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 1px;
        .tkContent_hidden {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .tkContent_item {
            color: #00a8a4;
          }
        }
      }
    }
  }
  .headView {
    width: 687px;
    height: 56px;
    // background: pink;
    top: 90px;
    left: 621px;
    position: absolute;
    background: url("~@/assets/dp/AsyncMonitore/top.png") 100% no-repeat;
    background-size: 100% 100%;
    line-height: 56px;
    &-item {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      #{$deep}.suc-checkbox .ivu-checkbox-wrapper {
        color: #fff;
      }
    }
  }
}

#{$deep}.vueol-overlay {
  background-color: transparent;
  width: 206px;
  height: 149px;
}
</style>

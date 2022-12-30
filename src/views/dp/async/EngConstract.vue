<template>
  <!--工程建设 -->
  <div class="main">
    <div class="table_title">
      <span>序号</span>
      <span>工程名称</span>
      <span>预警内容</span>
      <span>报警时间</span>
    </div>
    <vue-seamless-scroll :data="gcjsData" class="alarm scrollDp">
      <div class="alarm-item" v-for="(item, index) in gcjsData" :key="item.id" @click="onRow(item)">
        <span class="text-over text-over-special" v-text="`${index + 1}`"></span>
        <span class="text-over" v-text="`${item.name}`"></span>
        <span class="text-over" v-text="`${item.content}`"></span>
        <span class="text-over" v-text="`${item.createtime}`"></span>
      </div>
    </vue-seamless-scroll>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import vueSeamlessScroll from "./myClass.vue";
import { homeApi } from "@/api";
const dpStore = namespace("dpStore");
@Component({
  components: {
    vueSeamlessScroll,
  },
})
export default class AlarmAbnormal extends Vue {
  @dpStore.Mutation setModalData: any;
  @dpStore.Mutation clear: any;
  @dpStore.State gcjsData: any;
  @Emit()
   async onRow(item?: any) {
    // this.clear();
    return item;
  }
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  user-select: none;
  .table_title {
    span {
      width: 28.3%;
      color: #00a8ff;
      display: inline-block;
      text-align: center;
    }
    span:first-of-type {
      width: 15%;
    }
  }
  .alarm {
    width: 100%;
    height: 93%;
    // border-top: 1px solid #268000;
    // overflow: hidden;
    overflow: auto;
    .alarm-item {
      width: 100%;
      height: 100%;
      height: 24px;
      line-height: 24px;
      margin-top: 7px;
      color: #515a6e;
      background: url("~@/assets/dp/AsyncMonitore/tableBgc.png") no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
      cursor: pointer;
      .text-over {
        display: inline-block;
        width: 28.3%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        // text-align: center;
        &-special {
          text-align: center;
        }
      }
      .text-over:first-of-type {
        width: 15%;
      }
    }
  }
}
</style>

<template>
  <!--工程建设 -->
  <div class="main">
    <div class="table_title">
      <span>项目名称</span>
      <span>发现问题</span>
      <span>立案</span>
      <span>派单</span>
      <span>处置</span>
      <span>核查</span>
      <span>结案</span>
    </div>

    <vue-seamless-scroll :data="listData" class="alarm">
      <div class="alarm-item" v-for="item in listData" :key="item.areaname">
        <span class="text-over" v-text="`${item.areaname}`"></span>
        <span class="text-over" v-text="`${item.fxwt}`"></span>
        <span class="text-over" v-text="`${item.la}`"></span>
        <span class="text-over" v-text="`${item.pd}`"></span>
        <span class="text-over" v-text="`${item.cz}`"></span>
        <span class="text-over" v-text="`${item.hc}`"></span>
        <span class="text-over" v-text="`${item.ja}`"></span>
      </div>
    </vue-seamless-scroll>
  </div>
</template>
<script lang="ts">
import { publicApi } from "@/api";
import { Vue, Component, Emit } from "vue-property-decorator";
import vueSeamlessScroll from "../../async/myClass.vue";
@Component({
  components: {
    vueSeamlessScroll,
  },
})
export default class LbTable extends Vue {
  listData: any[] = [];
  async getList() {
    let url = "wjServer/xwzl/yxjc/xtzhJd";
    const data = await publicApi.getNoParam(url);
    this.listData = data.data;
  }
  mounted() {
    this.getList();
  }
}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  .table_title {
    span {
      width: 50px;
      color: #00a8ff;
      display: inline-block;
      text-align: center;
    }
    span:first-of-type {
      width: 100px;
    }
  }
  .alarm {
    width: 100%;
    height: 90%;
    // border-top: 1px solid #268000;
    overflow: hidden;
    .alarm-item {
      width: 100%;
      height: 100%;
      height: 23px;
      line-height: 23px;
      margin-top: 7px;
      color: #515a6e;
      background: url("~@/assets/dp/AsyncMonitore/tableBgc.png") no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
      cursor: pointer;
      .text-over {
        display: inline-block;
        width: 50px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }
      .text-over:first-of-type {
        width: 100px;
      }
    }
  }
}
</style>

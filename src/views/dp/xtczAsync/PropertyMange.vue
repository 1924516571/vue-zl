<template>
  <div class="bg">

  </div>
</template>
<style scoped>
 .bgc {
   /* background: url("~@/assets/dp/AsyncMonitore/jc.png") 100% no-repeat; */
   background-size: 100% 100%;
   height: 250px;
 }
</style>
<!--物业管理 -->
<!-- <template>
  <div class="main">
    <div class="bgc"></div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import vueSeamlessScroll from "./myClass.vue";
import { homeApi } from "@/api";
@Component({
  components: {
    vueSeamlessScroll,
  },
})
export default class AlarmAbnormal extends Vue {
  @Mutation setFormParams: any;
  listData: any[] = [];
}
</script>
<style lang="scss" scoped>
// .bgc {
//   background: url("~@/assets/dp/AsyncMonitore/jc.png") 100% no-repeat;
//   background-size: 100% 100%;
//   height: 250px;
// }
.main {
  width: 100%;
  height: 100%;
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
    height: 95%;
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
        text-align: center;
      }
      .text-over:first-of-type {
        width: 15%;
      }
    }
  }
}
</style> -->

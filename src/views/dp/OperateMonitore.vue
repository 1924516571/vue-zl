<template>
  <div class="mainContain">
    <div class="top">
    <div
      v-for="(item, index) in menuList"
      :key="index"
      :class="flag == index ? 'menu active' : 'menu'"
      @click="menuClick(index)"
    >
      {{ item.name }}
    </div>
    </div>
    <rqaq v-if="flag == 0"></rqaq>
    <gcjs v-if="flag == 1"></gcjs>
    <psjg v-if="flag == 2"></psjg>

  </div>
  
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import rqaq from  "./yxjc/page/rqaq.vue"
import gcjs from  "./yxjc/page/gcjs.vue"
import psjg from  "./yxjc/page/psjg.vue"

@Component({
  components: {
    rqaq,
    gcjs,
    psjg
  },
})
export default class OperateMonitore extends Vue {
  flag: any = 1;
  menuList: any = [
    { name: "燃气安全" },
    { name: "工程建设" },
    { name: "排水监管" },
    { name: "物业管理" },
    { name: "城市管理" },
    { name: "交通运输" },
    { name: "水环境" },
  ];
  menuClick(flag: any) {
    this.flag = flag;
  }

  
}
</script>

<style lang="scss" scoped>
$deep: "::v-deep";

.mainContain{
  width: 100%;
  height: calc(100% - 84px);
  overflow-y: auto;
  color: #fff;
  overflow-y: auto;
  .top {
    position: absolute;
    top: 89px;
    left: 490px;
    z-index: 2;
    // width: 690px;
    height: 39px;
    div:first-child {
      margin-left: 0px;
    }
    .menu {
      width: 125px;
      height: 39px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      margin-left: -29px;
      background: url("../../assets/dp/OperateMonitoreRq/zmenu1.png") no-repeat;
      background-size: 100% 100%;
      line-height: 39px;
    }
    .active {
      background: url("../../assets/dp/OperateMonitoreRq/zmenu2.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}

</style>

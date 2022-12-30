<template>
  <div class="AA">
    <div class="left  mainContain_left1">
      <!-- <div class="engConstract_title">工程建设</div>
      <div class="engConstract_content">
        <eng-constract @on-row="getRow"></eng-constract>
      </div> -->
    </div>
    <div class="left mainContain_left2">
      <!-- <div class="engConstract_title">排水管理</div>
      <div class="engConstract_content">
        <water-manger @on-row="getRow"></water-manger>
      </div> -->
    </div>
    <div class="left mainContain_left3">
      <!-- <div class="engConstract_title">城市管理</div>
      <div class="engConstract_content">
        <city-manger @on-row="getRow"></city-manger>
      </div> -->
    </div>
    <div class="left mainContain_left4">
      <!-- <div class="engConstract_title">城市管理</div>
      <div class="engConstract_content">
        <city-manger @on-row="getRow"></city-manger>
      </div> -->
    </div>
    <div class="left mainContain_left5">
      <!-- <div class="engConstract_title">城市管理</div>
      <div class="engConstract_content">
        <city-manger @on-row="getRow"></city-manger>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import EngConstract from "./EngConstract.vue";
import WaterManger from "./WaterManger.vue";
import CityManger from "./CityManger.vue";
import { State, Mutation } from "vuex-class";

@Component({
  components: {
    EngConstract,
    WaterManger,
    CityManger,
  },
})
export default class AsyncLeft extends Vue {
  @State issues: any;
  itemObj: any = {};
  getRow() {
    console.log(this.issues, "???/");
    this.itemObj = this.issues;
  }
}
</script>
<style lang="scss" scoped>
.AA {
  .left {
    width: 360px;
    height: 550px;
    background: url("../../../assets/dp/AsyncMonitore/box.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    color: #fff;
  }
  .engConstract_title {
    position: absolute;
    left: 182px;
    top: 10px;
    font-size: 16px;
    font-family: Source Han Sans CN;
  }
  .engConstract_content {
    position: absolute;
    left: 16px;
    top: 52px;
    right: 16px;
    bottom: 11px;
  }
  .mainContain_left1 {
    top: 110px;
    left: 20px;
    color: #fff;
    background: url("../../../assets/dp/Yxpj/psjg.png") no-repeat;
    background-size: 100% 100%;
  }
  .mainContain_left2 {
    top: 110px;
    left: 400px;
    color: #fff;
    background: url("../../../assets/dp/Yxpj/gcjs.png") no-repeat;
    background-size: 100% 100%;
  }
  .mainContain_left3 {
    top: 110px;
    left: 780px;
    color: #fff;
    background: url("../../../assets/dp/Yxpj/shj.png") no-repeat;
    background-size: 100% 100%;
  }
  .mainContain_left4 {
    top:110px;
    left: 1160px;
    color: #fff;
    background: url("../../../assets/dp/Yxpj/jtys.png") no-repeat;
    background-size: 100% 100%;
  }
  .mainContain_left5 {
    top:110px;
    left: 1540px;
    color: #fff;
    background: url("../../../assets/dp/Yxpj/wygl.png") no-repeat;
    background-size: 100% 100%;
  }
}
</style>

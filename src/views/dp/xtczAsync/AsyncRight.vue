<template>
  <div class="CC">
    <div class="psright  mainContain_right1">
      <!-- <div class="engConstract_title">排水监管</div>
      <div class="engConstract_content">
        <water-environment @on-row="getRow"></water-environment>
      </div> -->
    </div>
    <div class="shjright mainContain_right2">
      <!-- <div class="engConstract_title same">水环境</div>
      <div class="engConstract_content">
        <water-manger @on-row="getRow"></water-manger>
      </div> -->
    </div>
    <div class="jtysright mainContain_right3">
      <!-- <div class="engConstract_title same">交通运输</div>
      <div class="engConstract_content">
        <traffic-transform @on-row="getRow"></traffic-transform>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import WaterEnvironment from "./WaterEnvironment.vue";
import TrafficTransform from "./TrafficTransform.vue";
import WaterManger from "./WaterManger.vue";
import { State, Mutation } from "vuex-class";

@Component({
  components: {
    WaterEnvironment,
    WaterManger,
    TrafficTransform,
  },
})
export default class AsyncRight extends Vue {
  @State issues: any;
  itemObj: any = {};
  getRow() {
    this.itemObj = this.issues;
  }
}
</script>
<style lang="scss" scoped>
.CC {
  .psright {
    width: 430px;
    height: 313px;
    background: url("../../../assets/dp/Xtcz/psjg.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    color: #fff;
  }
  .shjright {
    width: 430px;
    height: 313px;
    background: url("../../../assets/dp/Xtcz/shj.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    color: #fff;
  }
  .jtysright {
    width: 430px;
    height: 313px;
    background: url("../../../assets/dp/Xtcz/jtys.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    color: #fff;
  }
  .right {
    width: 430px;
    height: 313px;
    background: url("../../../assets/dp/Xtcz/box.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    color: #fff;
  }
  .engConstract_title {
    position: absolute;
    left: 192px;
    top: 10px;
    font-size: 16px;
    font-family: Source Han Sans CN;
  }
  .same {
    left: 185px;
  }

  .engConstract_content {
    position: absolute;
    left: 16px;
    top: 52px;
    right: 16px;
    bottom: 11px;
  }
  .mainContain_right1 {
    top: 101px;
    left: 1459px;
  }
  .mainContain_right2 {
    top: 420px;
    left: 1459px;
  }
  .mainContain_right3 {
    top: 739px;
    left: 1459px;
  }
}
</style>

<template>
  <div class="AA">
    <div class="left  mainContain_left1">
      <div class="engConstract_title">工程建设</div>
      <div class="engConstract_bgc">
        <div class="engConstract_bgc_img">
          <div>
            <span class="img img1"></span>
            <span class="number">100</span>
            <span class="yjzs">预警总数</span>
          </div>
          <div>
            <span class="img img2"></span>
            <span class="number1">100</span>
            <span class="yjzs1">工单总数</span>
          </div>
          <div>
            <span class="img img3"></span>
            <span class="number2">100</span>
            <span class="yjzs2">处理总数</span>
          </div>
        </div>
      </div>
      <div class="engConstract_content">
        <eng-constract v-on="$listeners"></eng-constract>
      </div>
    </div>
    <div class="left mainContain_left2">
      <div class="engConstract_title">排水管理</div>
      <div class="engConstract_bgc">
        <div class="engConstract_bgc_img">
          <div>
            <span class="img img1"></span>
            <span class="number">100</span>
            <span class="yjzs">预警总数</span>
          </div>
          <div>
            <span class="img img2"></span>
            <span class="number1">100</span>
            <span class="yjzs1">工单总数</span>
          </div>
          <div>
            <span class="img img3"></span>
            <span class="number2">100</span>
            <span class="yjzs2">处理总数</span>
          </div>
        </div>
      </div>
      <div class="engConstract_content">
        <water-manger v-on="$listeners"></water-manger>
      </div>
    </div>
    <div class="left mainContain_left3">
      <div class="engConstract_title">城市管理</div>
      <div class="engConstract_bgc">
        <div class="engConstract_bgc_img">
          <div>
            <span class="img img1"></span>
            <span class="number">100</span>
            <span class="yjzs">预警总数</span>
          </div>
          <div>
            <span class="img img2"></span>
            <span class="number1">100</span>
            <span class="yjzs1">工单总数</span>
          </div>
          <div>
            <span class="img img3"></span>
            <span class="number2">100</span>
            <span class="yjzs2">处理总数</span>
          </div>
        </div>
      </div>
      <div class="engConstract_content">
        <city-manger v-on="$listeners"></city-manger>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import EngConstract from "./EngConstract.vue";
import WaterManger from "./WaterManger.vue";
import CityManger from "./CityManger.vue";
import { State, Mutation, namespace } from "vuex-class";
const dpStore = namespace("dpStore");
@Component({
  components: {
    EngConstract,
    WaterManger,
    CityManger,
  },
})
export default class AsyncLeft extends Vue {
  @dpStore.State modalData: any;
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
.AA {
  .left {
    width: 430px;
    height: 313px;
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
  .engConstract_bgc {
    background: url("../../../assets/dp/AsyncMonitore/head_bgc.png") no-repeat;
    background-size: 100% 100%;
    width: 394px;
    height: 55px;
    position: relative;
    left: 19px;
    right: 17px;
    top: 52px;
    .engConstract_bgc_img {
      .img {
        width: 55px;
        height: 55px;
        display: inline-block;
        position: absolute;
      }
      .img1 {
        background: url("../../../assets/dp/AsyncMonitore/预警总数.png") no-repeat;
        background-size: 100% 100%;
        left: 10px;
      }
      .img2 {
        background: url("../../../assets/dp/AsyncMonitore/工单总数.png") no-repeat;
        background-size: 100% 100%;
        left: 142px;
      }
      .img3 {
        background: url("../../../assets/dp/AsyncMonitore/处理总数.png") no-repeat;
        background-size: 100% 100%;
        left: 281px;
      }
      .number {
        position: absolute;
        left: 68px;
        top: 10px;
        width: 24px;
        height: 17px;
        font-size: 18px;
        font-family: Bebas;
        font-weight: 400;
        color: #ffffff;
      }
      .yjzs {
        position: absolute;
        left: 61px;
        top: 31px;
        font-size: 12px;
      }
      .number1 {
        position: absolute;
        left: 200px;
        top: 10px;
        width: 24px;
        height: 17px;
        font-size: 18px;
        font-family: Bebas;
        font-weight: 400;
        color: #ffffff;
      }
      .yjzs1 {
        position: absolute;
        left: 193px;
        top: 31px;
        font-size: 12px;
      }
      .number2 {
        position: absolute;
        left: 338px;
        top: 10px;
        width: 24px;
        height: 17px;
        font-size: 18px;
        font-family: Bebas;
        font-weight: 400;
        color: #ffffff;
      }
      .yjzs2 {
        position: absolute;
        left: 330px;
        top: 31px;
        font-size: 12px;
      }
    }
  }

  .engConstract_content {
    top: 112px;
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 11px;
  }
  .mainContain_left1 {
    top: 101px;
    left: 31px;
    color: #fff;
  }
  .mainContain_left2 {
    top: 420px;
    left: 31px;
    color: #fff;
  }
  .mainContain_left3 {
    top: 739px;
    left: 31px;
    color: #fff;
  }
}
</style>

<template>
  <div class="CC">
    <div class="right  mainContain_right1">
      <div class="engConstract_title">水环境</div>
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
        <water-environment v-on="$listeners"></water-environment>
      </div>
    </div>
    <div class="right mainContain_right2">
      <div class="engConstract_title same">物业管理</div>
      <div class="engConstract_content">
        <property-mange v-on="$listeners"></property-mange>
      </div>
    </div>
    <div class="right mainContain_right3">
      <div class="engConstract_title same">交通运输</div>
      <div class="engConstract_content">
        <traffic-transform v-on="$listeners"></traffic-transform>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import WaterEnvironment from "./WaterEnvironment.vue";
import PropertyMange from "./PropertyMange.vue";
import TrafficTransform from "./TrafficTransform.vue";
import { State, Mutation, namespace } from "vuex-class";
const dpStore = namespace("dpStore");
@Component({
  components: {
    WaterEnvironment,
    PropertyMange,
    TrafficTransform,
  },
})
export default class AsyncRight extends Vue {
  @dpStore.State modalData: any;
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
.CC {
  .right {
    width: 430px;
    height: 313px;
    background: url("../../../assets/dp/AsyncMonitore/box.png") no-repeat;
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
  .same {
    left: 185px;
  }

  .engConstract_content {
    position: absolute;
    left: 16px;
    top: 112px;
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
#{$deep} .ivu-modal-header {
  //注意事项:deep 后面需要空格才能生效
  background-color: #2b5f8f;
}
#{$deep} .suc-modal-content {
  background-color: #e0f7fa40;
}
</style>

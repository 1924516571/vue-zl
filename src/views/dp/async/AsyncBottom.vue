<template>
  <div class="BB">
    <div class="mainContain_bottom">
      <div class="engConstract_title">燃气安全</div>
      <div class="engConstract_bgc">
        <div class="engConstract_bgc_img">
          <div class="first">
            <span class="img img1"></span>
            <span class="number">100</span>
            <span class="yjzs">预警总数</span>
          </div>
          <div class="second">
            <span class="img img2"></span>
            <span class="number1">100</span>
            <span class="yjzs1">工单总数</span>
          </div>
          <div class="third">
            <span class="img img3"></span>
            <span class="number2">100</span>
            <span class="yjzs2">处理总数</span>
          </div>
        </div>
      </div>
      <div class="engConstract_content">
        <gas-safe v-on="$listeners"></gas-safe>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import GasSafe from "./GasSafe.vue";
const dpStore = namespace("dpStore");
@Component({
  components: {
    GasSafe,
  },
})
export default class AsyncBottom extends Vue {
  @dpStore.State modalData: any;
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
.BB {
  .mainContain_bottom {
    width: 930px;
    height: 313px;
    color: #fff;
    // background: url("../../../assets/dp/AsyncMonitore/bottom_box.png") no-repeat;
    background: url("~@/assets/dp/AsyncMonitore/bottom_box.png") no-repeat; //相对路径 前面需要波浪线才能被webPack 打包解析
    background-size: 100% 100%;
    position: absolute;
    top: 739px;
    left: 495px;
    .engConstract_title {
      position: absolute;
      left: 435px;
      top: 10px;
      font-size: 16px;
      font-family: Source Han Sans CN;
    }
    .engConstract_bgc {
      // background: url("../../../assets/dp/AsyncMonitore/head_bgc.png") no-repeat;
      // background-size: 100% 100%;
      // width: 394px;
      // height: 55px;
      position: relative;
      left: 19px;
      right: 17px;
      top: 52px;
      .engConstract_bgc_img {
        .first {
          position: relative;
          left: 210px;
        }
        .second {
          position: relative;
          left: 260px;
        }
        .third {
          position: relative;
          left: 310px;
        }
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
      left: 21px;
      // top: 52px;
      right: 22px;
      bottom: 11px;
      // text-align: center;
    }
  }
}

#{$deep} .ivu-modal-header {
  background-color: #2b5f8fd9;
}
#{$deep} .suc-modal .ivu-modal-body .suc-modal-content {
  background-color: #e0f7fa40;
}
</style>

<template>
  <div class="BB">
    <div class="bottom mainContain_bottom1">
      <div class="engConstract_title">燃气安全</div>
      <div class="engConstract_content">
        <gas-safe @on-row="getRow"></gas-safe>
      </div>
    </div>
    <div class="bottom mainContain_bottom2">
      <!-- <div class="engConstract_title">燃气安全1234456</div>
      <div class="engConstract_content">
        <gas-safe @on-row="getRow"></gas-safe>
      </div> -->

    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import GasSafe from "./GasSafe.vue";
@Component({
  components: {
    GasSafe,
  },
})
export default class AsyncBottom extends Vue {
  @State issues: any;
  itemObj: any = {};
  getRow() {
    console.log(this.issues, "???/");
    this.itemObj = this.issues;
  }
}
</script>
<style lang="scss" scoped>
.BB {
  .bottom{
    width: 930px;
    height: 370px;
    color: #fff;
    // background: url("../../../assets/dp/AsyncMonitore/bottom_box.png") no-repeat;
    background: url("~@/assets/dp/AsyncMonitore/bottom_box.png") no-repeat; //相对路径 前面需要波浪线才能被webPack 打包解析
    background-size: 100% 100%;
    position: absolute;
    // top: 739px;
    // left: 495px;
    .engConstract_title {
      position: absolute;
      left: 432px;
      top: 13px;
      font-size: 17px;
      font-family: Source Han Sans CN;
    }
    .engConstract_content {
      position: absolute;
      left: 21px;
      top: 52px;
      right: 22px;
      bottom: 11px;
    }
  }
  .mainContain_bottom1 {
    top: 690px;
    left: 20px;
  }
  .mainContain_bottom2 {
    top: 690px;
    left: 970px;
    background: url("../../../assets/dp/Yxpj/csgl.png") no-repeat;
    background-size: 100% 100%;
  }
}
</style>

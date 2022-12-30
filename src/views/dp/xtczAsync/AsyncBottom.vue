<template>
  <div class="BB">
    <div class="bottom mainContain_bottom1">
      <div class="engConstract_title">燃气安全</div>
      <div class="engConstract_content">
        <gas-safety @on-row="getRow"></gas-safety>
      </div>
    </div>
    <div class="gcbottom mainContain_bottom2">
      <!-- <div class="engConstract_title">工程建设</div>
      <div class="engConstract_content">
        <city-manger @on-row="getRow"></city-manger>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import GasSafety from "./GasSafety.vue";
import CityManger from "./CityManger.vue";
@Component({
  components: {
    CityManger,
    GasSafety
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
  .gcbottom{
    width: 430px;
    height: 313px;
    background: url("../../../assets/dp/Xtcz/gcjs.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    color: #fff;
  }
  .bottom{
    width: 430px;
    height: 313px;
    background: url("../../../assets/dp/Xtcz/box.png") no-repeat;
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
  .mainContain_bottom1 {
    top: 739px;
    left: 505px;
    color: #fff;
  }
  .mainContain_bottom2 {
    top: 739px;
    left: 980px;
    color: #fff;
  }
  
}
</style>

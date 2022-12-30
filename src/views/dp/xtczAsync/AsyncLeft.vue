<template>
  <div class="AA">
    <div class="left  mainContain_left1">
      <div class="engConstract_title">总览立案</div>
      <div class="engConstract_content">
        <over-view  @on-row="getRow"></over-view>
      </div>
    </div>
    <div class="cgleft mainContain_left2">
      <!-- <div class="engConstract_title">城市管理</div>
      <div class="engConstract_content">
        <city-manger @on-row="getRow"></city-manger>
      </div> -->
    </div>
    <div class="wyleft mainContain_left3">
      <!-- <div class="engConstract_title">物业管理</div>
      <div class="engConstract_content">
         <property-mange @on-row="getRow"></property-mange>
       
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import OverView from "./OverView.vue";
import PropertyMange from "./PropertyMange.vue";
import CityManger from "./CityManger.vue";
import { State, Mutation } from "vuex-class";

@Component({
  components: {
    OverView,
    PropertyMange,
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
  .cgleft {
    width: 430px;
    height: 313px;
    background: url("../../../assets/dp/Xtcz/csgl.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    color: #fff;
  }
  .wyleft {
    width: 430px;
    height: 313px;
    background: url("../../../assets/dp/Xtcz/wygl.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    color: #fff;
  }
  .left {
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

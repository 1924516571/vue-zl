<template>
  <div class="main" :style="{ backgroundImage: `url(${imgUrl})` }">
    <div class="header">
      <div :class="flag == 0 ? 'menu yxjc xz1' : 'menu yxjc'" @click="menuClick(0)">
        运行监测
      </div>
      <div :class="flag == 1 ? 'menu jcfx xz1' : 'menu jcfx '" @click="menuClick(1)">
        监测分析
      </div>
      <div :class="flag == 2 ? 'menu xtcl xz1' : 'menu xtcl'" @click="menuClick(2)">
        协同处置
      </div>
      <div :class="flag == 3 ? 'menu yxpj xz2' : 'menu yxpj'" @click="menuClick(3)">
        运行评价
      </div>
      <div :class="flag == 4 ? 'menu jczc xz2' : 'menu jczc'" @click="menuClick(4)">
        决策支持
      </div>
      <div class='menu zsdd' @click="menuJump()">
        值守调度
      </div>
    </div>
    <operate-monitore v-if="flag == 0"></operate-monitore>
    <async-monitore v-if="flag == 1"></async-monitore>
    <xtcz v-if="flag == 2"></xtcz>
    <yxpj v-if="flag == 3"></yxpj>
    <jczc v-if="flag == 4"></jczc>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import OperateMonitore from "./OperateMonitore.vue";
import AsyncMonitore from "./AsyncMonitore.vue";
import Xtcz from "./Xtcz.vue";
import Yxpj from "./Yxpj.vue";
import jczc from "./jczc.vue";
@Component({
  components: {
    OperateMonitore,
    AsyncMonitore,
    Xtcz,
    Yxpj,
    jczc
  },
})
export default class mainDp extends Vue {
  flag: any = 0;
  imgUrl: any = require("../../assets/dp/OperateMonitoreRq/bg.jpg");
  menuClick(flag: any) {
    this.flag = flag;
    if (this.flag == 0) {
      this.imgUrl = '';
    } else if (this.flag == 1) {
      this.imgUrl = require("../../assets/dp/AsyncMonitore/背景.png");
    } else if (this.flag == 2) {
      this.imgUrl = require("../../assets/dp/Xtcz/背景.jpg");
    } else if (this.flag == 3) {
      this.imgUrl = require("../../assets/dp/Yxpj/背景.png");
    } 
  }
  menuJump(){
      let routerData =  this.$router.resolve({path:'/main/homes'})
      window.open(routerData.href,'_blank');
  }
  mounted() {
      this.menuClick(this.flag)    
   }
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
.main {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: RGBA(3, 12, 22, 1);
  // background: url("../../assets/dp/OperateMonitoreRq/背景.jpg") 100% no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  .header {
    width: 100%;
    height: 84px;
    background: url("../../assets/dp/OperateMonitoreRq/head.png") no-repeat;
    background-size: 100% 100%;
    // position: relative;
    .menu {
      width: 156px;
      height: 38px;
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
      cursor: pointer;
      line-height: 38px;
    }
    .yxjc {
      position: absolute;
      background: url("../../assets/dp/OperateMonitoreRq/leftButtonBgc.png") no-repeat;
      background-size: 100% 100%;
      top: 37px;
      left: 68px;
    }
    .jcfx {
      position: absolute;
      background: url("../../assets/dp/OperateMonitoreRq/leftButtonBgc.png") no-repeat;
      background-size: 100% 100%;
      top: 37px;
      left: 257px;
    }
    .xtcl {
      position: absolute;
      background: url("../../assets/dp/OperateMonitoreRq/leftButtonBgc.png") no-repeat;
      background-size: 100% 100%;
      top: 37px;
      left: 445px;
    }
    .yxpj {
      position: absolute;
      background: url("../../assets/dp/OperateMonitoreRq/rightButtonBgc.png") no-repeat;
      background-size: 100% 100%;
      top: 37px;
      left: 1318px;
    }
    .jczc {
      position: absolute;
      background: url("../../assets/dp/OperateMonitoreRq/rightButtonBgc.png") no-repeat;
      background-size: 100% 100%;
      top: 37px;
      left: 1507px;
    }
    .zsdd {
      position: absolute;
      background: url("../../assets/dp/OperateMonitoreRq/rightButtonBgc.png") no-repeat;
      background-size: 100% 100%;
      top: 37px;
      left: 1696px;
    }
    .xz1 {
      background: url("../../assets/dp/OperateMonitoreRq/leftButtonActiveBgc.png") no-repeat;
      background-size: 100% 100%;
    }
    .xz2 {
      background: url("../../assets/dp/OperateMonitoreRq/rightButtonActiveBgc.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>

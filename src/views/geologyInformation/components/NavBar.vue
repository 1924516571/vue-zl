<template>
  <div class="side-menu-container" @mouseenter="showIcon" @mouseleave="hideIcon">
    <suc-menu :config="option">
      <suc-menu-item name="overView" to="/main/geologyInformation/overView">
        <span class="txt iconfont icon-zonglan"></span>
        <span class="txt"><span>总览</span></span>
      </suc-menu-item>
    </suc-menu>
    <div class="menuSideShrinkage" :class="menuClass" v-show="flag" @click="leftMenuIsShow">
      <i :class="differentIcon" style="font-size:25px"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import { SucIcon, SucMenu, SucMenuItem, SucSubmenu } from "@suc/ui";
import { MenuConfig } from "@suc/ui/interfaces";
const mapStore = namespace("mapStore");
const leftMenu = namespace("leftMenu");
@Component({
  components: {
    SucMenu,
    SucMenuItem,
    SucSubmenu,
    SucIcon,
  },
})
export default class topBar extends Vue {
  @mapStore.Mutation setMarkers: any;
  @mapStore.Mutation setMarkerFlag: any;
  @leftMenu.Mutation leftMenuIsShow1: any;
  @leftMenu.State menushow: any;
  option: MenuConfig = {
    activeName: "",
  };
  menuClass: any = "";
  flag: boolean = false;
  differentIcon: any = "el-icon-s-unfold";
  mounted() {
    this.option.activeName = this.$route.matched[2].meta.name;
  }
  @Watch("$route", { deep: true })
  changeRoute(val: any) {
    this.option.activeName = this.$route.matched[2].meta.name;
    let reg = /overview|pieNetwork|riverLake|flood|personnel/g;
    if (val.path.match(reg)) {
      this.setMarkers([]);
      this.setMarkerFlag("");
    }
  }
  showIcon() {
    this.menuClass = "animation1";
    this.flag = true;
  }
  hideIcon() {
    this.menuClass = "animation2";
    this.flag = false;
  }
  leftMenuIsShow() {
    if (this.menushow == false) {
      this.differentIcon = "el-icon-s-fold";
      this.leftMenuIsShow1(true);
    } else {
       this.differentIcon = "el-icon-s-unfold";
      this.leftMenuIsShow1(false);
   
    }
  }
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";

.side-menu-container {
  float: left;
  width: 60px;
  height: 100%;
  // min-height: 225px;
  // margin: 18px auto 25px auto;
  background-color: #091c37;
  border: solid 1px transparent;
  position: relative;
  cursor: pointer;
  .menuSideShrinkage {
    position: absolute;
    color: #fff;
    left: 15px;
    top: 90px;
    z-index: 1000;
    // background: #3a7bef;
    background: #9ab9f0;
    cursor: pointer;
    // transform: translate(0);
  }
  .txt {
    display: flex;
    justify-content: center;
    width: 100%;
    color: rgba($color: #fff, $alpha: 0.9);
  }
  @keyframes flash1 {
    0% {
      transform: translate(-60px);
      opacity: 0;
    }
    50% {
      transform: translate(-30px);
      opacity: 0.5;
    }
    100% {
      transform: translate(0);
      opacity: 1;
    }
  }
  @keyframes flash2 {
    100% {
      transform: translateX(-200px);
      opacity: 0;
    }
  }
}
.animation1 {
  animation: flash1 0.2s;
}
.animation2 {
  animation: flash2 0.2s;
}
</style>

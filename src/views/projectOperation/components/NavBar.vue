<template>
  <div class="side-menu-container">
    <suc-menu :config="option">
      <!-- v-authox="'dataCenter_info|access'" -->
<!--      <suc-menu-item style="margin-left: 10px" name="infoJg" to="/main/projectOperation/infoJg">-->
<!--        <span class="txt iconfont icon-zonglan"></span>-->
<!--        <span class="txt"><span>监管分析</span></span>-->
<!--      </suc-menu-item>-->
      <suc-submenu name="1">
        <template slot="title">
          <!-- <span class="txt iconfont icon-guanwangjianbao"></span> -->
          <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/projectOperation/基础信息.png" alt="" /> </span>
          <span class="txt">基础信息</span>
        </template>
        <suc-menu-item name="infoDf" to="/main/projectOperation/infoDf">
          <span class="txt">堤防</span>
        </suc-menu-item>
        <suc-menu-item name="infoWei" to="/main/projectOperation/infoWei">
          <span class="txt">圩区</span>
        </suc-menu-item>
        <suc-menu-item name="tangba" to="/main/projectOperation/tangba">
          <span class="txt">塘坝</span>
        </suc-menu-item>
        <suc-menu-item name="infoGuan" to="/main/projectOperation/infoGuan">
          <span class="txt">灌区、灌溉站</span>
        </suc-menu-item>
        <suc-menu-item name="drainageSluiceStation" to="/main/projectOperation/drainageSluiceStation">
          <span class="txt">排涝闸站</span>
        </suc-menu-item>
        <suc-menu-item name="infoRiver" to="/main/projectOperation/infoRiver">
          <span class="txt">河湖名录</span>
        </suc-menu-item>
        <suc-menu-item name="bjc" to="/main/projectOperation/bjc">
          <span class="txt">保洁船</span>
        </suc-menu-item>
      </suc-submenu>
      <suc-submenu name="2">
        <template slot="title">
          <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/projectOperation/涉水.png" alt="" /> </span>
          <span class="txt">涉水监管</span>
        </template>
        <suc-menu-item name="soilRetention" to="/main/projectOperation/soilRetention">
          <span class="txt">水土保持</span>
        </suc-menu-item>
        <suc-menu-item name="river" to="/main/projectOperation/river">
          <span class="txt">涉河监管</span>
        </suc-menu-item>
      </suc-submenu>

      <suc-submenu name="3">
        <template slot="title">
          <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/projectOperation/养护维修.png" alt="" /> </span>
          <span class="txt">工程维护</span>
        </template>
        <suc-menu-item name="engRepair" to="/main/projectOperation/engRepair">
          <span class="txt">维修档案</span>
        </suc-menu-item>
        <suc-menu-item name="engRecord" to="/main/projectOperation/engRecord">
          <span class="txt">工程档案</span>
        </suc-menu-item>
      </suc-submenu>

      <suc-submenu name="4">
        <template slot="title">
          <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/projectOperation/统计.png" alt="" /> </span>
          <span class="txt">简报分析</span>
        </template>
        <suc-menu-item name="runFlow" to="/main/projectOperation/runFlow">
          <span class="txt">运行流量</span>
        </suc-menu-item>
      </suc-submenu>

    </suc-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import { SucIcon, SucMenu, SucMenuItem, SucSubmenu } from "@suc/ui";
import { MenuConfig } from "@suc/ui/interfaces";
import { backUrl } from "../../../../public/config.js";
import SucDropdown from "../../../../node_modules/%40suc/ui/components/suc-dropdown/SucDropdown.vue";
import Menu from "../../../../node_modules/%40suc/ui/components/suc-menu/menu.vue";

// import {backUrl} from ""

//@ts-ignore
// const Submenu = Menu.Sub;

@Component({
  components: {
    SucMenu,
    SucMenuItem,
    SucSubmenu,
    SucIcon,
  },
})
export default class topBar extends Vue {
  // activeNav: string = "";
  option: MenuConfig = {
    activeName: "",
    // theme: "light",
    // openNames: ["0"], //@description 展开的 Submenu 的 name 集合
  };
  backUrl: any = backUrl;
  mounted() {
    this.option.activeName = this.$route.matched[2].meta.name;
  }
  @Watch("$route", { deep: true })
  changeRoute() {
    this.option.activeName = this.$route.matched[2].meta.name;
  }
}
</script>
<style lang="scss" scoped>
.side-menu-container {
  float: left;
  width: 175px;
  height: 100%;
  // min-height: 225px;
  // margin: 18px auto 25px auto;
  background-color: #091c37;
  border: solid 1px transparent;
  overflow: auto;
  .txt {
    color: rgba($color: #fff, $alpha: 0.9);
    &:nth-of-type(2) {
      display: inline-block;
      padding-left: 6px;
    }
  }
}
</style>

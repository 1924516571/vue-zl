<template>
  <div class="side-menu-container">
    <suc-menu :config="option">
    <suc-submenu name="1">
        <template slot="title">
          <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/water/调水方案.png" alt="" /> </span>
          <span class="txt">运行平台</span>
        </template>
        <suc-menu-item name="dlxx" to="/main/homes/dlxx">
          <span class="txt">地理信息</span>
        </suc-menu-item>
        <suc-menu-item name="wgxc" to="/main/homes/wgxc">
          <span class="txt">网格巡查</span>
        </suc-menu-item>
      </suc-submenu>
      <suc-submenu name="2">
        <template slot="title">
          <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/projectOperation/统计.png" alt="" /> </span>
          <span class="txt">值守调度</span>
        </template>
        <suc-menu-item name="yjxx" to="/main/homes/yjxx">
          <span class="txt">预警信息</span>
        </suc-menu-item>
        <suc-menu-item name="rwgd" to="/main/homes/rwgd">
          <span class="txt">任务工单</span>
        </suc-menu-item>
      </suc-submenu>
      <suc-submenu name="3">
        <template slot="title">
          <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/projectOperation/基础信息.png" alt="" /> </span>
          <span class="txt">任务考核</span>
        </template>
        <suc-menu-item name="jhsb" to="/main/homes/jhsb">
          <span class="txt">计划上报</span>
        </suc-menu-item>
        <suc-menu-item name="jhsp" to="/main/homes/jhsp">
          <span class="txt">计划审批</span>
        </suc-menu-item>
        <suc-menu-item name="yhjl" to="/main/homes/yhjl">
          <span class="txt">养护记录</span>
        </suc-menu-item>
        <suc-menu-item name="khcy" to="/main/homes/khcy">
          <span class="txt">考核抽样</span>
        </suc-menu-item>
        <suc-menu-item name="khdf" to="/main/homes/khdf">
          <span class="txt">考核打分</span>
        </suc-menu-item>
        <suc-menu-item name="khfh" to="/main/homes/khfh">
          <span class="txt">考核复核</span>
        </suc-menu-item>
        <suc-menu-item name="khsc" to="/main/homes/khsc">
          <span class="txt">考核筛查</span>
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
     openNames: ["1"], //@description 展开的 Submenu 的 name 集合
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

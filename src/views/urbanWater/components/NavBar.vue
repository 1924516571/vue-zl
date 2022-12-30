<template>
  <div class="side-menu-container">
    <suc-menu :config="option">
      <suc-menu-item name="szjc" style="padding-left:20px" to="/main/urbanWater/szjc">
      <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/water/水质.png" alt=""/></span>
      <span class="txt"><span>水质监测</span></span>
    </suc-menu-item>
     <suc-menu-item name="taskManage" style="padding-left:20px" to="/main/urbanWater/taskManage">
      <span style="vertical-align:sub;"><img style="heigth:18px;width:18px;opacity: 0.9;" src="@/assets/water/任务.png" alt=""/></span>
      <span class="txt"><span>任务管理</span></span>
    </suc-menu-item>
    <suc-menu-item name="dsfa" style="padding-left:20px" to="/main/urbanWater/dsfa">
      <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/water/调水方案.png" alt=""/></span>
      <span class="txt"><span>调水方案</span></span>
    </suc-menu-item>
    <suc-submenu name="2">
    <template slot="title">
      <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/projectOperation/统计.png" alt="" /> </span>
      <span class="txt">统计分析</span>
    </template>
    <suc-menu-item name="szjb" to="/main/urbanWater/szjb">
      <span class="txt">水质简报</span>
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

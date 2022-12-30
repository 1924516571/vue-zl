<template>
  <div class="side-menu-container">
    <suc-menu :config="option">
   · <suc-submenu style="margin-left:-10px" name="1">
        <template slot="title">
          <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/projectOperation/统计.png" alt="" /> </span>
          <span class="txt">重点工程建设</span>
        </template>
        <suc-menu-item name="zdgctb" to="/main/engineeringConstruction/zdgctb">
          <span class="txt">重点工程填报</span>
        </suc-menu-item>
        <suc-menu-item name="xmjsxx" to="/main/engineeringConstruction/xmjsxx">
          <span class="txt">项目建设信息</span>
        </suc-menu-item>
        <suc-menu-item name="xmda" to="/main/engineeringConstruction/xmda">
          <span class="txt">项目档案</span>
        </suc-menu-item>
      </suc-submenu>  
      <suc-menu-item  name="nsgc" to="/main/engineeringConstruction/nsgc">
        <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/water/水质.png" alt=""/></span>
        <span class="txt"><span>农水工程建设</span></span>
      </suc-menu-item>
      <suc-submenu  style="margin-left:-10px" name="3">
        <template slot="title">
          <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/projectOperation/统计.png" alt="" /> </span>
          <span class="txt">农村水利建设</span>
        </template>
        <suc-menu-item name="ndjsrw" to="/main/engineeringConstruction/ndjsrw">
          <span class="txt">年度建设任务</span>
        </suc-menu-item>
        <suc-menu-item name="zdxxm" to="/main/engineeringConstruction/zdxxm">
          <span class="txt">重点县项目</span>
        </suc-menu-item>
        <suc-menu-item name="xxhdzz" to="/main/engineeringConstruction/xxhdzz">
          <span class="txt">县乡河道整治</span>
        </suc-menu-item>
        <suc-menu-item name="sbxm" to="/main/engineeringConstruction/sbxm">
          <span class="txt">市补项目</span>
        </suc-menu-item>
        <suc-menu-item name="qtxnsxm" to="/main/engineeringConstruction/qtxnsxm">
          <span class="txt">其他小农水项目</span>
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

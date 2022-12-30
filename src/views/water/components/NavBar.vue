<template>
  <div class="side-menu-container">
    <suc-menu :config="option">
      <!-- v-authox="'dataCenter_info|access'" -->
      <suc-submenu name="1">
        <template slot="title">
          <!-- <span class="txt iconfont icon-guanwangjianbao"></span> -->
          <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/water/调水方案.png" alt="" /> </span>
          <span class="txt">信息服务</span>
        </template>
        <suc-menu-item name="ysdw" to="/main/water/ysdw">
          <span class="txt">用水单位</span>
        </suc-menu-item>
        <suc-menu-item name="plan" to="/main/water/plan">
          <span class="txt">计划管理</span>
        </suc-menu-item>
        <suc-menu-item name="zt" to="/main/water/zt">
          <span class="txt">载体管理</span>
        </suc-menu-item>
        <suc-menu-item name="jg" to="/main/water/jg">
          <span class="txt">技改项目</span>
        </suc-menu-item>
        <suc-menu-item name="zfsb" to="/main/water/zfsb">
          <span class="txt">执法人员设备</span>
        </suc-menu-item>
      </suc-submenu>
      <suc-menu-item style="margin-left:9px" name="qsjc" to="/main/water/qsjc">
        <!-- <span class="txt iconfont icon-zonglan"></span> -->
        <span style="vertical-align:sub;"><img style="heigth:20px;width:20px" src="@/assets/water/水质.png" alt=""/></span>
        <span class="txt"><span>取水监测</span></span>
      </suc-menu-item>
      <suc-submenu name="2">
        <template slot="title">
          <!-- <span class="txt iconfont icon-guanwangjianbao"></span> -->
          <span style="vertical-align:sub;opacity:0.8"><img style="heigth:18px;width:18px" src="@/assets/water/规费征收.png" alt=""/></span>
          <span class="txt">规费征收</span>
        </template>
        <suc-menu-item name="xkz" to="/main/water/xkz">
          <span class="txt">许可证监督</span>
        </suc-menu-item>
        <suc-menu-item name="mx" to="/main/water/mx">
          <span class="txt">水利规费明细表</span>
        </suc-menu-item>
        <suc-menu-item name="qygf" to="/main/water/qygf">
          <span class="txt">企业规费汇总表</span>
        </suc-menu-item>
      </suc-submenu>
      <suc-submenu name="3">
        <template slot="title">
          <!-- <span class="txt iconfont icon-guanwangjianbao"></span> -->
          <span style="vertical-align:sub;opacity:0.8"><img style="heigth:18px;width:18px" src="@/assets/water/水政执法.png" alt=""/></span>
          <span class="txt">水政执法</span>
        </template>
        <suc-menu-item name="szxc" to="/main/water/szxc">
          <span class="txt">水政巡查</span>
        </suc-menu-item>
        <suc-menu-item name="xcrecord" to="/main/water/xcrecord">
          <span class="txt">巡查记录</span>
        </suc-menu-item>
        <suc-menu-item name="jbjl" to="/main/water/jbjl">
          <span class="txt">举报记录</span>
        </suc-menu-item>
        <suc-menu-item name="lacc" to="/main/water/lacc">
          <span class="txt">立案查处</span>
        </suc-menu-item>
        <suc-menu-item name="rwcl" to="/main/water/rwcl">
          <span class="txt">任务处理</span>
        </suc-menu-item>
        <suc-menu-item name="xcyb" to="/main/water/xcyb">
          <span class="txt">巡查月报</span>
        </suc-menu-item>
      </suc-submenu>
     <suc-submenu name="4">
        <template slot="title">
          <!-- <span class="txt iconfont icon-guanwangjianbao"></span> -->
          <span style="vertical-align:sub;opacity:0.8"><img style="heigth:18px;width:18px" src="@/assets/water/调水方案.png" alt=""/></span>
          <span class="txt">简报分析</span>
        </template>
        <suc-menu-item name="jbfx" to="/main/water/qsfx">
          <span class="txt">取水分析</span>
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

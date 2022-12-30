<template>
  <div class="side-menu-container">
    <suc-menu :config="option" @on-select="handleSelect">
        <suc-menu-item name="fwQuery" to="/main/zwOffice/fwQuery">
            <span class="txt iconfont icon-guanwangjianbao" ></span>
            <span class="txt"><span>发文管理</span></span>
        </suc-menu-item>

        <suc-menu-item name="qsTotal" to="/main/zwOffice/qsTotal">
            <span class="txt iconfont icon-zonglan" ></span>
            <span class="txt"><span>签收统计</span></span>
        </suc-menu-item>

        <suc-menu-item name="shareFile" to="/main/zwOffice/shareFile">
            <span class="txt iconfont icon-WPS" ></span>
            <span class="txt"><span>共享文件</span></span>
        </suc-menu-item>
        <suc-menu-item name="mailList" to="/main/zwOffice/mailList">
            <span class="txt iconfont icon-pianchangguanli-pianchang"></span>
            <span class="txt"><span>通讯录</span></span>
        </suc-menu-item>
        <suc-menu-item name="message" to="/main/zwOffice/message">
            <span class="txt iconfont icon-duanxin3"></span>
            <span class="txt"><span>短信平台</span></span>
        </suc-menu-item>
        
        <suc-menu-item name="mzcp" to="/main/zwOffice/mzcp">
            <span class="txt iconfont">
            <img style="heigth:18px;width:18px;opacity: 0.9;" src="@/assets/water/任务.png" alt=""/>
            </span>
            <span class="txt"><span>民主测评</span></span>
        </suc-menu-item>
        <suc-menu-item name="mzcpgl" to="/main/zwOffice/mzcpgl">
            <span class="txt iconfont icon-guanwangjianbao"></span>
            <span class="txt"><span>民主测评管理</span></span>
        </suc-menu-item>
<!--      <suc-submenu name="fwQuery" to="/main/zwOffice/fwQuery">-->
<!--        <span class="txt">发文管理</span>&ndash;&gt;-->
<!--        <template slot="title">-->
<!--          <span class="txt iconfont icon-guanwangjianbao"></span>-->
<!--          <span class="txt">发文管理</span>-->
<!--        </template>-->
<!--        <suc-menu-item name="fwQuery" to="/main/zwOffice/fwQuery" >-->
<!--          <span class="txt">发文管理</span>-->
<!--        </suc-menu-item>-->
<!--        <suc-menu-item name="qsTotal" to="/main/zwOffice/qsTotal">-->
<!--          <span class="txt">签收统计</span>-->
<!--        </suc-menu-item>-->
<!--         <suc-menu-item name="shareFile" to="/main/zwOffice/shareFile">-->
<!--          <span class="txt">共享文件</span>-->
<!--        </suc-menu-item>-->
<!--      </suc-submenu>-->
<!--      <suc-submenu name="qsTotal" to="/main/zwOffice/qsTotal">-->
<!--        <span class="txt">签收统计</span>-->
<!--      </suc-submenu>-->
<!--      <suc-submenu name="shareFile" to="/main/zwOffice/shareFile">-->
<!--        <span class="txt">发文管理</span>-->
<!--      </suc-submenu>-->
    </suc-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Inject } from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import { SucIcon, SucMenu, SucMenuItem, SucSubmenu } from "@suc/ui";
import { MenuConfig } from "@suc/ui/interfaces";
import bus from "@/eventBus";

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
  };
  mounted() {
    this.option.activeName = this.$route.matched[2].meta.name;
  }
  @Watch("$route", { deep: true })
  changeRoute() {
    this.option.activeName = this.$route.matched[2].meta.name;
  }

  handleSelect(val:any){
    if(val == this.option.activeName){
      bus.$emit('reflashAlive')
    }
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
  .txt {
    color: rgba($color: #fff, $alpha: 0.9);
    &:nth-of-type(2) {
      display: inline-block;
      padding-left: 6px;
    }
  }
}
</style>

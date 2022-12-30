<template>
  <div class="side-menu-container">
    <suc-menu :config="option">
      <suc-submenu name="1">
        <template slot="title">
          <span class="txt iconfont icon-guanwangjianbao"></span>
          <span class="txt">信息服务</span>
        </template>
        <suc-menu-item name="wscl" to="/main/draninageManage/wscl">
          <span class="txt">污水处理厂</span>
        </suc-menu-item>
        <suc-menu-item name="tsbz" to="/main/draninageManage/tsbz">
          <span class="txt">提升泵站</span>
        </suc-menu-item>
        <suc-menu-item name="zcgl" to="/main/draninageManage/zcgl">
          <span class="txt">资产管理</span>
        </suc-menu-item>
        <suc-menu-item name="psgw" to="/main/draninageManage/psgw">
          <span class="txt">排水管网</span>
        </suc-menu-item>
        <suc-menu-item name="psxk" to="/main/draninageManage/psxk">
          <span class="txt">排水许可</span>
        </suc-menu-item>
        <suc-menu-item name="psqy" to="/main/draninageManage/psqy">
          <span class="txt">排水企业</span>
        </suc-menu-item>
        <suc-menu-item name="ryxx" to="/main/draninageManage/ryxx">
          <span class="txt">人员信息</span>
        </suc-menu-item>
       <suc-menu-item name="zdgc" to="/main/draninageManage/zdgc">
          <span class="txt">重点工程</span>
        </suc-menu-item>
         <suc-menu-item name="wsgw" to="/main/draninageManage/wsgw">
          <span class="txt">污水管网工程</span>
        </suc-menu-item>
      </suc-submenu>
      <suc-submenu name="2">
        <template slot="title">
          <span class="txt iconfont icon-guanwangjianbao"></span>
          <span class="txt">简报分析</span>
        </template>
        <suc-menu-item name="gwpc" to="/main/draninageManage/gwpc">
          <span class="txt">管网排查</span>
        </suc-menu-item>
        <suc-menu-item name="gwst" to="/main/draninageManage/gwst">
          <span class="txt">管网疏通</span>
        </suc-menu-item>
        <suc-menu-item name="hdsz" to="/main/draninageManage/hdsz">
          <span class="txt">河道水质</span>
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
    openNames: ["1"],
  };
  mounted() {
    this.option.activeName = this.$route.matched[2].meta.name;
  }
  @Watch("$route", { deep: true })
  changeRoute() {
    this.option.activeName = this.$route.matched[2].meta.name;
  }
  // logout() {
  //     this.$http
  //         .get("/logout")
  //         .then(res => {
  //             this.$router.push("/login");
  //         })
  //         .catch(err => {
  //             console.log(err);
  //         });
  // }
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

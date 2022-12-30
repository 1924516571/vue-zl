<template>
  <div class="side-menu-container">
    <suc-menu :config="option">
      <suc-menu-item
        name="messageManage"
        to="/main/message/messageManage"
      >
        <span class="txt iconfont iconfont icon-renwushijian"></span>
        <span class="txt"><span>消息推送</span></span>
      </suc-menu-item>
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
  width: 0px;
  height: 100%;
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

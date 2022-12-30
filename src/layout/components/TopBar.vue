<template>
  <div class="header_bar">
    <div class="bar-item">
      <span>新吴区智联城市治理综合平台</span>
    </div>
    <!-- <MenuGroup title="安全生产">
          <MenuItem name="2-1">新增和启动</MenuItem>
          <MenuItem name="2-2">活跃分析</MenuItem>
          <MenuItem name="2-3">时段分析</MenuItem>
        </MenuGroup>
        <MenuGroup title="社会管理">
          <MenuItem name="2-4">用户留存</MenuItem>
          <MenuItem name="2-5">流失用户</MenuItem>
        </MenuGroup>
        <MenuGroup title="城市治理">
          <MenuItem name="2-6">小微工程</MenuItem>
          <MenuItem name="2-7">城市排水</MenuItem>
          <MenuItem name="2-8">水利水环境</MenuItem>
          <MenuItem name="2-9">城市管理</MenuItem>
        </MenuGroup> -->
    <!-- <Menu mode="horizontal" theme="light" :active-name="activeNav">
      <MenuItem name="home" to="/main/home">
        <span>首页</span>
      </MenuItem>
      <Submenu name="2">
        <template #title>
          业务板块
        </template>
        
        <div class="ywmk">
          <div class="ywmk_item">
            <div>
              <h3 class="title">安全生产</h3>
              <ul>
                <li>
                  <a href="https://www.baidu.com/">建筑工地</a>
                </li>
                <li>
                  <a href="#">既有建筑</a>
                </li>
                <li>
                  <a href="#">交通客运</a>
                </li>
                <li>
                  <a href="#">燃气安全</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="title">社会管理</h3>
              <ul>
                <li>
                  <a href="#">保障住房</a>
                </li>
                <li>
                  <a href="#">小区物业</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="title">城市治理</h3>
              <ul>
                <li>
                  <a href="#">小微工程</a>
                </li>
                <li>
                  <a href="#">城市排水</a>
                </li>

                <li>
                  <a href="#">城市管理</a>
                </li>
                <li>
                  <a href="#">水环境</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Submenu>
      <MenuItem name="wisdomContact" to="/main/wisdomContact">
        <span>智慧联动</span>
      </MenuItem>
      <MenuItem name="mainDp" to="/dp/mainDp" target='_blank'>
        <span>评价决策</span>
      </MenuItem>
      <MenuItem name="dataBase" to="/main/dataBase">
        <span>数据底座</span>
      </MenuItem>
      <Submenu name="3" class="sub_right">
        <template slot="title">
          <span style="padding-right:5px"><Icon type="md-person"/></span>
          <span>{{ this.username }}</span>
        </template>
        <MenuItem name="3-1">
          <span @click="logout">注销登录</span>
        </MenuItem>
        <MenuItem name="3-2">
          <span @click="changePassword">密码修改</span>
        </MenuItem>
      </Submenu>
    </Menu> -->
    <Modal v-model="model" title="修改密码" @on-ok="saved('formCustom')" @on-cancel="model = false">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom">
        <FormItem prop="passwd" label="新密码：">
          <Input type="password" v-model="formCustom.passwd" placeholder="请输入新密码" />
        </FormItem>
        <FormItem prop="passwdCheck" label="密码确认：">
          <Input type="password" v-model="formCustom.passwdCheck" placeholder="请再次输入新密码" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import { Menu, MenuItem, Icon, Modal, Form, FormItem, Input, MenuGroup } from "iview";
import axios from "axios";
import { publicApi } from "@/api";
const mapStore = namespace("mapStore");
//@ts-ignore
const Submenu = Menu.Sub;
@Component({
  components: {
    Menu,
    MenuItem,
    Submenu,
    Icon,
    Modal,
    Form,
    FormItem,
    Input,
    MenuGroup,
  },
})
export default class topBar extends Vue {
  @State user: any;
  @mapStore.Mutation setMarkers: any;
  @mapStore.Mutation setMarkerFlag: any;
  // @Watch("$route", { deep: true })
  // changeRoute(val: any) {
  //   let reg = /home|aPicture|accessment|pieNetwork|environment|flood|film|statistic|dataCenter|management|system/g;
  //   if (val.path.match(reg)) {
  //     this.setMarkers([]);
  //     this.setMarkerFlag("");
  //   }
  // }

  activeNav: string = "";
  model: boolean = false; //弹框默认的是关闭的
  formCustom: any = {
    password: null,
    passwd: null,
    passwdCheck: null,
  };

  validatePass: any = (rule: any, value: string, callback: any) => {
    if (value === "") {
      callback(new Error("请输入密码"));
    } else {
      if (this.formCustom.passwdCheck !== "") {
        // 对第二个密码框单独验证
        let form: any = this.$refs.formCustom;
        form.validateField("passwdCheck");
      }
      callback();
    }
  };
  validatePassCheck: any = (rule: any, value: string, callback: any) => {
    if (value === "") {
      callback(new Error("请再次输入新密码"));
    } else if (value !== this.formCustom.passwd) {
      callback(new Error("两次新密码输入不匹配!"));
    } else {
      callback();
    }
  };
  ruleCustom: any = {
    password: [{ required: true, message: "请输入密码" }],
    passwd: [{ required: true, validator: this.validatePass, trigger: "change" }],
    passwdCheck: [{ required: true, validator: this.validatePassCheck, trigger: "change" }],
  };

  username: any = "";
  token: any = "";
  mounted() {
    this.username = localStorage.getItem("reporter");
    this.activeNav = this.$route.matched[1].meta.name;
  }

  async chuan() {
    // let url='wjAuthServer/authentication/user/infoByToken'
    // let data = await publicApi.getNoParam(url);
    // console.log('tt',data.data.hzzToken)
    // console.log('jsontt',JSON.parse(window.localStorage.getItem("userInfo") || "0").hzzToken)
    this.token = JSON.parse(window.localStorage.getItem("userInfo") || "0").hzzToken;
    window.open(
      // "http://172.18.64.76:8089/hzz/zyportal5/html/login.html?token="+this.token,
      // "http://192.168.1.164:8014/hzz/zyportal5/html/login.html?token="+this.token,
      "http://172.18.64.76:8089/hzz/zyportal5/html/login.html?token=" + this.token,
      "_blank"
    );
  }

  // 退出登录
  logout() {
    let that = this;
    that.$http
      .get("wjAuthServer/authentication/logout")
      .then((res) => {
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("userId");
        localStorage.removeItem("roleName");
        localStorage.removeItem("departmentId");
        localStorage.removeItem("departmentName");
        localStorage.removeItem("reporter");
        localStorage.removeItem("areaCode");
        localStorage.removeItem("userInfo");
        that.$http.defaults.headers["refresh-token"] = undefined;
        axios.defaults.headers["Authorization"] = undefined;
        that.$router.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // 修改密码
  changePassword() {
    this.model = true;
  }
  saved(name: string) {
    let ref: any = this.$refs[name];
    ref.validate((valid: any) => {
      if (valid) {
        let url = "wjBaseServer/system/user/updateUserPassword";
        let params: any = {
          // old: this.formCustom.password,
          password: this.formCustom.passwd,
        };
        axios.put(url, null, { params }).then((res: any) => {
          if (res.data.result) {
            this.$Message.success("密码修改成功!");
            this.$router.push("/login");
          }
        });
      } else {
        this.$Message.error("修改失败!");
      }
    });
  }
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
*{
  color:#fff
}
.header_bar {
  min-width: 900px;
  font-size: 12px;
  width: 100%;
  background-color: #02A7F0;
  > ul {
    padding-right: 24% !important;
  }
  .ivu-menu-horizontal .ivu-menu-item,
  .ivu-menu-horizontal .ivu-menu-submenu {
    padding: 0 70px;
    font-size: 16px;
  }
  .ivu-menu-item-active {
    background-color: #fff !important;
  }
  .sub_right {
    position: absolute;
    right: 0;
    padding: 0 20px !important;
  }
  .bar-item {
    float: left;
    padding-left: 15px;
    line-height: 50px;
    width: 390px;
    height: 100%;
    font-size: 22px;
    color: #000;
  }
  .ywmk {
    width: 1920px;
    height: 430px;
    padding-top: 3%;
    .ywmk_item {
      width: 70%;
      height: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      text-align: center;
      > div {
        width: 20%;
        .title {
          color: #333;
        }
        ul {
          list-style-type: none;
          a {
            color: #333;
          }
          a:hover {
            color: #009eff;
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>

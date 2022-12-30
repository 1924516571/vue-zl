import Vue from "vue";
import Router from "vue-router";

import messageRouters from "./router-config/message";
import homeRouters from "./router-config/home";
import dataCenterRouters from "./router-config/dataCenter";
import waterRouters from "./router-config/water";
import floodMessageRouters from "./router-config/floodMessage";
import geologyInformationRouters from "./router-config/geologyInformation";
import videoRouters from "./router-config/video";
import zwOfficeRouters from "./router-config/zwOffice";
import draninageManageRouters from "./router-config/draninageManage";
import projectOperationRouters from "./router-config/projectOperation";
import urbanWaterRouters from "./router-config/urbanWater";
import engineeringConstructionRouters from "./router-config/engineeringConstruction";
import waterSupplyRouters from "./router-config/waterSupply";
import hzzRouters from "./router-config/hzz";
import homesRouters from "./router-config/homes";

import { component } from "vue/types/umd";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "",
      redirect: "/login",
    },
    {
      path: "/login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/dp/mainDp",
      component: () => import("./views/dp/MainDp.vue"),
    },
    {
       path:"/test",
       component:()=> import("./views/test/Test.vue"),
    },
    {
      path: "/register",
      component: () => import("./views/Register.vue"),
    },
    // {
    //   path: "/homes",
    //   component: () => import("./views/homes/Main.vue"),
    // },
    {
      //懒加载
      path: "/main",
      component: () => import("./layout/Main.vue"),
      children: [
        {
          path: "",
          redirect: "home",
        },
        {
          //消息推送
          path: "message",
          meta: {
            name: "message",
          },
          component: () => import("@/views/message/Main.vue"),
          children: [...messageRouters.routers],
        },
        {
          //首页
          path: "home",
          meta: {
            name: "home",
          },
          component: () => import("@/views/home/Main.vue"),
          children: [...homeRouters.routers],
        },
        {
          //数据中心
          path: "dataCenter",
          meta: {
            name: "dataCenter",
          },
          component: () => import("@/views/dataCenter/Main.vue"),
          children: [...dataCenterRouters.routers],
        },
        {
          //政务办公
          path: "zwOffice",
          meta: {
            name: "zwOffice",
          },
          component: () => import("@/views/zwOffice/Main.vue"),
          children: [...zwOfficeRouters.routers],
        },
        {
          //排水监管
          path: "draninageManage",
          meta: {
            name: "draninageManage",
          },
          component: () => import("@/views/draninageManage/Main.vue"),
          children: [...draninageManageRouters.routers],
        },
        {
          //视频监控
          path: "video",
          meta: {
            name: "video",
          },
          component: () => import("@/views/video/Main.vue"),
          children: [...videoRouters.routers],
        },
        {
          //防汛决策
          path: "floodMessage",
          meta: {
            name: "floodMessage",
          },
          component: () => import("@/views/floodMessage/Main.vue"),
          children: [...floodMessageRouters.routers],
        },
        {
          //水政水资源
          path: "water",
          meta: {
            name: "water",
          },
          component: () => import("@/views/water/Main.vue"),
          children: [...waterRouters.routers],
        },
        {
          //地理信息
          path: "geologyInformation",
          meta: {
            name: "geologyInformation",
          },
          component: () => import("@/views/geologyInformation/Main.vue"),
          children: [...geologyInformationRouters.routers],
        },
        {
          //工程运行
          path: "projectOperation",
          meta: {
            name: "projectOperation",
          },
          component: () => import("@/views/projectOperation/Main.vue"),
          children: [...projectOperationRouters.routers],
        },
        {
          //城区水环境
          path: "urbanWater",
          meta: {
            name: "urbanWater",
          },
          component: () => import("@/views/urbanWater/Main.vue"),
          children: [...urbanWaterRouters.routers],
        },
        {
          //工程建设
          path: "engineeringConstruction",
          meta: {
            name: "engineeringConstruction",
          },
          component: () => import("@/views/engineeringConstruction/Main.vue"),
          children: [...engineeringConstructionRouters.routers],
        },
        {
          //供水
          path: "waterSupply",
          meta: {
            name: "waterSupply",
          },
          component: () => import("@/views/waterSupply/Main.vue"),
          children: [...waterSupplyRouters.routers],
        },
        {
          //河长制
          path: "hzz",
          meta: {
            name: "hzz",
          },
          component: () => import("@/views/hzz/Main.vue"),
          children: [...hzzRouters.routers],
        },
        {
          //负主页
          path: "homes",
          meta: {
            name: "homes",
          },
          component: () => import("@/views/homes/Main.vue"),
          children: [...homesRouters.routers],
        },
      ],
    },
  ],
});

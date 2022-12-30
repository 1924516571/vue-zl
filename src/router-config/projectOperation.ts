export default {
  routers: [
    {
      path: "",
      redirect: "infoDf",
    },
    // {
    //   path: "infoJg",
    //   meta: {
    //     name: "infoJg",
    //   },
    //   component: () => import("@/views/projectOperation/pages/infoJg/Jg.vue"),
    // },
    {
      path: "infoDf",
      meta: {
        name: "infoDf",
      },
      component: () => import("@/views/dataCenter/pages/engineering/infoDf.vue"),
    },
    {
      path: "infoWei",
      meta: {
        name: "infoWei",
      },
      component: () => import("@/views/dataCenter/pages/basicData/infoWei.vue"),
    },
    {
      path: "tangba",
      meta: {
        name: "tangba",
      },
      component: () => import("@/views/dataCenter/pages/engineering/tangba.vue"),
    },
    {
      path: "infoGuan",
      meta: {
        name: "infoGuan",
      },
      component: () => import("@/views/dataCenter/pages/basicData/infoGuan.vue"),
    },
    {
      path: "drainageSluiceStation",
      meta: {
        name: "drainageSluiceStation",
      },
      component: () => import("@/views/dataCenter/pages/engineering/drainageSluiceStation.vue"),
    },
    {
      path: "infoRiver",
      meta: {
        name: "infoRiver",
      },
      component: () => import("@/views/dataCenter/pages/basicData/infoRiver.vue"),
    },
    {
      path: "river",
      meta: {
        name: "river",
      },
      component: () => import("@/views/projectOperation/pages/waterRelatedSupervision/river.vue"),
    },
    {
      path: "soilRetention",
      meta: {
        name: "soilRetention",
      },
      component: () => import("@/views/projectOperation/pages/waterRelatedSupervision/soilRetention.vue"),
    },
    // 维修档案
    {
      path: "engRepair",
      meta: {
        name: "engRepair",
      },
      component: () => import("@/views/projectOperation/pages/engService/engRepair.vue"),
    },
    // 工程档案
    {
      path: "engRecord",
      meta: {
        name: "engRecord",
      },
      component: () => import("@/views/projectOperation/pages/engService/engRecord.vue"),
    },
    // 运行流量
    {
      path:'runFlow',
      meta:{
        name: "runFlow",
      },
      component: () => import("@/views/projectOperation/pages/engService/runFlow.vue"),
    },
    // 保洁船
    {
      path:'bjc',
      meta:{
        name: "bjc",
      },
      component: () => import("@/views/projectOperation/pages/briefing/bjc.vue"),
    },
  ],
};

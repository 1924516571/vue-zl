const BASE_PATH = "views/zwOffice/pages";

export default {
    routers: [
      {
        path: "",
        redirect: "fwQuery",
      },
      {
        path: "fwQuery", //发文管理
        meta: {
          name: "fwQuery",
        },
        component: () => import(`@/${BASE_PATH}/fwQuery.vue`),
      },
      {
        path: "shareFile", //共享文件
        meta: {
          name: "shareFile",
        },
        component: () => import(`@/${BASE_PATH}/shareFile.vue`),
      },
      {
        path: "qsTotal", //签收统计
        meta: {
          name: "qsTotal",
        },
        component: () => import(`@/${BASE_PATH}/qsTotal.vue`),
      },
      {
        path: "mailList", //签收统计
        meta: {
          name: "mailList",
        },
        component: () => import(`@/${BASE_PATH}/mailList.vue`),
      },
      {
        path: "message", //短信
        meta: {
          name: "message",
        },
        component: () => import(`@/${BASE_PATH}/message.vue`),
      },
      {
        path: "mzcp", //民主测评
        meta: {
          name: "mzcp",
        },
        component: () => import(`@/${BASE_PATH}/mzcp.vue`),
      },
      {
        path: "mzcpgl", //民主测评管理
        meta: {
          name: "mzcpgl",
        },
        component: () => import(`@/${BASE_PATH}/mzcpgl.vue`),
      },
    ],
  };
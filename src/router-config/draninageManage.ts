const BASE_PATH = "views/draninageManage/pages";

export default {
    routers: [
      {
        path: "",
        redirect: "wscl",
      },
      {
        path: "wscl", //污水处理厂
        meta: {
          name: "wscl",
        },
        component: () => import(`@/${BASE_PATH}/wscl.vue`),
      },
      {
        path: "tsbz", //提升泵站
        meta: {
          name: "tsbz",
        },
        component: () => import(`@/${BASE_PATH}/tsbz.vue`),
      },
      {
        path: "zcgl", //资产管理
        meta: {
          name: "zcgl",
        },
        component: () => import(`@/${BASE_PATH}/zcgl.vue`),
      },
      {
        path: "gwpc", //官网排查
        meta: {
          name: "gwpc",
        },
        component: () => import(`@/${BASE_PATH}/gwpc.vue`),
      },
{
        path: "gwst", //管网疏通
        meta: {
          name: "gwst",
        },
        component: () => import(`@/${BASE_PATH}/gwst.vue`),
      },
      {
        path: "hdsz", //河道水质
        meta: {
          name: "hdsz",
        },
        component: () => import(`@/${BASE_PATH}/hdsz.vue`),
      },{
        path: "psgw", //排水管网
        meta: {
          name: "psgw",
        },
        component: () => import(`@/${BASE_PATH}/psgw.vue`),
      },
      {
        path: "psxk", //排水许可
        meta: {
          name: "psxk",
        },
        component: () => import(`@/${BASE_PATH}/psxk.vue`),
      },    
      {
        path: "psqy", //排水企业
        meta: {
          name: "psqy",
        },
        component: () => import(`@/${BASE_PATH}/psqy.vue`),
      },   
      {
        path: "ryxx", //人员信息
        meta: {
          name: "ryxx",
        },
        component: () => import(`@/${BASE_PATH}/ryxx.vue`),
      },    
      {
        path: "zdgc", //重点工程
        meta: {
          name: "zdgc",
        },
        component: () => import(`@/${BASE_PATH}/zdgc.vue`),
      },  
      {
        path: "wsgw", //污水管网工程
        meta: {
          name: "wsgw",
        },
        component: () => import(`@/${BASE_PATH}/wsgw.vue`),
      },    
    ],
  };
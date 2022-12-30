const BASE_PATH = "views/video/pages";
export default {
  routers: [
    {
      path: "",
      redirect: "viedoManage",
    },
    {
      path: "viedoManage", //视频监控
      meta: {
        name: "viedoManage",
      },
      component: () => import(`@/${BASE_PATH}/VideoManage.vue`),
    },
  ],
};

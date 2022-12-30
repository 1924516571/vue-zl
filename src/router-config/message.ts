const BASE_PATH = "views/message/pages";
export default {
  routers: [
    {
      path: "",
      redirect: "messageManage",
    },
    {
      path: "messageManage", //消息推送
      meta: {
        name: "messageManage",
      },
      component: () => import(`@/${BASE_PATH}/MessageManage.vue`),
    },
  ],
};

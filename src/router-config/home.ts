export default {
  routers: [
    {
      path: "",
      redirect: "overview",
    },
    {
      path: "overview",
      meta: {
        name: "overview",
      },
      component: () => import("@/views/home/pages/Overview.vue"),
    },
    {
      path: "compareDecison",
      meta: {
        name: "compareDecison",
        component: () => {
          import("@/views/home/pages/CompareDecison.vue");
        },
      },
    },
  ],
};

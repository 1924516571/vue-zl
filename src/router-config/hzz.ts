
export default {
    routers: [
      {
        path: '',
        redirect: 'hzz'
      },
      {
        path: "hzz",
        meta: {
          name: "overView",
        },
        component: () => import("@/views/geologyInformation/pages/overView.vue"),
      },
    ]
  }
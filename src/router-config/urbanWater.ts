export default {
    routers: [
      {
        path: '',
        redirect: 'szjc'
      },
      {
        path: 'szjc',
        meta: {
          name: 'szjc'
        },
        component: () => import('@/views/urbanWater/pages/szjc.vue')
      },
      {
         path:'taskManage',
         meta:{
              name:"taskManage"
         }, 
         component:()=>import("@/views/urbanWater/pages/taskManage.vue")
      },
      {
        path: 'szjb',
        meta: {
          name: 'szjb'
        },
        component: () => import('@/views/urbanWater/pages/szjb.vue')
      },
      {
        path: 'dsfa',
        meta: {
          name: 'dsfa'
        },
        component: () => import('@/views/urbanWater/pages/dsfa.vue')
      },
    ]
  }
  
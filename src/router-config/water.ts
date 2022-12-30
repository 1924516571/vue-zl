export default {
    routers: [
      {
        path: '',
        redirect: 'ysdw'
      },
      {
        path: 'qygf',
        meta: {
          name: 'qygf'
        },
        component: () => import('@/views/water/pages/gfzs/qygf.vue')
      },
      {
        path: 'ysdw',
        meta: {
          name: 'ysdw'
        },
        component: () => import('@/views/water/pages/xxfw/ysdw.vue')
      },
      {
        path: 'plan',
        meta: {
          name: 'plan'
        },
        component: () => import('@/views/water/pages/xxfw/plan.vue')
      },
      {
        path: 'zt',
        meta: {
          name: 'zt'
        }, 
        component: () => import('@/views/water/pages/xxfw/zt.vue')
      },
      {
        path: 'jg',
        meta: {
          name: 'jg'
        },
        component: () => import('@/views/water/pages/xxfw/jg.vue')
      },
      {
        path: 'zfsb',
        meta: {
          name: 'zfsb'
        },
        component: () => import('@/views/water/pages/xxfw/zfsb.vue')
      },
      // 取水监测模块
      {
        path:"qsjc",
        meta:{
          name:"qsjc"
        },
        component:()=>import("@/views/water/pages/qsjc/Qsjc.vue")
      },
      {
        path: 'xkz',
        meta: {
          name: 'xkz'
        },
        component: () => import('@/views/water/pages/gfzs/xkz.vue')
      },
      {
        path: 'mx',
        meta: {
          name: 'mx'
        },
        component: () => import('@/views/water/pages/gfzs/mx.vue')
      },
      // 水政巡查
      {
        path: 'szxc',
        meta: {
          name: 'szxc'
        },
        component: () => import('@/views/water/pages/szzf/Szxc.vue')
      },
      // 巡查记录
      {
        path: 'xcrecord',
        meta: {
          name: 'xcrecord'
        },
        component: () => import('@/views/water/pages/szzf/XcRecord.vue')
      },
      // 取水分析
      {
        path: 'qsfx',
        meta: {
          name: 'qsfx'
        },
        component: () => import('@/views/water/pages/jbfx/Qsfx.vue')
      },
      // 举报记录
      {
        path: 'jbjl',
        meta: {
          name: 'jbjl'
        },
        component: () => import('@/views/water/pages/szzf/jbjl.vue')
      },
       // 立案查处
       {
        path: 'lacc',
        meta: {
          name: 'lacc'
        },
        component: () => import('@/views/water/pages/szzf/lacc.vue')
      },
       // 任务处理
       {
        path: 'rwcl',
        meta: {
          name: 'rwcl'
        },
        component: () => import('@/views/water/pages/szzf/rwcl.vue')
      },
       // 巡查月报
       {
        path: 'xcyb',
        meta: {
          name: 'xcyb'
        },
        component: () => import('@/views/water/pages/szzf/xcyb.vue')
      },
    ]
  }
  
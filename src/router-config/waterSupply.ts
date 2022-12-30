export default {
    routers: [
      {
        path: '',
        redirect: 'ysdw'
      },
      {
        path: 'ysdw',
        meta: {
          name: 'ysdw'
        },
        component: () => import('@/views/waterSupply/pages/ysdw.vue')
      },
      {
        path: 'gsgw',
        meta: {
          name: 'gsgw'
        },
        component: () => import('@/views/waterSupply/pages/gsgw.vue')
      },
      {
        path: 'gsfx',
        meta: {
          name: 'gsfx'
        },
        component: () => import('@/views/waterSupply/pages/gsfx.vue')
      },
      {
        path: 'gsjc',
        meta: {
          name: 'gsjc'
        },
        component: () => import('@/views/waterSupply/pages/gsjc.vue')
      },
      {
        path: 'jhqd',
        meta: {
          name: 'jhqd'
        },
        component: () => import('@/views/waterSupply/pages/jhqd.vue')
      },
      {
        path: 'yhjl',
        meta: {
          name: 'yhjl'
        },
        component: () => import('@/views/waterSupply/pages/yhjl.vue')
      },
      {
        path: 'rwgl',
        meta: {
          name: 'rwgl'
        },
        component: () => import('@/views/waterSupply/pages/rwgl.vue')
      },
    ]
  }
  
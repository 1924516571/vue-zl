export default {
    routers: [
      {
        path: '',
        redirect: 'zdgctb'
      },
      {
        path: 'zdgctb',
        meta: {
          name: 'zdgctb'
        },
        component: () => import('@/views/engineeringConstruction/pages/zdgctb.vue')
      },
      {
        path: 'xmjsxx',
        meta: {
          name: 'xmjsxx'
        },
        component: () => import('@/views/engineeringConstruction/pages/xmjsxx.vue')
      },
      {
        path: 'xmda',
        meta: {
          name: 'xmda'
        },
        component: () => import('@/views/engineeringConstruction/pages/xmda.vue')
      },
      {
        path: 'nsgc',
        meta: {
          name: 'nsgc'
        },
        component: () => import('@/views/engineeringConstruction/pages/nsgc.vue')
      },
      {
        path: 'ndjsrw',
        meta: {
          name: 'ndjsrw'
        },
        component: () => import('@/views/engineeringConstruction/pages/ndjsrw.vue')
      },
      {
        path: 'zdxxm',
        meta: {
          name: 'zdxxm'
        },
        component: () => import('@/views/engineeringConstruction/pages/zdxxm.vue')
      },
      {
        path: 'xxhdzz',
        meta: {
          name: 'xxhdzz'
        },
        component: () => import('@/views/engineeringConstruction/pages/xxhdzz.vue')
      },
      {
        path: 'sbxm',
        meta: {
          name: 'sbxm'
        },
        component: () => import('@/views/engineeringConstruction/pages/sbxm.vue')
      },
      {
        path: 'qtxnsxm',
        meta: {
          name: 'qtxnsxm'
        },
        component: () => import('@/views/engineeringConstruction/pages/qtxnsxm.vue')
      },
    ]
  }
export default {
  routers: [
    {
      path: '',
      redirect: 'dlxx'
    },
    {
      path: 'dlxx',
      meta: {
        name: 'dlxx'
      },
      component: () => import('@/views/homes/pages/dlxx.vue')
    },
    {
      path: 'wgxc',
      meta: {
        name: 'wgxc'
      },
      component: () => import('@/views/homes/pages/wgxc.vue')
    },
    {
      path: 'yjxx',
      meta: {
        name: 'yjxx'
      },
      component: () => import('@/views/homes/pages/yjxx.vue')
    },
    {
      path: 'rwgd',
      meta: {
        name: 'rwgd'
      },
      component: () => import('@/views/homes/pages/rwgd.vue')
    },
    {
      path: 'jhsb',
      meta: {
        name: 'jhsb'
      },
      component: () => import('@/views/homes/pages/jhsb.vue')
    },
    {
      path: 'jhsp',
      meta: {
        name: 'jhsp'
      },
      component: () => import('@/views/homes/pages/jhsp.vue')
    },
    {
      path: 'yhjl',
      meta: {
        name: 'yhjl'
      },
      component: () => import('@/views/homes/pages/yhjl.vue')
    },
    {
      path: 'khcy',
      meta: {
        name: 'khcy'
      },
      component: () => import('@/views/homes/pages/khcy.vue')
    },
    {
      path: 'khdf',
      meta: {
        name: 'khdf'
      },
      component: () => import('@/views/homes/pages/khdf.vue')
    },
    {
      path: 'khfh',
      meta: {
        name: 'khfh'
      },
      component: () => import('@/views/homes/pages/khfh.vue')
    },
    {
      path: 'khsc',
      meta: {
        name: 'khsc'
      },
      component: () => import('@/views/homes/pages/khsc.vue')
    },
    
  ]
}

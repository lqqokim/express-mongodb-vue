import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// import e404 from './views/e404.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'level0',
      component: () => import('./views/Level0.vue')
    },
    {
      path: '/level1',
      name: 'level1',
      component: () => import('./views/Level1.vue')
    },
    {
      path: '/level2',
      name: 'level2',
      component: () => import('./views/Level2.vue')
    },
    {
      path: '/level3',
      name: 'level3',
      component: () => import('./views/Level3.vue')
    },
    {
      path: '/user',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/User.vue')
    },
    {
      path: '/page',
      name: '페이지',
      component: () => import('./views/Page.vue')
    },
    // {
    //   path: '/header',
    //   name: '헤더',
    //   component: () => import('./views/Header.vue'),
    //   beforeEnter: (to, from, next) => {
    //     if(!localStorage.getItem('token')) return next('block')
    //     next()
    //   }
    // },
    {
      path: '/block',
      name: '차단',
      component: () => import('./views/Block.vue')
    },
    {
      path: '/sign',
      name: 'sign',
      component: () => import('./views/Sign.vue')
    },
    {
      path: '*',
      name: 'e404',
      component: () => import('./views/e404.vue')
    }
  ]
})

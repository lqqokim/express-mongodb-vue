import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import Home from './views/Home.vue'
import store from './store'

// import e404 from './views/e404.vue'

Vue.use(Router)

Vue.prototype.$axios = axios;
// Vue.prototype.$store = store;

const apiRootPath = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api/' : '/api/'
Vue.prototype.$apiRootPath = apiRootPath;
axios.defaults.baseURL = apiRootPath;

// axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

// Add a request interceptor
axios.interceptors.request.use((config) => {
	// console.log(config)
	// Do something before request is sent
	config.headers.Authorization = localStorage.getItem('token');
	return config;
}, function (error) {
	// Do something with request error
	return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use((response) => {
	// console.log(response.data)
	// Do something with response data
	const token = response.data.token;

	if (token) {
		localStorage.setItem('token', token);
		store.commit('getToken');
	}
	return response;
}, function (error) {
	// Do something with response error
	return Promise.reject(error);
});

const pageCheck = (to, from, next) => {
	axios.post('page', { name: to.path })
		.then((result) => {
			// console.log('pageCheck => ', result)
			if (!result.data.success) throw new Error(result.data.msg)
			next()
		})
		.catch((e) => {
			// next(`/block/${e.message}`)
			// next(`/block/${e.message.replace(/\//gi, ' ')}`)
			if(!e.response) store.commit('pop', { msg: e.message, color: 'warning' });
			next(false);
		})
}

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'dashboard',
			component: () => import('./views/dashboard'),
			beforeEnter: pageCheck
		},
		{
			path: '/board/:name',
			name: 'board',
			component: () => import('./views/board'),
			beforeEnter: pageCheck
		},
		{
			path: '/test/level3',
			name: 'level3',
			component: () => import('./views/test/Level3'),
			beforeEnter: pageCheck
		},
		{
			path: '/test/level2',
			name: 'level2',
			component: () => import('./views/test/Level2'),
			beforeEnter: pageCheck
		},
		{
			path: '/test/level1',
			name: 'level1',
			component: () => import('./views/test/Level1'),
			beforeEnter: pageCheck
		},
		{
			path: '/test/level0',
			name: 'level0',
			component: () => import('./views/test/Level0'),
			beforeEnter: pageCheck
		},
		{
			path: '/manage/users',
			name: 'manageUser',
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "about" */ './views/manage/User'),
			beforeEnter: pageCheck

		},
		{
			path: '/manage/page',
			name: 'page',
			component: () => import('./views/manage/Pages'),
			beforeEnter: pageCheck
		},
		{
			path: '/manage/board',
			name: 'manageBoards',
			component: () => import('./views/manage/Boards'),
			beforeEnter: pageCheck
		},
		{
			path: '/manage/site',
			name: 'site',
			component: () => import('./views/manage/Site'),
			beforeEnter: pageCheck
		},
		{
			path: '/sign',
			name: 'sign',
			component: () => import('./views/Sign.vue')
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('./views/Register.vue')
		},
		{
			path: '/block/:msg',
			name: '차단',
			component: () => import('./views/Block.vue')
		},
		{
			path: '*',
			name: 'e404',
			component: () => import('./views/e404.vue')
		}
	]
})

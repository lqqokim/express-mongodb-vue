import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

//prototype 전역변수로 production, development에 따른 path를 설정한다.
Vue.prototype.$apiRootPath = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api/' : '/api/';
Vue.prototype.$gb = 333;

// console.log(process.env.NODE_ENV);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

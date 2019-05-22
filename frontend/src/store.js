import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ''
  },
  mutations: {
    getToken(state) {
      state.token = localStorage.getItem('token')
    },
    deleteToken(state) {
      localStorage.removeItem('token')
      state.token = null
    }
  },
  actions: {

  }
})

import Vue from 'vue'
import vuetify from "./plugins/vuetify"
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import vuex from './store'
import axios from 'axios'
import * as echarts from 'echarts';
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'


import md5 from 'js-md5'

axios.defaults.baseURL = "http://localhost:9000"
axios.defaults.timeout = 10000;
Vue.prototype.$axios = axios;
Vue.prototype.$vuex = vuex;
Vue.prototype.$md5 = md5;
Vue.prototype.$echarts = echarts;
Vue.prototype.$moment = moment;
// axios.defaults.baseURL = "http://192.168.142.128:9000"

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

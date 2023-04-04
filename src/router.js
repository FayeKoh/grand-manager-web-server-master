import { from } from 'core-js/fn/array'
import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Main from './views/Main.vue'
import Home from './views/Home.vue'

import UserList from './components/UserList.vue'
import Info from './components/Info.vue'
import AddParkRecord from './components/AddParkRecord.vue'
import AddPark from './components/AddPark.vue'
import SearchPark from './components/SearchPark'
import SearchParkRecord from './components/SearchParkRecord'
import AreaFlow from './components/AreaFlow'
import TimeAnalysis from './components/TimeAnalysis'
import Forecast from './components/Forecast'
import operateManual from './components/operateManual'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path:"/Main",
    component: Main,
    redirect:"/Home",
    children:[
      {path:"/Home",component: Home},
      {path:"/UserList",component: UserList},
      {path:"/Info",component: Info},
      {path:"/AddParkRecord",component: AddParkRecord},
      {path:"/AddPark",component: AddPark},
      {path:"/SearchPark",component: SearchPark},
      {path:"/SearchParkRecord",component: SearchParkRecord},
      {path:"/AreaFlow",component: AreaFlow},
      {path:"/TimeAnalysis",component: TimeAnalysis},
      {path:"/Forecast",component: Forecast},
      {path:"/operateManual",component: operateManual}
    ]
  }
];

const router = new Router({
  mode: 'hash',
  routes
})

router.beforeEach((to,from,next)=>{
  // to:将要访问的路径
  // from:从哪里访问的路径
  // next:之后要做的任务，是一个函数
  // next()放行，next('/URL')强制跳转的路径。
  if (to.path == '/login') return next();// 访问路径为登录
  // 获取flag
  const flagStr = window.localStorage.getItem("user");// session取值
  if (!flagStr){
    return next('/login');
  }
  next();
})

export default router

import Vue from 'vue'
import VueRouter, { RouteRecord } from 'vue-router'
import Home from '../views/Home.vue'
import EnterName from '../views/EnterName.vue'
import Cookies from 'js-cookie';

Vue.use(VueRouter)

const ENTERNAME_PATH = '/entername';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requireName: true,
    }
  },
  {
    path: ENTERNAME_PATH,
    name: 'Enter Name',
    component: EnterName
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function IsRequireName(route: RouteRecord) : boolean {
  return route.meta.requireName;
}

router.beforeEach((to, from, next) => {
  const username = Cookies.get('username');
  console.log(username);
  if (to.matched.some(IsRequireName) && username == null) {
    alert('Require user name!');
    next(ENTERNAME_PATH); return;
  }
  next();
});

export default router

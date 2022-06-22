import Vue from "vue";
import VueRouter from "vue-router";
import axios from "./api";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import APP from "./components/StudentApp.vue";
import router from "./router/router_student";
import store from "./store";

Vue.use(VueRouter);
Vue.use(ElementUI);

Vue.prototype.axios = axios;

// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err);
// };

const config = {
  el: "#app",
  render: c => c(APP),
  router,
  store
};

new Vue(config);
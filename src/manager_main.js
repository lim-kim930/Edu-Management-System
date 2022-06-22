import Vue from "vue";
import VueRouter from "vue-router";
import axios from "./api";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import APP from "./components/ManagerApp.vue";
import router from "./router/router_manager";

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
  router
};

new Vue(config);
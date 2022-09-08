// 文件已弃用

import Vue from "vue";
import VueRouter from "vue-router";
import axios from "./api";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// 导入组件
// 导入自定义路由模块

// 首页,需要把其余的不相干模块全部注释掉
// import APP from "./components/HomepageApp.vue";
// const router = null;

// import APP from "./components/SignApp.vue";
// import router from "./router/router_sign";

//剪切板组件
import APP from "./components/StudentApp.vue";
import router from "./router/router_student";
import store from "./store";

// import APP from "./components/CompanyApp.vue";
// import router from "./router/router_company";

// import APP from "./components/ManagerApp.vue";
// import router from "./router/router_manager";

// 安装路由
Vue.use(VueRouter);
// element ui
Vue.use(ElementUI);
Vue.prototype.axios = axios;

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const config = {
  el: "#app",
  render: c => c(APP)
};
if (router) config.router = router;
if (store) config.store = store;

new Vue(config);
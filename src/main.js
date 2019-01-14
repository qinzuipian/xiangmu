import Vue from 'vue';
import App from './App';
import router from './router';
import '@/api/axios.config'
// import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../static/css/icon.css';
import "babel-polyfill";
import promise from 'es6-promise';
promise.polyfill();

import moment from 'moment'



import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'
import "../static/css/static.css";
import 'font-awesome/css/font-awesome.css';

Vue.use(ElementUI, { size: 'small' });
// Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
/* router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('token');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        next();
    }
}) */


new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
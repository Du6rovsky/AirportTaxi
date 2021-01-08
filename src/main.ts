import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'
import VueTheMask from "vue-the-mask";

Vue.use(VueTheMask);
Vue.config.productionTip = false

Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  // console.log('Custom vue error handler: ', err, vm.name, info);
};

Vue.config.warnHandler = function (err, vm, info) {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  // console.log('Custom vue warn handler: ', err, vm.name, info);
};

// Prevent vue from spamming the console with "helpful" tips
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

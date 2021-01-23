import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'toastr/build/toastr.min.css'

import Vue from 'vue'
import VueRouter from "vue-router"

import App from "./App"
import Principal from "./components/Principal"
import Formulario from "./components/Formulario"


Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/home", component: Principal },
    { path: "/formulario", name: "formulario", component: Formulario, props:true },
   
  ]
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
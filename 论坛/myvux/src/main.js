// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import vuei18n from 'vue-i18n' 
import { AjaxPlugin } from 'vux'
import vuex from 'vuex'
import bus from './bus'
import router from './router'
Vue.config.productionTip = false
import './assets/jquery.js'

import  { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)
import store from './store'
Vue.use(AjaxPlugin)

FastClick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el:'#app',
  router,
  store,
  render: h => h(App),
  mounted:function(){
    this.$http({
      method: 'GET',
      url: '/server/users/session',
      data: '',
    }).then((data)=>{
      if(data.data.error == 0){
        bus.$emit('islogin',data.data.data._id);
      }else{
        if(this.$route.path!="/login" || "/"){
            this.$router.push("/login");
          }
      }
    })
    //   this.$http({
    //       method:'GET',
    //       url:`/server/article/show`,
    //       data:''
    //   }).then((data)=>{
    //     this.$store.commit({
    //     // type：mutations中,属性名就是type类型
    //         type:'dongtai',
    //         value:data.data.data
    //     })
    // })
  }
})
// 可以通过el属性将vue实例挂载在DOM上
// 也可以通过new Vue().$mount('#app'),手动将实例挂载在DOM上

<template>
  <div>
    <router-view style="margin-bottom:60px;"></router-view>
    <div class="footer">
    <tabbar>
      <tabbar-item :selected="path == '/'" link="/">
       <i slot="icon" class="fa fa-home"></i>
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item :selected="path == '/shop'" link="/shop">
      <i slot="icon" class="fa fa-shopping-bag"></i>
        <span slot="label">书店</span>
      </tabbar-item>
      <tabbar-item :selected="path == '/message'" link="/message">
      <i slot="icon" class="fa fa-bell"></i>
        <span slot="label">通知</span>
      </tabbar-item>
      <tabbar-item :selected="path == '/pay'" link="/pay">
      <i slot="icon" class="fa fa-dollar"></i>
        <span slot="label">付费咨询</span>
      </tabbar-item>
      <tabbar-item :selected="path == '/user'" v-if="isLogin" link="/user">
        <span></span>
        <i slot="icon" class="fa fa-align-justify"></i>
        <span slot="label">更多</span>
      </tabbar-item>
      <tabbar-item :selected="path == '/login'" v-else link="/login">
        <span></span>
        <i slot="icon" class="fa fa-align-justify"></i>
        <span slot="label">未登录</span>
      </tabbar-item>
    </tabbar>
    </div>
  </div>
</template>

<script>
import homeheader from './components/homeheader.vue'
import bus from './bus'
import { Tabbar, TabbarItem } from 'vux'
export default {
  components: {
    Tabbar,
    TabbarItem,
    bus,
    homeheader,
  },
  data () {
    return {
      isLogin:false,
      path:'/'
    }
  },
  mounted:function(){
    let that = this
    this.path= this.$route.path
    bus.$on('islogin', function (item) {
          if(item == '未登录'){
            that.isLogin = false
          }else{
            that.isLogin = true
          }
      })
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: rgb(230,230,230);
}
.footer{
  position:fixed;
  bottom:0;
  width:100%;
  color:#fff;
  z-index:999
}
</style>

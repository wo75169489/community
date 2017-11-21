<template>
  <div>
    <div class="head"> 
        <span style="width:10%" @click="tui"><i class="fa fa-arrow-left"></i></span>
        <span class="title" style="width:85%">付费咨询</span>
    </div>
    <payuser v-if="index == 1" style="margin-top:50px;"></payuser>
    <payhome v-if="index == 0" style="margin-top:50px;"></payhome>
    <div class="foot">
        <tabbar v-model="index">
             <tabbar-item selected link="/pay?home">
                <i slot="icon" class="fa fa-home"></i>
                <span slot="label">首页</span>
             </tabbar-item>
             <tabbar-item link="/pay?user">
                <i slot="icon" class="fa fa-user"></i>
                <span slot="label">我的</span>
             </tabbar-item>
        </tabbar>
    </div>
  </div>
</template>

<script>
import payuser from '../components/payuser.vue'
import payhome from '../components/payhome.vue'
import { Tabbar, TabbarItem } from 'vux'
export default {
  components: {
    Tabbar,
    TabbarItem,
    payuser,
    payhome
  },
  data () {
    return {
      user:[],
      path:'/',
      index:0
    }
  },
  methods:{
      tui:function(){
        this.$router.push('/')
      },
  },
   mounted:function(){
    this.path= this.$route.path
      this.$http({
          method:'GET',
          url:'/server/users/session',
          data:''
      }).then((data)=>{
      if(data.data.error == 0){
        this.user = data.data.data
       }else{
        this.$router.push({path:'/login'})
       }
      }).catch((err)=>{
        console.log(err)
    })
  }
}
</script>

<style scoped>
  .head {
    line-height:30px;
    padding:10px;
    background:#fff;
    overflow:hidden;
    position:fixed;
    width:100%;
    top:0;
    border-bottom:solid 1px rgb(220,220,220);
    z-index:999;
}
 .head span{
    display:inline-block;
    float:left;
  }
   .head .title{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:18px;    
  }
  .foot{
      position:fixed;
      bottom:0;
      height:50px;
      background:#fff;
      width:100%;
      z-index:9999
  }
</style>
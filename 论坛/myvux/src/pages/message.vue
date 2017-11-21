<template>
  <div>
    <tab v-model="du" :line-width="1" custom-bar-width="60px">
      <tab-item badge-label="">未读消息</tab-item>
      <tab-item badge-label="">已读消息</tab-item>
    </tab>
    <messagecheck v-show="du == 0"></messagecheck>
    <messagehas v-show="du == 1"></messagehas>
  </div>
</template>

<script>
import messagecheck from './../components/messagecheck.vue'
import messagehas from './../components/messagehas.vue'
import { Tab, TabItem } from 'vux'
export default {
  components: {
    Tab,
    TabItem,
    messagecheck,
    messagehas
  },
  data () {
    return {
      du:0,
    }
  },
    mounted:function(){
    this.$http({
      method: 'GET',
      url: '/server/users/session',
      data: '',
    }).then((data)=>{
      if(data.data.error == 0){
      }else{
        if(this.$route.path!="/login" || "/"){
            this.$router.push("/login");
          }
      }
    })

  }
}
</script>

<style scoped>

</style>
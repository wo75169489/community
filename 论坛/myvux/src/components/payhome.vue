<template>
  <div>
     <div class="re">
       <p class="re_head">热门答主 <span>全部</span></p>
       <div class="us" v-for="us in reuser" v-if="us._id != user._id">
          <section style="width:20%">
              <img :src="'server/images/'+us.img" alt="">
          </section>
          <section class="wen" style="width:80%">
              <p class="pay">{{us.name}} <button @click="path(us._id)">￥{{us.my_pay_answer_value}}提问</button></p>
              <p style="color:rgb(160,160,160);height:46px;over-flow:hidden;">{{us.my_present}}</p>
              <p style="color:rgb(100,100,100);font-size:10px">已回答了 {{us.my_pay_answer.length}} 个问题</p>
          </section>
       </div>
     </div>
  </div>
</template>
  
<script>

export default {
  components: {
  
  },
  data () {
    return {
      user:[],
      reuser:[]
    }
  },
  methods:{
    path:function(id){
        this.$router.push({path:`/pay/question?id=${id}`})
    }
  },
   mounted:function(){
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
    this.$http({
          method:'GET',
          url:'/server/users/payall',
          data:''        
    }).then((data)=>{
        if(data.data.error == 0){
           this.reuser = data.data.data
        }
    })
  }
}
</script>

<style scoped>
*{
    font-size:14px;
}
 .re{
     background:#fff;
 }
 .re .re_head{
     overflow:hidden;
     padding:10px;
 }
.re .re_head span{
    float:right;
    color:rgb(28,98,189)
}
.re .us .pay{
    overflow:hidden;
}
.re .us .pay button{
  background:#fff;
  border:none;
  font-size:12px;
  padding:2px 6px;
  color:rgb(18,58,198);
  border:solid 1px rgb(18,58,198);
  border-radius:3px;
  float:right;
}
.us{
    padding:15px;
    overflow:hidden;
    box-sizing:border-box;
    border-bottom:solid 1px rgb(190,190,190)
}
.us section{
   float:left
}
.us section img{
    width:50px;
    border-radius:50%;
}
.us section.wen{

}
</style>
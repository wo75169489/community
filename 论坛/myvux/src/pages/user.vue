<template>
  <div class="user">
     <div class="mean">
         <img :src="'server/images/'+ user.img" alt="">
         <section style="display:inline-block;height:50px;float:right;width:80%;">
          <p>{{user.name}}</p>
          <p style="color:#999;font-size:14px;" @click="bianji">查看或编辑个人主页</p>
         </section>
     </div>
     <div class="mine">
        <section>
           <span><i class="fa fa-pencil"></i></span>
           <p style="width:90%">我的创作</p>
        </section>
        <section>
           <span><i class="fa fa-star"></i></span>
           <p style="width:90%">我的收藏</p>
        </section>
        <section>
           <span><i class="fa fa-eye"></i></span>
           <p style="width:90%">我的关注</p>
        </section>
     </div>
     <div class="mine">
        <section @click="path('shopCart',user._id)">
           <span><i class="fa fa-shopping-bag"></i></span>
           <p style="width:90%">选购内容</p>
        </section>
        <section>
           <span><i class="fa fa-flash"></i></span>
           <p style="width:90%">我的Live</p>
        </section>
        <section @click="path('bookj',user._id)">
           <span><i class="fa fa-book"></i></span>
           <p style="width:90%">我的书架</p>
        </section>
        <section>
           <span><i class="fa fa-commenting"></i></span>
           <p style="width:90%">我的付费查询</p>
        </section>
     </div>
     <div class="tlogin">
          <p @click="remove">退 出 登 陆</p>
     </div>
  </div>
</template>

<script>
import bus from '../bus.js'
export default {
  components: {
     bus
  },
  data () {
    return {
      user:{img:'moren.jpg'}
    }
  },
  methods:{
      tuichu:function(){
          bus.$emit('islogin','未登录');
      },
      remove:function(){
         this.$http({
          method:'GET',
          url:'/server/users/remove',
          data:''
         }).then((data)=>{
             if(data.data.error == 0){
                 bus.$emit('islogin','未登录');
                 alert('退出成功')
                 this.$router.push({path:'/login'})
             }
         }).catch((err)=>{
             console.log(err)
         })
      },
      bianji:function(){
          this.$router.push({path:`/userbj?id=${this.user._id}`})
      },
      path:function(a,b){
          this.$router.push({path:`/${a}?id=${b}`})
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
  }
}
</script>

<style scoped>
   .user{
       
   }
   .user >  div{
        margin:5px 0; 
        background:#fff;
        padding:10px;
        overflow:hidden;
   }
    div.mean img{
        width:50px;
        height:50px;
        border-radius:50%
    }
    .mine>section{
        padding:10px;
    }
    .mine>section>p{
        float:right;
        border-bottom:solid 1px rgb(230,230,230);
        line-height:45px;
    }
    .mine>section>span{
       line-height:45px; 
       font-size:20px;
    }
    .tlogin{
        text-align:center;
    }
    .tlogin p{
        color:red;
    }
</style>
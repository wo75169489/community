<template>
  <div>
     <div v-if="tuser">
        <div class="user"> 
           <img :src="'server/images/'+tuser.img" alt="">
           <p>{{tuser.name}}</p>
           <p style="font-size:14px;color:#999">{{tuser.my_present}}</p>
           <p style="font-size:12px;">总收入 {{tuser.my_wallet}} 元</p>
        </div>
        <div class="answer">
            <div class="form" action="">
                   <textarea name="te" id="" cols="38"  placeholder="写出你要提问的问题"></textarea>
                   <button @click="show1 = true">支付￥{{tuser.my_pay_answer_value}}提问</button>
                   <actionsheet v-model="show1" :menus="menus1" :close-on-clicking-mask="false" @on-click-menu-cancel="show1 = false" @on-click-menu-menu1="ti" @on-click-menu-menu2="ti" @on-click-menu-menu3="ti" show-cancel ></actionsheet>
            </div>
        </div>
     </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { Tabbar, TabbarItem,Actionsheet } from 'vux'
export default {
  components: {
  Tabbar, 
  TabbarItem,
  Actionsheet
  },
  data () {
    return {
      show1:false,
      user:'',
      tuser:'',
      menus1: {
        menu1: '支付宝支付',
        menu2: '微信支付',
        menu3: '余额支付',
      }
    }
  },
  methods:{
    ti:function(ev){
        let that = this
        let data1 ={
          content:$('textarea[name=te]')[0].value,
          author:that.user._id,
          Answer_author:that.tuser._id,
          value:that.tuser.my_pay_answer_value
        }
        this.$http({
            method:'POST',
            url:'server/payaq/question',
            data:data1,
        }).then((data)=>{
            console.log(data)
            if(data.data.error == 0){
                alert('付款成功，请等待答主回复')
            }
        })
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
           url:`/server/users/inanswer?id=${this.$route.query.id}`,
           data:''
       }).then((data)=>{
          if(data.data.error == 0){
              this.tuser = data.data.data
          }
       })
    }
}
</script>

<style scoped>
 .user{
     background:#fff;
     padding:10px;
     text-align:center;
     padding-top:30px;
 }
 .user img{
     width:70px;
     border-radius:50%;
 }
 .present{
     position:absolute;
     left:0;
     right:0;
     top:0;
     bottom:0;
     background:#fff;
     z-index:1000
 }
 .p_head span{
    display:inline-block;
    float:left;
  }
 .p_head .title{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:18px;    
  }
  .p_head{
      padding:5px 15px;
      border-bottom:solid 1px rgb(220,220,220);
      overflow:hidden;
  }
  .form{
      padding:20px;
      text-align:center;
  }
  .form textarea{
      padding:5px;
      font-size:14px;
      width:80%;
      min-height:70px;
      max-height:140px;
      border:none;
      border:solid 1px rgba(18,99,220,0.6);
      background:rgb(245,245,245);
      border-radius:3px;
  }
  .form input{
      width:60px;
      padding:3px;
  }
  .form button{
      padding:5px 70px;
      margin-top:35px;
      background:rgb(28,116,188);
      color:#fff;
      border:none;
      border-radius:3px;
  }
  .answer{
      margin-top:10px;
      background:#fff;
  }
  
</style>
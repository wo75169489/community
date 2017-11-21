<template>
  <div>
    <homeheader></homeheader>
    <div class="cuboid" style="background:#fff">
    <p style="margin:20px 0">登陆知乎,体验更多功能</p>
      <ul>
        <li v-for = "item in logintype">
            <img :src="item.img" alt="">
        </li>
      </ul>
      <p style="margin:5px 0;color:#888;font-size:12px" @click="passwordL = true">账号密码登陆</p>
    </div>
    <div class="login-cover" v-show="passwordL">
       <p><span style="font-size:26px" @click="passwordL = false">×</span><span @click="passwordL = false,passwordZ=true" style="float:right;" class="login-phone">注册</span></p>
       <section class="login-form">
          <h3>密码登陆</h3>
          <form action="" @submit.prevent="submitl">
            <input type="text" name="uname" v-model="froml.uname" @input="unamel($event)" placeholder="请输入手机号"><span v-show="!unameL && froml.uname!=''" style="color:red">*</span>
            <div style="height:20px"><span style="font-size:14px;color:red" v-show="!unameL && froml.uname!=''">请输入正确的手机号</span></div>
            <input type="password" name="password" v-model="froml.password" placeholder="请输入密码">
            <button type="submit" :disabled="!unameL || froml.password == ''" >登陆</button>
            <div v-show="iserror1" style="text-align:center;height:30px;color:red;font-size:14px">{{error1}}</div>
          </form>
       </section>
       <section>
          <ul>
             <li v-for = "item in logintype">
                  <img :src="item.img" alt="">
            </li>
         </ul>
       </section>
    </div>
    <div class="zhuce-cover" v-show="passwordZ">
      <p><span style="font-size:26px" @click="passwordZ = false">×</span><span @click="passwordL = true,passwordZ=false" style="float:right;">登陆</span></p>
       <section class="login-form">
          <h3>注册用户</h3>
          <form action="" @submit.prevent="submitz">
            <input type="text"  placeholder="请输入手机号" v-model="fromz.uname" @input="unamez($event)"><span v-show="!unameZ && fromz.uname!=''" style="color:red">*</span>
            <div style="height:20px"><span style="font-size:14px;color:red" v-show="!unameZ && fromz.uname!=''">请输入正确的手机号</span></div>
            <input type="password"  placeholder="请输入密码" v-model="fromz.password" @input="passz($event)"><span v-show="!passZ && fromz.password!=''" style="color:red">*</span>
            <div style="height:20px"><span v-show="!passZ && fromz.password!=''" style="font-size:14px;color:red">密码格式错误(密码开头必须为字母)</span></div>
            <input type="email"  placeholder="请输入邮箱" v-model="fromz.email" @input="emailz($event)"><span v-show="!emailZ && fromz.email!=''" style="color:red">*</span>
            <div style="height:20px"><span v-show="!emailZ && fromz.email!=''" style="font-size:14px;color:red">请输入正确的邮箱地址</span></div>
            <button type="submit"  :disabled="!unameZ || !passZ || !emailZ">注册</button>
          </form>
       </section>
       <section>
          <ul>
             <li v-for = "item in logintype">
                  <img :src="item.img" alt="">
            </li>
         </ul>
         <p>注册用户代表您已阅读 知乎协议</p>
       </section>
       <p v-show="iserror2" style="text-align:center;color:red">{{message}}</p>
    </div>
  </div>
</template>

<script>
import bus from '../bus.js'
import homeheader from './../components/homeheader'
export default {
  components: {
    homeheader,
  },
  data () {
    return {
      passwordL:false,
      fromz:{
        uname:'',
        password:'',
        email:'',
      },
      froml:{
        uname:'',
        password:'',
      },
      unameZ:false,
      unameL:false,
      passZ:false,
      emailZ:false,
      passwordZ:false,
      message:'',
      iserror1:false,
      error1:'',
      iserror2:false,
      logintype:[
        {
          img:'static/images/phone.jpg',
          name:'phone'
        },
        {
          img:'static/images/qq.png'
        },
        {
          img:'static/images/weibo.png'
        },
        {
          img:'static/images/weixin.png'
        },
      ]
    }
  },
  methods:{
    unamez:function(ev){
      var p1 = /^[1][0-9]{10}$/
      this.unameZ = p1.test(ev.target.value)
    },
    unamel:function(ev){
      var p1 = /^[1][0-9]{10}$/
      this.unameL = p1.test(ev.target.value)
    },
    passz:function(ev){
      var p2 = /^[a-zA-Z][a-zA-Z0-9_]{6,11}$/
      this.passZ = p2.test(ev.target.value)
    },
    emailz:function(ev){
      var p3 = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
      this.emailZ = p3.test(ev.target.value)
    },
    submitz:function(){
      var that = this
      if(this.unameZ && this.passZ && this.emailZ){
        this.$http({
          method: 'POST',
          url: '/server/users/regist',
          data: that.fromz,
        }).then((data)=>{
            that.message = data.data.message
            that.iserror2 = true   
            if(data.data.error == 0){             
              setTimeout(function(){ 
                that.iserror2 = false;
                that.passwordL = true;
                that.passwordZ = false;
               }, 3000);
            }else{
               setTimeout(function()
                { 
                that.iserror2 = false
               }, 3000);
            }
        }).catch((err)=>{
          console.log(err)
        })
      }
    },
    submitl:function(){
      var that = this
      if(this.unameL){
        this.$http({
          method:'POST',
          url:'/server/users/login',
          data:that.froml,
        }).then((data)=>{
          if(data.data.error == 0){
           bus.$emit('islogin',data.data.data._id);
           that.passwordL = false
           this.$router.push({path:'/user'})          
          }else{
            that.iserror1 = true
            that.error1 = data.data.message            
            setTimeout(function(){ that.iserror1 = false }, 3000);
          }
        }).catch((err)=>{
          console.log(err)
        })
      }
    }
  }
}
</script>

<style scoped>
*{
  text-align:center
}
img{
  width:40px;
  
}
ul{
  width:200px;
  margin-top:10px;
  padding:0;
  overflow:hidden;
  margin:10px auto;
}
li{
  float:left;
  list-style:none;
  width:50px
}
.cuboid{
  border-top:solid 3px rgb(220,220,220);
  border-bottom:solid 3px rgb(220,220,220)
}
.login-cover,.zhuce-cover{
  position:fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
  z-index:9999;
  background:#fff;
  padding:20px;
}
.login-cover>p,.zhuce-cover>p{
  text-align:left;
  overflow:hidden;
  line-height:30px;
}
form input{
  border:none;
  width:85%;
  border-bottom:solid 1px #555;
  padding:10px 0;
  text-align:left;
  margin-top:20px
}
 form button{
  width:85%;
  border:none;
  background:rgb(46,118,180);
  color:#fff;
  line-height:35px;
  margin-top:20px;
}
form{
  margin:40px
}

</style>
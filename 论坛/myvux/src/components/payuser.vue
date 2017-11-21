<template>
  <div>
     <div v-if="user">
        <div class="user"> 
           <img :src="'server/images/'+user.img" alt="">
           <p>{{user.name}}</p>
           <p style="font-size:14px;color:#999">{{user.my_present}}</p>
           <p style="margin:5px 0;"><button @click="isshow=true" style="font-size:14px;color:(70,70,70);background:rgb(220,220,220);border:none;padding:2px 10px;">提问价格{{user.my_pay_answer_value}}元</button></p>
           <p style="font-size:12px;">总收入 {{user.my_wallet}} 元</p>
        </div>
        <div class="present" v-show="isshow"> 
           <div class="p_head">
              <span style="width:10%" @click="isshow = false"><i class="fa fa-remove"></i></span>
              <span class="title" style="width:85%">设置个人介绍</span>
           </div>
           <div class="form">
                <p style="margin-bottom:30px;">介绍自己，方便别人向你提问</p>
                 <div>
                   <textarea v-model="user.my_present" name="" id="" cols="38"  placeholder="输入你擅长的领域和能够解答的问题,如果：擅长心理疏导,情绪管理,提供心理创伤、家庭关系等问题的咨询"></textarea>
                   <p style="margin:30px 0;color:rgb(100,100,100);font-size:14px;">别人向你提问需要支付<input type="text" v-model="user.my_pay_answer_value">元</p>
                   <button @click="ti">提交</button>
                 </div>
           </div>
        </div>
        <div>
         <tab v-model="index" :line-width="1">
             <tab-item>我的付费问题</tab-item>
             <tab-item>我的回答</tab-item>
             <tab-item>待回复的问题</tab-item>
          </tab>
        </div>
        <div v-if="index == 0">
           <section class="question" v-for="question in questions">
              <p class="question_name"><img :src="'server/images/'+question.author.img" alt=""><span>{{question.author.name}}提出了问题</span> <span class="price">￥{{question.value}}</span></p>
              <p class="quesiton_content">{{question.content}}</p>
              <p v-if="question.isA">{{question.Answer.content}}</p>
              <p class="question_name" v-else><img :src="'server/images/'+question.Answer_author.img" alt=""><span>{{question.Answer_author.name }}待回复</span></p>
           </section>
        </div>
        <div v-if="index == 1">
          <section class="question" v-for="answer in answers">
              
           </section>
        </div>
        <div v-if="index == 2">
          <section class="question" v-for="question in Aquestion">
            <p class="question_name"><img :src="'server/images/'+question.author.img" alt=""><span>{{question.author.name}}提出了问题</span></p>
              <p class="quesiton_content">{{question.content}}</p>
              <p class="hui" @click="answer(question._id)"><button>点击回复</button></p>
           </section>
        </div>
     </div>
  </div>
</template>

<script>
import { Tabbar, TabbarItem,Tab,TabItem} from 'vux'
export default {
  components: {
  Tabbar, 
  TabbarItem,
  Tab,
  TabItem
  },
  data () {
    return {
      user:'',
      isshow:false,
      index:0,
      questions:[],
      answers:[],
      Aquestion:[]
    }
  },
  methods:{
    ti:function(){
        this.$http({
          method:'POST',
          url:'/server/users/presentp',
          data:this.user
        }).then((data)=>{
            if(data.data.error == 0){
                alert('修改成功')
                this.isshow = false
            }
        })
    },
    answer:function(id){
        this.$router.push({path:`/pay/answer?id=${id}`})
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
          this.$http({
             method:'GET',
             url:`server/payaq/getall?id=${data.data.data._id}`,
             data:''
         }).then((data2)=>{
             if(data2.data.error == 0){
                 this.questions = data2.data.question
                 this.answers = data2.data.answer
                 this.Aquestion = data2.data.Aquestion
             }
         })
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
      background:rgba(18,99,220,0.3);
      border-radius:3px;
  }
  .form input{
      width:60px;
      padding:3px;
  }
  .form button{
      padding:5px 70px;
      background:rgb(28,116,188);
      color:#fff;
      border:none;
      border-radius:3px;
  }
  .question{
      padding:10px;
      background:#fff;
  }
  .question_name{
      font-size:14px;
      color:rgb(160,160,160);
      overflow:hidden;
  }
   .question_name img{
       width:22px;
       float:left;
       margin-right:10px;
       border-radius:50%;
   }
   .question_name .price{
       float:right;
       color:rgb(210,10,10);
       padding:0 5px;
       border:solid 1px rgb(210,10,10);
       border-radius:2px;
   }
   .quesiton_content{
       padding:10px;
       min-height:50px;
       max-height:100px;
       overflow:hidden;
   }
   .hui{
       text-align:center;
   }
   .hui button{
       padding:0 8px;
       border:solid 1px rgb(18,98,180);
       color:rgb(18,98,180);
       background:#fff
   }
</style>
<template>
  <div>
      <div class="question" v-if="question"> 
          <div class="question_author">
              <img :src="'server/images/'+question.author.img" alt="">
              <p>{{question.author.name}}</p>
              <p style="margin:20px 0;font-size:14px;color:rgb(170,170,170)">提出了问题</p>
              <p style="padding:10px;font-size:14px;">{{question.content}}</p>
          </div>     
      </div>
      <div class="answer">
             <textarea  placeholder="请回答问题"></textarea>
             <button @click="ans(question._id,question.author._id)">提交回答</button>
      </div>  
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  components: {
  
  },
  data () {
    return {
      user:'',
      question:''
    }
  },
  methods:{
      ans:function(qid,qaid){
          let data1={
              content:$('textarea')[0].value,
              question:qid,
              question_author:qaid,
              author:this.user._id
          }
         this.$http({
             method:'POST',
             url:'server/payaq/anscreate'
         })
      }
  },
  mounted:function(){
      this.$http({
        method: 'GET',
        url: '/server/users/session',
        data: '',
        }).then((data)=>{
            if(data.data.error == 0){ 
              this.user = data.data.data
              this.$http({
                method: 'GET',
                url: `server/payaq/getquestion?id=${this.$route.query.id}`,
                data: '',
              }).then((data2)=>{
                 if(data2.data.error == 0){
                     this.question = data2.data.data
                 }
              })
         }else{
             this.$router.push({path:'/login'})
        }
    })
  }
}
</script>

<style scoped>
.question{
    padding:10px;
    background:#fff;
}
.question .question_author{
    padding-top:30px;
    text-align:center;

}
.question .question_author img{
    width:100px;
    border-radius:50%;
}
.answer{
    background:#fff;
    padding:50px 0;
    text-align:center;
    font-size:14px;
}
.answer textarea{
    width:80%;
    height:120px;
    padding:5px;
    border:solid 1px rgb(18,98,188);
    border-radius:5px;
    background:rgb(240,240,240);
    margin-bottom:40px;
}

.answer button{
    border:solid 1px rgb(18,98,188);
    border-radius:2px;
    padding: 5px 70px;
    background:#fff;
    color:rgb(18,98,188)
}
</style>
<template>
  <div id="cover">
     <div @input="change($event)" class="text" contenteditable="true"></div>
      <p><rater v-model="score"></rater><button :disabled="isSubmit" :class="{'qu':isSubmit}"  @click="submit($event)">评论</button><button @click="btnClick()"  class="qu">取消</button></p> 
  </div>
</template>

<script>
import { Rater } from 'vux'
import $ from 'jquery'
export default {
  components: {
    Rater
  },
  data () {
    return {
      isSubmit:true,
      user:'',
      score:0
    }
  },
methods:{
    change:function(ev){
          let that = this
          if(ev.target.innerHTML.replace(/<br>/gi,'').replace(/&nbsp;/gi,'').trim().length>0){
             that.isSubmit=false;
          }else{
            that.isSubmit=true;
          }
      },
      submit:function(ev){
          if(this.score ==  0){
             return alert('请给本书评分')
          }
          let that = this
          let content = $('div.text')[0].innerHTML.replace(/<br>/gi,' ').replace(/&nbsp;/gi,' ') 
          let data1 = {
              content:content,
              author_id:that.user,
              books:this.$route.query.id,
              score:this.score,
          }
          console.log(that.user)
          this.$http({
              method:'POST',
              url:`/server/shop/bookreply`,
              data:data1
          }).then((data)=>{
              if(data.data.error == 0){
                  alert('评论成功')
                  this.$emit('chuanshu', {type:false,ping:true});
              }
          })
      },
      btnClick:function(){
           this.$emit('chuanshu', {type:false,ping:false});
      }
   },
   mounted:function(){
       let that =this
       this.$http({
          method:'GET',
          url:`/server/users/session`,
          data:''
        }).then((data)=>{
           if(data.data.error == 0){
               that.user = data.data.data._id
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
   #cover{
     height:150px;
     width:100%;
     background:#fff;
     position:fixed;
     bottom:0;
     z-index:99999999;
   }
   .text{
       min-height:110px;
       display:inline-block;
       width:100%;
       max-height:110px;
       word-wrap: break-word;
       overflow-x: hidden;
       overflow-y: auto;
       font-size: 14px; 
       padding: 3px; 
       float:left;
       box-sizing: border-box;
   }
   #cover p {
      padding:5px;
   }
   button{
       border:none;
       line-height:30px;
       float:right;
       margin-left:5px;
       padding:0 15px;
       background:rgb(38,98,180);
       color:#fff;
   }
   button.qu{
       background:rgb(160,160,160)
   }
</style>
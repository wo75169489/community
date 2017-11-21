<template>
  <div>
     <div class="head">
        <span style="width:10%" @click="tui"><i class="fa fa-arrow-left"></i></span>
        <span class="title" style="width:85%">{{reply.comment_num}} 条评论</span>
    </div>
    <div style="margin-top:60px">
    </div>
    <div class="foot">
          <div @input="change($event)" class="text" contenteditable="true"></div>
          <button :disabled="isSubmit" @click="submit($event)">评论</button>
    </div>
    <div style="overflow:hidden;background:#fff;border-bottom:solid 1px #999" v-for="(item,index) in comment">
       <section style="width:15%;float:left;padding:10px"><img  style="border-radius:50%;width:45px;height:45px;" :src="'server/images/'+ item.author_id.img || 'moren.jpg'" alt=""></section>
       <section style="width:85%;float:left;padding:10px">
         <p style="font-size:14px;margin:0; color:rgb(58,118,199);margin:15px 0;">{{item.author_id.name}}</p>
          {{item.content}}
          <P style="font-size:12px;margin-top:10px;"><span>{{item.create_time}}</span></P>
       </section>
       
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
      reply:[],
      article:[],
      author:[],
      user:'',
      isSubmit:true,
      comment:[],
    }
  },
  methods:{
      tui:function(){
         window.history.back() 
      },
      change:function(ev){
          let that = this
          if(ev.target.innerHTML.indexOf('<br>')>-1){
              ev.target.innerHTML = ''
          }
          if(ev.target.innerHTML.trim().length>0){
             that.isSubmit=false;
          }else{
            that.isSubmit=true;
          }
      },
      submit:function(ev){
          let that = this
          let data1 = {
              content:$(ev.target).siblings()[0].innerHTML,
              reply_id:that.reply._id,
              author_id:that.user,
              article_id:that.article._id,
              reply_author_id:that.author._id
          }
        this.$http({
            method:'POST',
            url:'server/reply/commentcreate',
            data:data1
        }).then((data)=>{
            if(data.data.error == 0){
                alert('评论成功')
                that.updated()
            }
        })
      },
      updated:function(){
        let that = this
        this.$http.get(`server/reply/in?id=${this.$route.query.id}`).then((data)=>{
        that.reply = data.data.data
        that.article = data.data.data.article_id
        that.author = data.data.data.author
        }),
        this.$http({
         method: 'GET',
         url: '/server/users/session',
         data: '',
       }).then((data)=>{
         if(data.data.error == 0){
           that.user = data.data.data._id
         }
       }),
    this.$http({
        method:'GET',
        url:`server/reply/getcomment?id=${this.$route.query.id}`,
        data:'',
    }).then((data)=>{
        that.comment = data.data.data
    })
      }
  },
  mounted:function(){
    this.updated()
  }
}
</script>

<style scoped>
*{
    box-sizing: border-box
}
.head {
    line-height:30px;
    padding:10px;
    background:#fff;
    overflow:hidden;
    position:fixed;
    width:100%;
    top:0;
    border-bottom:solid 1px rgb(200,200,200);
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
      background:#fff;
      width:100%;
      position:fixed;
      z-index:9999999;
      bottom:0;
      padding:10px;
      overflow:hidden;
  }
   .foot .text{
       min-height:25px;
       display:inline-block;
       width:75%;
       max-height:80px;
       border-bottom:solid 1px #888;
       word-wrap: break-word;
       overflow-x: hidden;
       overflow-y: auto;
       font-size: 14px; 
       padding: 3px; 
       float:left;
   }
   .foot button{
       border:none;
       line-height:30px;
       float:left;
       margin-left:5px;
       padding:0 15px;
       background:rgb(38,98,180);
       color:#fff;
   }
</style>
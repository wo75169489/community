
<template>
        <div>
            <div class="head">
                <span style="width:10%" @click="tui"><i class="fa fa-arrow-left"></i></span>
                <span class="title" style="width:70%">{{article.title}}</span>
                <section class="do" style="width:20%">
                    <button v-if="user" @click="isReply = true"><i class="fa fa-pencil"></i></button>
                </section>
            </div>
            <div style="margin-top:50px;padding:10px;background:#fff">
                <p><span style="padding:5px; margin:5px;background:rgb(230,230,230);border-radius:3px;font-size:12px;" v-for="tag in article.tags">{{tag}}</span></p>
                <h3>{{article.title}}</h3>
                <div style="min-height:40px;font-size:12px;margin:10px 0;">{{article.content}}</div>
                <p style="font-size:14px;margin:10px;overflow:hidden"><span style="margin-right:20px;">{{article.follow_num}}人关注 </span><span> {{article.comment_num}}条评论</span>
                    <button style="float:right;background:rgb(58,97,210);color:#fff;border:none;padding:5px 15px;border-radius:3px">+ 关注问题</button>
                </p>
            </div>
        <div class="createA" v-show="isReply">
            <p><span class="cha" @click="isReply = false">× </span><span> 撰写回答</span><button @click="submit" :disabled="!reply.length" class="next" >提交</button></p>
            <form style="margin-top:10px;">
                 <textarea v-model="reply"  placeholder="补充问题描述"></textarea>
            </form>
         </div>
            <div class="paixu">
              <span @click="paixu = true">默认排序</span>
               <div v-if="paixu">
                 <button @click="sort('create_time')">按时间</button>
                 <button @click="sort('angree')">按质量</button>
                 <button @click="sort('comment_num')">按热度</button>
                 <button @click="paixu = false">收起</button>
               </div>
            </div>
            
          <div v-for="(reply,index) in allreply" style="margin:5px 0;background:#fff;padding:10px" @click="replyT(reply._id)">
            <p><img style="border-radius:50%;vertical-align: middle;width:30px;height:30px" :src="'server/images/'+reply.author.img || 'moren.jpg'" alt=""><span style="font-size:14px;color:rgb(120,120,120);margin-left:20px;">{{reply.author.name}}</span></p>
              <p style="overflow: hidden;max-height:80px;text-overflow: ellipsis;word-wrap: break-word;margin:10px 0;min-height:80px">
                  {{reply.content}}
              </p>
              <p style="font-size:14px;color:rgb(150,150,150)"><span>{{reply.angree}} 赞同 · </span><span>{{reply.comment_num}} 评论 · {{time[index]}} </span></p>
          </div>
        </div>
    </template>

<script>
import bus from '../bus.js'
export default {
  components: {
        
  },
  data () {
    return {
      article:'',
      user:'',
      isReply:false,
      reply:'',
      allreply:[],
      time:[],
      paixu:false
    }
  },
  methods:{
      tui:function(){
          window.history.back()
      },
      submit:function(){
       let that = this
       let data1 = {
           content:this.reply,
           author:this.user,
           article_id:this.article._id
       }
      this.$http({
          method:'POST',
          url:'/server/reply/create',
          data:data1,
        }).then((data)=>{
           if(data.data.error==0){
               that.allreply.push(data.data.data)
               that.time.push(data.data.time)
               alert('回复完成')
               this.isReply=false
           }
        }).catch((err)=>{
         
        })
      },
      replyT:function(ev){
         this.$router.push({path:`/anwser?id=${ev}`})
      },
      sort:function(ev){
        this.$http.get(`server/reply/reall?sort=${ev}&id=${this.$route.query.id}`).then((data)=>{
          this.allreply = data.data.data
          this.paixu = false
        })
      }
  },
  mounted:function(){
     var that = this
     this.$http.get(`server/article/in?id=${this.$route.query.id}`).then( (data) => {
      that.article = data.data.data
      that.allreply = data.data.replys
      that.time = data.data.time
      this.$http({
         method: 'GET',
         url: '/server/users/session',
         data: '',
       }).then((data)=>{
         if(data.data.error == 0){
           that.user = data.data.data._id 
         }else{
           
          }
        })
      }) 
  }
}
</script>

<style scoped>
.paixu{
  position:relative;
  padding-left:10px;
  z-index:50
}
.paixu div{
  position:absolute;
  background:#fff;
  top:0;
  left:10px;
  border:solid 1px rgb(200,200,200);
  z-index:50
}
.paixu div button{
  display:block;
  border:none;
  background:#fff;
  padding:10px 15px;
  border-bottom:solid 1px rgb(200,200,200)
}
.paixu div button:last-child{
  border:none;
}
.head {
    line-height:30px;
    padding:10px;
    background:#fff;
    overflow:hidden;
    position:fixed;
    width:100%;
    top:0;
    border-bottom:solid 1px rgb(200,200,200)
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
  section.do{
    float:right;
  }
  section.do button{
      width:49%;
      height:30px;
      border:none;
      background:#fff;
  }
  .createA{
      position:fixed;
      top:0;
      bottom:0;
      left:0;
      right:0;
      background:#fff;
      z-index:9999
  }
.createA>p{
  overflow:hidden;
  line-height:30px;
  box-shadow: 0px 3px 4px #888;
  padding:5px 10px;
}
.createA>p .cha{
  font-size:26px;
}
.createA>p span{
  font-size:18px;
  margin-right:20px;
}
.createA>p .next{
  float:right;
  border:none;
  background:#fff;
  font-size:16px;
  line-height:30px;
}
.createA textarea{
  width:100%;
  height:500px;
  margin-top:10px;
  border:none;
  padding:3px 
}

</style>
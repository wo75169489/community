<template>
  <div>
    <tab v-model="index" :line-width="1" custom-bar-width="60px">
      <tab-item style="position:relative" badge-label="">
          回复通知
          <span v-if="noreply.length" style="position:absolute;right:20%;top:0px;display:block;width:20px;height:20px;background:red;text-align:center;line-height:20px;color:#fff;border-radius:50%;font-size:12px;">{{noreply | leng}}</span>
      </tab-item>
      <tab-item style="position:relative" badge-label="">
           关注通知
         <span v-if="nofollow.length || nofollow_reply.length" style="position:absolute;right:20%;top:0px;display:block;width:20px;height:20px;background:red;text-align:center;line-height:20px;color:#fff;border-radius:50%;font-size:12px;">{{follow_num}}</span>
      </tab-item>
      <tab-item style="position:relative" badge-label="">
         评论通知
         <span v-if="nocomments.length" style="position:absolute;right:20%;top:0px;display:block;width:20px;height:20px;background:red;text-align:center;line-height:20px;color:#fff;border-radius:50%;font-size:12px;">{{nocomments | leng}}</span>
      </tab-item>
    </tab>
    <p v-if="nofollow.length || nofollow_reply.length || nocomments.length || noreply.length" style="text-align:center"><button @click="alldu()" style="background:#fff" class="queren">全部已读</button></p>
    <div v-if="index == 0">
      <div v-for="reply in noreply" style="background:#fff;padding:10px;margin:10px 0">
        <p @click="inauthor(reply.author_id._id)" style="color:#888;font-size:14px;margin:5px 0"><span style="color:black;font-size:16px;">{{reply.author_id.name}} </span> 回复了你的问题</p>
        <p @click="inarticle(reply.article_id._id)"> {{reply.article_id.title}} <span v-for="tag in reply.article_id.tags" style="padding:3px 5px;background:#999;font-size:12px;margin:0 5px;color:#fff">{{tag}}</span> </p>
        <section @click="inreply(reply.reply_id._id)" style="padding:10px;color:rgb(50,118,199);min-height:40px;max-height:100px;over-flow:hidden">
          {{reply.reply_id.content}}
        </section>
        <button @click.stop="yidu(reply._id)" class="queren">确认已读</button>
      </div>
    </div>
    <div v-if="index == 1" >
     <div v-for = "follow in nofollow" style="background:#fff;padding:10px;margin:10px 0">
       <p @click="inauthor(follow.author_id._id)" style="color:#888;font-size:14px;margin:5px 0"><span style="color:black;font-size:16px;">{{follow.author_id.name}}</span> 关注了你</p>
       <button @click.stop="yidu(follow._id)" class="queren">确认已读</button>
       </div>
       <div v-for="reply in nofollow_reply" style="background:#fff;padding:10px;margin:10px 0">
         <p style="color:#888;font-size:14px;margin:5px 0"><span @click="inauthor(reply.author_id._id)" style="color:black;font-size:16px;">{{reply.author_id.name}} </span> 回复了问题</p>
         <p @click="inarticle(reply.article_id._id)"> {{reply.article_id.title}} <span v-for="tag in reply.article_id.tags" style="padding:3px 5px;background:#999;font-size:12px;margin:0 5px;color:#fff">{{tag}}</span> </p>
        <section @click="inreply(reply.reply_id._id)" style="padding:10px;color:rgb(50,118,199);min-height:40px;max-height:100px;over-flow:hidden">
           {{reply.reply_id.content}}
        </section>
          <button @click.stop="yidu(reply._id)" class="queren">确认已读</button>
      </div>
    </div>
    <div v-if="index == 2">
      <div v-for="comment in nocomments" style="background:#fff;padding:10px;margin:10px 0">
      <p style="color:#888;font-size:14px;margin:5px 0"><span @click="inauthor(comment.author_id._id)" style="color:black;font-size:16px;">{{comment.author_id.name}} </span> 评论了你的回复</p>
      <p @click="inreply(comment.reply_id._id)" style="color:#888;font-size:14px;margin:5px 0">{{comment.reply_id.content}}</p>
      <section @click="incomment(comment.reply_id._id)" style="padding:10px;color:rgb(50,118,199);min-height:40px;max-height:100px;over-flow:hidden">
          {{comment.comment_id.content}}
      </section>
      <button @click.stop="yidu(comment._id)" class="queren">确认已读</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
export default {
  components: {
    Tab,
    TabItem,
  },
  data () {
    return {
      index:0,
      noreply:[],
      nofollow:[],
      nofollow_reply:[],
      nocomments:[],
    }
  },
  methods:{
      chushi:function(){
          let that = this
          this.$http.get(`/server/message/megno`).then((data)=>{
              that.nofollow = []
              that.noreply = []
              that.nofollow_reply = []
              that.nocomments = []
              if(data.data.error == 0){
                  data.data.data.forEach((item)=>{
                       if(item.type == 'follow'){
                           that.nofollow.push(item)
                       }
                       if(item.type == 'reply'){
                           that.noreply.push(item)
                       }
                       if(item.type == 'follow_reply'){
                           that.nofollow_reply.push(item)
                       }
                       if(item.type == 'comment'){
                           that.nocomments.push(item)
                       }
                  })
              }
          })
      },
      alldu:function(){
         this.$http.get(`server/message/alldu`).then((data)=>{
             if(data.data.error == 0){
                 this.chushi()
             }
         }) 
      },
      yidu:function(id){
         this.$http.get(`server/message/yidu?id=${id}`).then((data)=>{
             if(data.data.error == 0){
                 this.chushi()
             }
         }) 
      },
      inauthor:function(ev){
          this.$router.push({path:`/userbj?id=${ev}`})
      },
      inarticle:function(ev){
          this.$router.push({path:`/read?id=${ev}`})
      },
      inreply:function(ev){
          this.$router.push({path:`/anwser?id=${ev}`})
      },
      incomment:function(ev){
          this.$router.push({path:`/comment?id=${ev}`})
      }
  },
  mounted:function(){
      this.chushi()
  },
  filters:{
    'leng':function(value){
        if(value.length<99){
          return Number(value.length);
        }else{
            return 99
        }
    }
    },
    computed:{
        follow_num:function(){
            let a = this.nofollow_reply.length + this.nofollow.length
            a = a>99?99:a;
            return a
        }
    }
}
</script>

<style scoped>
  .queren{
      background:none;
      padding:3px 10px;
      border:solid 1px rgb(58,150,199);
      color:rgb(58,150,199);;
  }
</style>
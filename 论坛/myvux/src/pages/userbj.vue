<template>
  <div>
     <section style="position:relative;" class="jieshao">
         <img :src="'server/images/'+user.img" alt="">
         <i @click="xiugai(user._id)" style="position:absolute;right:30px" class="fa fa-pencil"></i>
         <p class="name">{{user.name}}</p>
         <p class="qian">{{user.motto}}</p>
     </section>
     <div class="guanzhu">
        <ul> 
           <li>
              <p>我关注的人</p>
              <span>{{user.my_befollow | leng}}</span>
           </li>
           <li>
              <p>关注我的人</p>
              <span></span>
              <span>{{user.my_follow | leng}}</span>
           </li>
           <li>
              <p>我的回复收藏</p>
              <span></span>
              <span>{{user.my_collect | leng}}</span>
           </li>
        </ul>
     </div>
     <p style="text-align:center;font-size:14px;margin:0">一一一 我的动态 一一一</p>
    <tab v-model="index" :line-width="1" custom-bar-width="60px">
      <tab-item v-for="(item,ins) in all" :selected="index == ins"  :key="ins">{{item}}</tab-item>
    </tab>
     <div class="dongtai">
       <div v-show="index == 0">
         <div @click="treply(reply._id)" v-for="reply in replys" style="padding:10px;background:#fff;border-bottom:solid 1px rgb(220,220,220)">
           <p style="font-size:12px;line-height:26px;overflow:hidden">
               <img style="width:20px;border-radius:50%;float:left;margin-right:10px" :src="'/server/images/'+reply.author.img" alt="">
               <span>{{reply.author.name}}回答了</span>
           </p>
            <h4>问题：{{reply.article_id.title}}</h4>
            <section style="min-height:50px;font-size:14px;padding:10px 0;">
            {{reply.content}}
            </section>
          </div>
       </div>
       <div v-show="index == 1">
         <div @click="tarticle(article._id)" v-for="article in articles" style="padding:10px;background:#fff;border-bottom:solid 1px rgb(220,220,220)">
          <p style="font-size:12px;line-height:26px;overflow:hidden">
             <img style="width:20px;border-radius:50%;float:left;margin-right:10px" :src="'/server/images/'+article.author.img" alt="">
              <span>{{article.author.name}}提出了问题</span>
          </p>
          <h4>{{article.title}}</h4>
          <section style="min-height:50px;font-size:14px;padding:10px 0;">
            {{article.content}}
          </section>
          </div>
       </div>
       <div v-show="index == 2">
         <div v-for="comment in comments" style="padding:10px;background:#fff;border-bottom:solid 1px rgb(220,220,220)">
         <div v-if="comment.books" @click="bcomment(comment.books._id)">
          <p style="font-size:12px;line-height:26px;overflow:hidden">
               <img style="width:20px;border-radius:50%;float:left;margin-right:10px" :src="'/server/images/'+comment.author_id.img" alt="">
                <span>{{comment.author_id.name}}评论了</span>
               </p>
               <section style="text-align:center;">
                  <img style="width:70px" :src="'/server/images/' + comment.books.img" alt="">
                  <h4 style="font-size:14px;">{{comment.books.name}}</h4>
                  <section style="padding:10px;min-height:50px;font-size:14px;text-align:left">
                  {{comment.content}}
                  </section>
               </section>
          </div>
          <div v-else @click="tcomment(comment.reply_id._id)">
             <p style="font-size:12px;line-height:26px;overflow:hidden">
              <img style="width:20px;border-radius:50%;float:left;margin-right:10px" :src="'/server/images/'+comment.author_id.img" alt="">
               <span>{{comment.author_id.name}}评论了</span>
              </p>
             <h4>回答：{{comment.reply_id.content}}</h4>
             <section style="min-height:50px;font-size:14px;padding:10px 0;">
                {{comment.content}}
              </section>
           </div>
           
          </div>
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
      user:{img:'moren.jpg'},
      all:['回答','提问','评论'],
      index:0,
      articles:[],
      replys:[],
      comments:[]
    }
  },
  methods:{
      treply:function(ev){
          this.$router.push({path:`/anwser?id=${ev}`})
      },
      tarticle:function(ev){
          this.$router.push({path:`/read?id=${ev}`})
      },
      tcomment:function(ev){
          this.$router.push({path:`/comment?id=${ev}`})
      },
      bcomment:function(ev){
          this.$router.push({path:`/shop/book?id=${ev}`})
      },
      xiugai:function(ev){
          this.$router.push({path:`/user/update?id=${ev}`})
      }
  },
  mounted:function(){
      let that = this
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
          url:`/server/users/my_all?id=${this.$route.query.id}`,
          data:''
      }).then((data)=>{
          if(data.data.error == 0){
              console.log(data.data.reply)
              that.articles = data.data.article
              that.replys = data.data.reply
              that.comments = data.data.comment
              
          }
      })
  },
  filters:{
            'leng':function(value){
                if(value){
                    return value.length;
                }else{
                    return 0
                }
            }
        }
}
</script>

<style scoped>
.jieshao{
    width:100%;
    height:160px;
    background:#fff;
    text-align:center;
    padding-top:20px;
}
.jieshao img{
   width:80px;
   height:80px;
   border-radius:50%;
}
.jieshao .qian{
    margin:10px 0;
    font-size:14px;
}
.guanzhu {
    margin-top:10px;
    background:#fff;
    padding:10px;
}
.guanzhu ul {
    width:100%;
    overflow:hidden;
}
.guanzhu ul li{
    width:33%;
    float:left;
    list-style:none;
    text-align:center;
}
.guanzhu ul li p{
   font-size:14px;
   color:rgb(100,100,100) 
}
.dongtai{
    width:100%;
}
.dongtai p , .dongtai h4{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
<template>
  <div>
     <div class="head">
       <span style="width:10%" @click="tui"><i class="fa fa-arrow-left"></i></span>
       <span v-for="bo in book"  class="title" style="width:85%">{{bo.name}}</span>
     </div>
     <div v-for="bo in book" style="margin-top:55px;">
        <div class="main">
             <img :src="'server/images/'+bo.img" alt="">
           <h5>{{bo.name}}</h5>
           <p class="author">{{bo.author}}</p>
           <p class="summary">{{bo.summary}}</p>
           <p class="read" v-if="bo.score.length"><rater :font-size="16" v-model="zscore" disabled></rater> <span style="font-size:12px;">{{zscore*2}}分 · {{bo.read}} 人读过</span></p>
           <p v-else style="font-size:12px;color:#999;">暂无评分 · {{bo.read}} 人读过</p>
           <section v-if="!bo.price || isdu">
                <button style="background:rgb(180,180,180)" @click="remove(bo._id)" v-if="isdu">移除书架</button>
                <button v-else @click="my_books">加入书架</button>
                <p v-if="!bo.price" style="font-size:12px;color:#999;">免费</p>
           </section>
           <section v-else>
                <button v-if="isshop" @click="addshop(bo._id)" style="font-size:16px;">￥{{bo.price}}</button>
                <button v-else style="font-size:16px;" @click="path('shopCart',user._id)">去付款</button>
                 <x-dialog v-model="tshow">
                     <div>
                        <p style="magin:15px;padding:20px 0;">加入购物车成功</p>
                        <p><button @click="con">继续挑选</button><button @click="path('shopCart',user._id)">前往结算</button></p>
                    </div>
                 </x-dialog>
           </section>
        </div>
     </div>
     <div class="reply">  
         <p>知友点评</p>
         <section v-for="comment in comments">
             <p class="author"><img :src="'/server/images/'+comment.author_id.img" alt=""><span>{{comment.author_id.name}}</span></p>
              <Rater style="padding:0 10px;" :font-size="15" v-model="comment.score" disabled></Rater>
             <section class="content">{{comment.content}}</section>
         </section>
     </div>
     <bookreply  @chuanshu="jieshou($event)"  v-show="isP"></bookreply>
     <div class="di" v-for="bo in book">
        <button class="quzan" @click="zan(bo._id,false)" v-if="bo.angree.indexOf(user._id)>-1"><i class="fa fa-thumbs-up"> </i> {{bo.angree.length}}</button>
        <button @click="zan(bo._id,true)" v-else><i class="fa fa-thumbs-up"> </i> {{bo.angree.length}}</button>
        <button v-if="isdu && canping" @click="isP = true" class="ping"><i class="fa fa-commenting-o"> </i> 评论</button>
     </div>
  </div>
</template>

<script>
import { Rater,XDialog } from 'vux'
import bookreply from './../components/bookreply'
export default {
  components: {
   bookreply,
   Rater,
   XDialog
  },
  data () {
    return {
      book:[],
      tshow:false,
      user:[],
      isP:false,
      comments:[],
      isdu:false,
      canping:true,
      score:'',
      isshop:true,
    }
  },
  methods:{
      chushi:function(){
          let that = this
          this.$http.get(`/server/shop/book?id=${this.$route.query.id}`).then((book)=>{
                if(book.data.error == 0){
                    this.book = []
                    this.book.push(book.data.data)
                    this.comments = book.data.comment,
                    this.score = book.data.data.score
                    this.$http({
                    method:'GET',
                    url:`/server/users/session`,
                    data:''
                  }).then((data)=>{
                     if(data.data.error == 0){
                    if(data.data.data.my_books.indexOf(this.$route.query.id)>-1){
                       that.isdu = true 
                       }
                       data.data.data.shopCart.forEach((item)=>{
                            if(item._id == this.$route.query.id){
                                that.isshop = false
                            }
                       })
                       that.user = data.data.data
                       that.comments.forEach((item)=>{
                           if(item.author_id._id == that.user._id){
                               that.canping = false
                             }
                          })
                     }else{
                   if(this.$route.path!="/login" || "/"){
                      this.$router.push("/login");
                        }
                      }
                   })
                }
          })
          
      },
      tui:function(){
          window.history.back()
      },
      jieshou:function(ev){
         this.isP = ev.type
         if(ev.ping){
             this.chushi()
         } 
      },
      con:function(){
        this.tshow = false
      },
      zan:function(ev,isZ){
          this.$http.get(`/server/shop/zan?id=${ev}&zan=${isZ}`).then((data)=>{
              if(data.data.error==0){
                  this.book = []
                  this.book.push(data.data.book)
              }
          })
      },
      my_books:function(){
          this.$http.get(`/server/shop/collect?id=${this.$route.query.id}`).then((data)=>{
              if(data.data.error == 0){
                 this.book = []
                 this.book.push(data.data.book)
                 this.isdu=true
                 alert('加入书架成功，快去书架阅读吧')
              }
          })
      },
      remove:function(ev){
         this.$http.get(`/server/shop/remove?id=${ev}`).then((data)=>{
             if(data.data.error == 0){
                 this.book = []
                 this.book.push(data.data.book)
                 this.isdu=false
                 alert('已从书架移除')
              }
         })
      },
      addshop:function(ev){
         this.$http.get(`server/shop/addshop?id=${ev}`).then((data)=>{
             if(data.data.error == 0){
                 this.isshop = false,
                 this.user = data.data.data,
                 this.tshow = true
             }else{
                 alert(data.data.message)
             }
         })
      },
      path:function(p,id){
          this.$router.push({path:`/${p}?id=${id}`})
      }
  },
  mounted:function(){
      this.chushi()
  },
  computed:{
      zscore:function(){
          let a = 0
          this.score.forEach((item)=>{
              a += Number(item)
          })
          return Number((a/this.score.length).toFixed(1))
      }
  }
}
</script>

<style scoped>
.reply{
    background:#fff;
    margin:10px 0;
}
.reply>p{
    padding:10px;
    font-size:14px;
    font-weight:600;
}
.reply .author img{
    width:25px;
    height:25px;
    border-radius:50%;
    float:left;
    margin-right:15px;
}
.reply .author{
    padding:10px;
    overflow:hidden;
}
.reply .author span{
    display:inline-block;
    line-height:25px;
    float:left;
    font-size:14px;
    color:#888;
}
.reply .content{
    padding:10px;
    min-height:50px;
    max-height:150px;
    overflow:hidden;
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
.di .quzan{
    color:rgb(58,118,190);
    border:solid 1px rgb(58,118,190);
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
  .main{
      background:#fff;
      text-align:center;
      padding:10px;
      border-bottom:solid 1px rgb(220,220,220)
  }
  .main>img{
      width:140px;
  }
  .main>h5{
      font-size:16px;
      min-height:25px;
      max-height:50px;
      overflow:hidden;
  }
  .main .author{
      font-size:14px;
      color:#666;
  }
  .main .summary{
      padding:5px 15px;
      font-size:14px;
      color:rgb(58,115,195);
      min-height:25px;
      max-height:75px;
      overflow:hidden;
  }
  .main .read{
      font-size:12px;
      color:#888;
  }
  .main button{
      padding:5px 70px;
      border:none;
      background:rgb(80,142,220);
      border-radius:2px;
      color:#fff;
      margin: 5px 0;
  }
  .di{
      position:fixed;
      z-index:9999999;
      height:50px;
      width:100%;
      bottom:0;
      background:#fff;
      padding:10px;  
      box-sizing: border-box;
      overflow:hidden;
  }
  .di button{
      padding:5px 20px;
      border:none;
      background:#fff;
      border:solid 1px rgb(200,200,200);
      color:rgb(180,180,180);
      border-radius:3px;
  }
  .di button.ping{
     float:right;
     
  }
  
</style>
<template>
  <div>
     <div class="head">
            <span style="width:10%" @click="tui"><i class="fa fa-arrow-left"></i></span>
            <span @click="read(article._id)" class="title" style="width:85%">{{article.title}}</span>
    </div>
    <div style="background:#fff;margin-top:60px;min-height:520px;">
       <section style="padding:10px;position:relative;border-bottom:solid 1px rgb(220,220,220)"> 
         <img :src="'server/images/'+author.img" style="width:40px;height:40px;border-radius:50%" alt="">
         <section style="display:inline-block;width:60%;margin-left:20px;"> 
            <span>{{author.name}}</span><br>
            <span  class="tit">{{author.motto}}</span>
         </section>
             <div v-if="canRe" style="position:absolute;top:20px;right:20px;">
               <button v-if="guanzhu" class="fllow" @click="guanz(author._id,'is')">+ 关注</button>
               <button v-else class="fllow" @click="guanz(author._id,'no')">已关注</button>
             </div>
             <div v-else style="position:absolute;top:20px;right:20px;">
               <x-button style="font-size:14px;" @click.native="showPlugin" >删除</x-button>
               <confirm v-show="true" title="你说啥？"@on-confirm="onConfirm"></confirm>  
             </div>
       </section>
       <div style="padding:10px">
          {{reply.content}}
       </div>
    </div>
    <div class="foot">
       <ul>
         <li v-if="izan" @click="zan(reply._id,true,'','')"><i style="display:block" class="fa fa-thumbs-o-up"></i>赞同</li>
         <li v-else @click="zan(reply._id,'k','','')"><i style="display:block" class="fa fa-thumbs-up"></i>已赞同</li>
         <li v-if="icang" @click="zan(reply._id,'',true,'')"><i style="display:block" class="fa fa-star-o"></i>收藏</li>
         <li v-else @click="zan(reply._id,'','k','')"><i style="display:block" class="fa fa-star"></i>已收藏</li>
         <li v-if="iguan" @click="zan(reply._id,'','',true)"><i style="display:block" class="fa fa-eye-slash"></i>关注</li>
         <li v-else @click="zan(reply._id,'','','k')"><i style="display:block" class="fa fa-eye"></i>已关注</li>
         <li @click="comment"><i style="display:block" class="fa fa-comment-o"></i>{{reply.comment_num}}</li>
       </ul>
    </div>
    
  </div>
</template>

<script>
import {Confirm,XButton} from 'vux'
export default {
  components: {
   Confirm,
   XButton
  },
  data () {
    return {
      reply:[],
      article:[],
      author:{img:'moren.jpg'},
      izan:true,
      icang:true,
      iguan:true,
      user:[],
      guanzhu:true,
      canRe:true
    }
  },
  methods:{
      tui:function(){
          window.history.back()
      },
      read:function(ev){
        this.$router.push({path:`/read?id=${ev}`})
      },
      zan:function(id,isZan,isCang,isGuan){
          let that = this
         this.$http.get(`server/reply/angree?id=${this.$route.query.id}&iszan=${isZan}&iscang=${isCang}&isguan=${isGuan}`).then((data)=>{
              if(data.data.error == 0){
                  if(isZan){
                      return that.izan = !that.izan
                  }
                  if(isCang){
                      return that.icang = !that.icang
                  }
                  if(isGuan){
                      return that.iguan = !that.iguan
                  }
              }
         })
      },
      comment:function(){
          this.$router.push({path:`/comment?id=${this.$route.query.id}`})
      },
      guanz:function(ev,isg){
          this.$http.get(`server/users/guanzhu?id=${ev}&is=${isg}`).then((data)=>{
              if(data.data.error == 0){
                  this.guanzhu = !this.guanzhu
              }
          })
      },
      onConfirm:function(){
      },
      showPlugin:function(){
        let that = this
        this.$vux.confirm.show({
            title: '确定要删除这条回答吗？',
           onConfirm () {
            that.$http.get(`server/reply/remove?id=${that.$route.query.id}`).then((data)=>{
                if(data.data.error == 0){
                    alert('删除成功')
                    window.history.back()
                }
            })
          }
        })
      }
  },
  mounted:function(){
    let that = this
    this.$http.get(`server/reply/in?id=${this.$route.query.id}`).then((reply)=>{
        that.reply = reply.data.data
        that.article = reply.data.data.article_id
        that.author = reply.data.data.author
        this.$http({
          method:'GET',
          url:`/server/users/session`,
          data:''
      }).then((data)=>{
        if(data.data.error == 0){
        that.user = data.data.data
        if(data.data.data.my_angree.indexOf(this.$route.query.id)>-1){
            that.izan = false
        }
        if(data.data.data.my_collect.indexOf(this.$route.query.id)>-1){
            that.icang = false
        }
        if(data.data.data.my_follow_reply.indexOf(this.$route.query.id)>-1){
            that.iguan = false
        }
        if(data.data.data.my_follow.indexOf(that.author._id)>-1){
            that.guanzhu = false
        }
        if(data.data.data._id == that.author._id){
            that.canRe = false
        }
    }else{
        if(this.$route.path!="/login" || "/"){
            this.$router.push("/login");
          }
      }
     })
    }) 
   }
  }
</script>

<style scoped>
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
  .tit{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;  
    color:rgb(130,130,130);
    display:inline-block;
    width:100%;
  }
  .fllow{
     border:none;
     background:rgb(30,118,196);
     padding:5px 15px;
     color:#fff;
     border-radius:5px
  }
  .foot{
      position:fixed;
      width:100%;
      height:55px;
      bottom:0;
      background:#fff;
      z-index:99999999;
  }
  .foot ul{
      overflow:hidden;
      width:100%
  }
  .foot ul li{
      width:25%;
      float:left;
      list-style:none;
      text-align:center;
      padding-top:5px;
  }
</style>
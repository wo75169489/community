<template>
  <div>
     <tab v-model="index" :line-width="1" custom-bar-width="60px">
      <tab-item v-for="(item,ins) in all" :selected="index == ins"  :key="ins">{{item}}</tab-item>
    </tab>
    <div v-show="index == 0">
      <div v-for="reply in replys" style="background:#fff;margin:7px 0;padding:10px" @click="readReply(reply._id)">
       <p style="font-size:14px;color:rgb(120,120,120)">热门内容,来自：{{reply.article_id.tags[0]}}</p>
          <h3 style="font-size:16px;">{{reply.article_id.title}}</h3>
        <section style="overflow:hidden;width:100%">
              <img style="width:20px;height:20px;border-radius:50%;" :src="'server/images/'+ reply.author.img" alt="">
              <span style="font-size:14px">{{reply.author.name}}</span>
        </section>
       <div style="min-height:70px;padding:10px 0; font-size:14px;">{{reply.content}}</div>
      <p style="font-size:12px;color:rgb(120,120,120)"><span>{{reply.angree}} 赞 </span> <span> {{reply.comment_num}}条评论</span></p>
      </div>
    </div>
    <div v-show="index==1">
        <div v-for="article in articlesre" style="background:#fff;margin:7px 0;padding:10px" @click="readArticle(article._id)">
           <p style="font-size:14px;color:rgb(120,120,120)">热门内容,来自：{{article.tags[0]}}</p>
           <h4>{{article.title}}</h4>
           <div style="min-height:60px;font-size:14px;padding:10px 0;">{{article.content || '暂无问题补充'}}</div>
           <p style="font-size:14px;color:rgb(120,120,120)"><span>{{article.comment_num}} 条回答</span></p>
        </div>
    </div>
    <div v-show="index==2">
        <div v-for="article in articlesxin" style="background:#fff;margin:7px 0;padding:10px" @click="readArticle(article._id)">
           <p style="font-size:14px;color:rgb(120,120,120)">热门内容,来自：{{article.tags[0]}}</p>
           <h4>{{article.title}}</h4>
           <div style="min-height:60px;font-size:14px;padding:10px 0;">{{article.content || '暂无问题补充'}}</div>
           <p style="font-size:14px;color:rgb(120,120,120)"><span>{{article.comment_num}} 条评论</span></p>
        </div>
    </div>
    
  </div>
</template>

<script>
import {mapState,mapGetters} from 'vuex'
import bus from '../bus.js'
import { Tab, TabItem,Swiper,SwiperItem } from 'vux'
export default {
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
  },
  data () {
    return {
      type:"last_reply_time",
      all:['最新回答','热门问题','最新问题'],
      index:0,
      replys:[],
      articlesre:[],
      articlesxin:[],
      num:5
    }
  },
  methods:{
    readReply:function(ev){
      var that = this
      this.$router.push({path:`/anwser?id=${ev}`})
    },
    readArticle:function(ev){
      var that = this
      this.$router.push({path:`/read?id=${ev}`})
    },
    chushi:function(){
      this.$http.get(`/server/reply/reall?limit=${this.num}&skip=${0}`).then( (data) => {
      var result = data.data;
      this.replys = result.data;
    })
    this.$http.get(`/server/article/showre`).then( (data) => {
      var result = data.data;
      this.articlesre = result.data;
    })
    this.$http.get(`/server/article/showxin`).then( (data) => {
      var result = data.data;
      this.articlesxin = result.data;
    })
    }
  },
  mounted:function(){
    let that = this
    let isMore  = false
    this.chushi()
    window.onscroll = function () {
        var height = document.body.clientHeight
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var windowH = window.innerHeight;
        if (scrollTop + windowH > height && !isMore) {
              isMore = true
              that.num +=5;
              console.log(that.num)
              that.chushi()
              that.$http.get(`/server/reply/reall?limit=${that.num}&skip=${0}`).then( (data) => {
                    var result = data.data;
                    that.replys = result.data;
                    isMore = false
              })
          }
       }
  }
}
</script>

<style>

</style>
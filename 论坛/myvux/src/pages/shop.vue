<template>
  <div>
    <div class="head">
      <section style="box-sizing:border-box" class="search">
        <input name="search" @input="sou($event)" type="text" placeholder="搜索书名">
        <i class="fa fa-search"></i>
        <i @click="qux" v-if="search.length || error" class="fa fa-times-circle-o"></i>
        <span v-show="user.isguan" @click="add">添加</span>
      <div v-if="search.length || error" style="overflow:auto;position:absolute;z-index:999;background:#fff;left:0;right:0;height:640px;"> 
          <div v-if="search.length">
              <section class="sbook" v-for="book in search" @click="path(book._id)">
                  <img :src="'server/images/'+book.img" alt="">
                  <section>
                      <p :title="book.name" class="bname">{{book.name}}</p>
                      <rater v-if="book.pscore" :font-size="15" v-model="book.pscore" :disabled="true"></rater>
                      <p class="read">{{book.read}} 人看过</p>
                      <p class="price" v-if="book.price == 0">免费</p>
                      <p class="price"><span>￥{{book.price}}</span></p>
                  </section>
              </section>
          </div>
          <div v-else>
               <h3>{{error}}</h3>
          </div>    
      </div>
     </section>
     <div>
        <swiper auto  style="height:160px;">
            <swiper-item v-for="img in lunbo">
               <img style="width:360px;height:160px;" :src="img" alt="">
            </swiper-item>
        </swiper>
     </div>
      <p class="box_top">热门推荐 <a href="#/all_book">查看全部</a></p>
     <scroller lock-y :scrollbar-x="false" :bounce="false">
         <div class="box1">
           <div class="box1-item" v-for="book in rebook" @click="path(book._id)">
              <img :src="'server/images/'+book.img" alt="">
              <h4>{{book.name}}</h4>
              <span>{{book.author}}</span>
           </div>
        </div>
      </scroller>
    <p class="box_top">为您精选 <a href="#/all_book">查看全部</a></p>
     <scroller lock-y :scrollbar-x="false" :bounce="false"> 
         <div class="box1">
           <div class="box1-item" v-for="book in jingbook" @click="path(book._id)">
              <img :src="'server/images/'+book.img" alt="">
               <h4>{{book.name}}</h4>
               <span>{{book.author}}</span>
            </div>
        </div>
     </scroller>
    <p class="box_top">免费书籍 <a href="#/all_book">查看全部</a></p>
    <scroller lock-y :scrollbar-x="false" :bounce="false">
         <div class="box1">
           <div class="box1-item" v-for="book in mianbook" @click="path(book._id)">
               <img :src="'server/images/'+book.img" alt="">
                <h4>{{book.name}}</h4>
                <span>{{book.author}}</span>
           </div>
        </div>
    </scroller>
    <p class="box_top">新书抢先看 <a href="#/all_book">查看全部</a></p>
    <scroller lock-y :scrollbar-x="false" :bounce="false">
         <div class="box1">
           <div class="box1-item" v-for="book in xinbook" @click="path(book._id)">
               <img :src="'server/images/'+book.img" alt="">
                <h4>{{book.name}}</h4>
                <span>{{book.author}}</span>
           </div>
        </div>
    </scroller>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { Scroller,Swiper,SwiperItem,Rater } from 'vux'
export default {
  components: {
    Scroller,
    Swiper,
    SwiperItem,
    Rater
  },
  data () {
    return {
      rebook:[],
      jingbook:[],
      mianbook:[],
      xinbook:[],
      user:[],
      lunbo:['static/images/01.png',
      'static/images/02.png',
      'static/images/03.jpg',
      'static/images/04.jpg',
      'static/images/05.png'
      ],
      search:[],
      error:''
    }
  },
  methods:{
    add:function(){
      this.$router.push({path:`/addbook`})
    },
    chushi:function(){
      let that =this
      this.$http.get('/server/shop/getall').then((data)=>{
         if(data.data.error == 0){
           this.rebook = data.data.rebook
           this.jingbook = data.data.jingbook
           this.mianbook = data.data.mianbook
           this.xinbook = data.data.xinbook
         }
      }),
      this.$http({
          method:'GET',
          url:`/server/users/session`,
          data:''
        }).then((data)=>{
           if(data.data.error == 0){
               that.user = data.data.data
           }else{
             
          }
        })
    },
    path:function(ev){
      this.$router.push(`/shop/book?id=${ev}`)
    },
    sou:function(ev){
      if(ev.target.value == ''){
        this.search = []
        this.error = ''
      }else{
        this.$http.get(`server/shop/sbook?val=${ev.target.value}`).then((data)=>{
         if(data.data.error==0){
           this.search = []
           if(data.data.data.length == 0){
             this.error = '无相关书籍'
           }else{
             let that = this
             this.search = data.data.data
             console.log(data)
             data.data.data.forEach((it,index)=>{
                  let a = 0
                  data.data.data[index].score.forEach((item)=>{
                  a += item
              })
               a = a/data.data.data[index].score.length
               that.search[index].pscore = a
            })
           }   
         }
       })
      }
    },
    qux:function(){
      this.search = []
      this.error = ''
      $('input[name=search]')[0].value = ''
    }
  },
  mounted:function(){
    this.chushi()
  },
 
}
</script>

<style scoped>

.head{
  z-index:9999
}
.search{
  position:relative;
  padding:10px;
  background:#fff;
}
.search>i.fa-times-circle-o{
  position:absolute;
  right:80px;
  line-height:27px;
}
 .search>i.fa-search{
  position:absolute;
  left:13px;
  line-height:27px;
}
.search>input{
  width:80%;
  line-height:26px;
  font-size:14px;
  padding:0 30px;
  border:none;
  border-bottom:solid 1px rgb(210,210,210);
  box-sizing:border-box;
}
.search .sbook{
  padding:10px;
  border-bottom:solid 1px rgb(200,200,200);
  overflow:hidden;
}
.search .sbook img{
  height:120px;
  float:left;
}
.search .sbook>section{
  width:60%;
  display:inline-block;
  float:left;
  padding-top:20px;
  font-size:14px;
  margin-left:10px;
}
.search .sbook>section .bname{
   overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.search .sbook>section .read{
  font-size:12px;
  color:rgb(150,150,150)
}
.search .sbook>section .price{
  color:rgb(198,25,25)
}
.box1-item{
  width:160px;
  height:200px;
  float:left;
  text-align:center;  
}
.box1-item>img{
  height:134px;
  width:100px;
  border-radius:5px;
}
.box1-item h4{
  min-height:20px;
  max-height:40px;
  overflow:hidden;
  width:80%;
  margin:0 auto;
  font-size:14px;
}
.box1-item>span{
  font-size:14px;
  color:#888
}
.box1{
  width:1120px;
  background:#fff;
  overflow:hidden;
  margin-bottom:10px;
  padding:10px 0;
}
.box_top{
  background:#fff;
  padding:10px 20px;
  font-size:16px;
  margin-top:10px;
  overflow:hidden;
}
.box_top a{
  font-size:14px;
  float:right;
}
</style>
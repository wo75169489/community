<template>
  <div>
  <div class="head">
                <span style="width:10%" @click="tui"><i class="fa fa-arrow-left"></i></span>
                <span class="title" style="width:70%">所有书籍</span>
    </div>
     <div class="box1">
        <div class="box1-item" v-for="book in books" @click="path(book._id)">
               <img :src="'server/images/'+book.img" alt="">
                <h4>{{book.name}}</h4>
                <span>{{book.author}}</span>
                <p>{{book.read}}人读过</p>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  
  },
  data () {
    return {
      books:[]
    }
  },
  methods:{
    path:function(ev){
      this.$router.push(`/shop/book?id=${ev}`)
    },
    tui:function(ev){
        window.history.back()
    }
  },
  mounted:function(){
      let that = this
      this.$http.get('/server/shop/all_book').then((data)=>{
          if(data.data.error == 0){
              that.books = data.data.book
          }
      })
  }
}
</script>

<style scoped>
.box1-item{
  width:33%;
  height:240px;
  float:left;
  text-align:center;  
  position:relative;
  margin-top:55px;
}
.box1-item>img{
  height:100px;
  width:80px;
  padding:20px;
  border-radius:5px;
}
.box1-item h4{
  min-height:20px;
  max-height:40px;
  overflow:hidden;
  width:80%;
  margin:0 auto;
  font-size:12px;
}
.box1-item>span{
  font-size:12px;
  color:#888
}
.box1{
  width:100%;
  background:#fff;
  overflow:hidden;
  margin-bottom:10px;
  padding:10px 0;
}
.box1-item>p{
    font-size:12px;
    position:absolute;
    bottom:0;
    text-align:center;
    width:100%;
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
    z-index:99999;
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
</style>
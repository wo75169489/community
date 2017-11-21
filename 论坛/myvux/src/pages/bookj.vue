<template>
  <div>
     <div class="head">
       <span style="width:15%" @click="tui"><i class="fa fa-arrow-left"></i></span>
       <span class="title" style="width:85%">我的书架</span>
     </div>
     <div style="margin-top:55px;overflow:hidden;background:#fff;min-height:525px;">
         <section @click="path('book',book._id)" v-for="book in books" class="book">
            <img :src="'/server/images/'+book.img" alt="">
             <div> 
                <h5>{{book.name}}</h5>
                <p>{{book.author}}</p>
             </div>
         </section>
     </div>
  </div>
</template>

<script>

export default {
  components: {
  
  },
  data () {
    return {
      user:[],
      books:[]
    }
  },
  methods:{
      chushi:function(){
         this.$http({
          method:'GET',
          url:`/server/users/userbook?id=${this.$route.query.id}`,
          data:''
      }).then((data)=>{
          if(data.data.error == 0){
              this.user = data.data.data
              this.books = data.data.data.my_books
          }else{
             this.$router.push({path:'/login'}) 
          }
      }) 
      },
    tui:function(){
     window.history.back()
    },
    path:function(a,b){
       this.$router.push({path:`/shop/${a}?id=${b}`})
    }
  },

  mounted:function(){
    this.chushi()
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
.head .title{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:18px;    
  }
  .head span{
    display:inline-block;
    float:left;
  }
  .book{
      width:33%;
      float:left;
      text-align:center;
      padding:5px;
      box-sizing:border-box;
  }
  .book>div h5{
    font-size:12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .book>div p{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:12px;
    color:#888;
  }
  .book img{
      width:80px;
  }
</style>
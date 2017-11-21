<template>
    <div id="root">
        <div id="img-list">
        <div class="geren">
            <label for="file-selector" id="file-label"><img  :src="files" class="images"></label><br><br>
            书名：<input v-model="book.name" type="text"><br><br>
            作者：<input v-model="book.author" type="text"><br><br>
            定价：<input type="number" v-model="book.price"><br><br>
            <section>
             <span>简介：</span><textarea v-model="book.summary"  name="" id="" cols="32" rows="5"></textarea>
           </section>
           <div style="height:20px;color:red">{{error}}</div>
        </div>

            <input id="file-selector" type="file" accept="image/jpeg,image/png,image/gif" @change="chooseImage" multiple>
        </div>
        <div id="btn">
            <button @click="btnClick">提交</button>
        </div>   
  </div>
</template>

<script>
export default {
  data:function(){
    return {
        files:'',
        photo:'',
        book:[],
        error:'',
    };
  },
 methods:{
    chooseImage:function(e){
          let that = this
            var f = e.target.files[0];
        if(f){
            var url = URL.createObjectURL(f);
            that.photo = f;
            that.files = url;
            }
    },
    btnClick:function(){
         this.error = ''
        var data = new FormData();
         this.book.name?data.append("name",this.book.name):this.error='请添加书名';
         this.book.author?data.append("author",this.book.author):this.error='请添加书的作者';
         this.book.price?data.append("price",this.book.price):this.error='请添加书的价格';
         this.book.summary?data.append("summary",this.book.summary):this.error='请添加书的简介';
         this.photo?data.append("img",this.photo):this.error='请给书添加封面';   
         if(this.error){
            return
         }else{
            this.$http.post(`/server/shop/add`,data,{
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then((data)=>{
                if(data.data.error == 0){
                    alert('添加成功')
                }
            })
         }

 
    },
  },
  mounted:function(){
    this.$http({
          method:'GET',
          url:'/server/users/session',
          data:''
      }).then((data)=>{
      if(data.data.error == 0 && data.data.data.isguan == true){
            
      }else{
          alert('您没有权限')
        this.$router.push({path:'/'})
      }
    }).catch((err)=>{
        console.log(err)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.geren{
  background:#fff;
  padding-top:15px;
  text-align:center;
  width:100%;
}
.geren input{
  padding:5px 3px;
  width:60%;
}
.geren textarea{
  padding:5px 3px
}
.geren section{
  overflow:hidden;
  width:90%;
  margin:0 auto;
}
.geren span{
  float:left;
}
  #root{
    height:calc(100vh - 50px);
    overflow-y: scroll;
    background-color: white;
  }
  #white{
    margin:8px;
    padding:8px 15px;
    background-color:#F5F5F5;
}
#white span{
    font-size:14px;
    text-align:center;
    color:#29B0FA;
}
#white input{
    margin-left:6px;
    height:36px;
    width:240px;
    border:none;
    font-size:11px;
}
#white input:nth-of-type(1){
    border-bottom:solid 1px #dddddd;
}
#top,.bottom{
    height:36px;
    line-height:36px;
}
 #file-selector{
    display: none;
}
#file-label{
    height: 267px;
    width:200px;
    display: block;
    margin:0 auto;
    font-size: 80px;
    text-align: center;
    line-height: 100px;
    vertical-align: top;
    border-radius:50%;
}

.images{
    width:200px;
    height: 267px;
    margin-right: 6px;
}
#root>label{
    font-size:14px;
    color:#29B0FA;
}
#btn{
    width:100%;
    text-align:center;
    margin:40px 0;
}
#btn button{
    color:white;
    background-color:#FF3C3C;
    border:none;
    width:290px;
    height:45px;
    border-radius:5px;
}

</style>

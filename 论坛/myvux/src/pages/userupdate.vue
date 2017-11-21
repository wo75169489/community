<template>
    <div id="root">
        <div id="img-list">
        <div class="geren">
            <label for="file-selector" id="file-label"><img  :src="files" class="images"></label><br><br>
            名字：<input type="text" v-model="user.name"><br><br>
            <section>
             <span>签名：</span><textarea v-model="user.motto" name="" id="" cols="30" rows="3"></textarea>
           </section>
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
        user:[],
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
        var data = new FormData();
            if(this.files != 'server/images/' + this.user.img){
               data.append("img",this.photo);
            }
            data.append("name",this.user.name)
            data.append("motto",this.user.motto)
            data.append("_id",this.user._id)
         this.$http.post(`/server/users/update`,data,{
            headers: {
                 "Content-Type": "multipart/form-data"
            }
        }).then((data)=>{
            if(data.data.error == 0){
                alert('修改成功')
                this.$router.push({path:`/userbj?id=${data.data.data._id}`})
            }
        });
 
    },
  },
  mounted:function(){
    this.$http({
          method:'GET',
          url:'/server/users/session',
          data:''
      }).then((data)=>{
      if(data.data.error == 0){
        this.user = data.data.data
        this.files ='server/images/' + this.user.img
      }else{
        this.$router.push({path:'/login'})
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
  padding:5px 3px
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
    height:calc(100vh - 120px);
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
    height: 29vw;
    display: block;
    font-size: 80px;
    text-align: center;
    line-height: 100px;
    vertical-align: top;
    border-radius:50%;
}

.images{
    width: 29vw;
    height: 29vw;
    margin-right: 6px;
    border-radius:50%;
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

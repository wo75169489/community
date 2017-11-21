<template>
  <div>
    <homeheader></homeheader>
    <homecheck></homecheck>
    
    <div v-show="isShow1" class="createA">
        <p><span @click="isShow1 = false; isShow2 = false"  class="cha">×</span><span>提问</span><button @click="isShow1 = false; isShow2 = true" class="next" :disabled="!canShow">下一步</button></p>
        <form style="margin-top:10px;">
           <input type="text" v-model="createq.title" @input="titleA($event)"  placeholder="请输入问题标题">
           <div style="height:15px;text-align:center;font-size:14px;color:red" v-if="!canShow && createq.title != ''"><span>你的问题也太短了吧。。</span></div>
           <textarea v-model="createq.content"  placeholder="补充问题描述">
         </textarea>
        </form>
    </div>
    <div v-show="isShow2" class="createB">
     <p><i @click="isShow1 = true; isShow2 = false" class="cha  fa fa-arrow-left"></i><span>添加话题</span><button @click="submit" class="next" :disabled="!createq.tags.length">完成</button></p>
     <section class="search">
     <input v-model="search" @input="searcht" type="text" placeholder="搜索并添加话题"><i class="fa fa-search"></i>
     </section>
     <section style="padding:20px;">
         <h4>热门标签：</h4>
         <span style="padding:5px 10px;line-height:40px;background:rgb(52,111,173);margin:5px;color:#fff;" @click="add($event)" v-for="tag in hottags">{{tag}}</span>
     </section>
     <section style="padding:20px;">
         <h4>搜索标签：</h4>
         <span style="padding:5px 10px;line-height:40px;background:rgb(52,111,173);margin:5px;color:#fff" @click="add($event)" v-for="tag in tags">{{tag}}</span>
     </section>
     <section style="padding:20px;">
         <h4>已添加的标签：</h4>
         <span style="padding:5px 10px;line-height:40px;background:rgb(52,111,173);margin:5px;color:#fff" @click="remove(index)" v-for=" (tag,index) in createq.tags">{{tag}}</span>
     </section>
    </div>
    <button @click="update">
        数据更新
    </button>
  </div>
</template>

<script>
import bus from '../bus.js'
import homeheader from './../components/homeheader'
import homecheck from './../components/homecheck'
export default {
  components: {
    homeheader,
    homecheck,
    bus,
  },
  data () {
    return {
        isShow1:false,
        search:'',
        isShow2:false,
        canShow:false,
        tags:[],
        hottags:['美食','情感','科技','影视'],
        createq:{
          title:'',
          content:'',
          tags:[],
        }
    }
  },
  methods:{
    titleA:function(ev){
      if(this.createq.title.trim().length > 2){
        this.canShow = true
      }else{
        this.canShow = false
      }
    },
    submit:function(){
      let that = this
       this.$http({
          method:'POST',
          url:`/server/article/create`,
          data:this.createq
         }).then((data)=>{
            if(data.data.error == 0){
              alert(data.data.message)
              this.$router.push({path:`/read?id=${data.data.data}`})
            }else{
              alert(data.data.message)
            }
         })
    },
    searcht:function(){
      var that = this
       this.$http({
          method:'GET',
          url:`/server/users/search?tags=${this.search}`,
          data:''
         }).then((data)=>{
           that.tags = data.data.data
         })
    },
    add:function(ev){
      if(this.createq.tags.indexOf(ev.target.innerText) == -1){
        this.createq.tags.push(ev.target.innerText)
      }
    },
    remove:function(ins){
      this.createq.tags.splice(ins,1)
    },
    update:function(){
      this.$http({
          method:'GET',
          url:`/server/article/ffff`,
          data:''
         })
    }
},
  mounted:function(){
    let that = this
    bus.$on('isShow',function(item){
      if(item){
        that.isShow1 = item
      }
    })
  }
}
</script>

<style scoped>
.createA,.createB{
  position:fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
  background:#fff;
  z-index:99999;
}
.createA>p{
  overflow:hidden;
  line-height:30px;
  box-shadow: 0px 3px 4px #888;
  padding:5px 10px;
}
.createA>form{
   padding:5px 10px;
}
.createB>p{
  overflow:hidden;
  line-height:30px;
  box-shadow: 0px 3px 4px #888;
  padding:5px 10px;
}
.createA>p .cha{
  font-size:26px;
}
.createB>p .cha{
  font-size:18px;
  margin-right:20px;
}
.createA>p span{
  font-size:18px;
  margin-right:20px;
}

.createA>p .next{
  float:right;
  border:none;
  background:#fff;
  font-size:16px;
  line-height:30px;
}
.createA input{
  width:100%;
  line-height:30px;
  font-size:16px;
  border:none;
  border-bottom:solid 1px rgb(210,210,210);
  padding:0 3px
}
.createB>p .next{
  float:right;
  border:none;
  background:#fff;
  font-size:16px;
  line-height:30px;
} 
.createB .search{
  width:80%;
  margin:0 auto;
  padding:10px 0;
}
.createB .search{
  position:relative;
}
.createB .search>input{
  width:100%;
  line-height:26px;
  font-size:14px;
  padding-left:30px;
  border:none;
  border-bottom:solid 1px rgb(210,210,210);
}
.createB .search>i{
  position:absolute;
  left:10px;
  top:15px;
}
.createA textarea{
  width:100%;
  height:500px;
  margin-top:10px;
  border:none;
  padding:3px 
}
</style>
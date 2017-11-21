<template>
  <div>
     <div class="head">
        <span style="width:10%" @click="tui"><i class="fa fa-arrow-left"></i></span>
        <span class="title" style="width:70%">购物车</span>
    </div>
    <div style="margin-top:55px">
       <section class="shop" v-for="shop in shopCart">
           <input name="check" @click="show($event,shop)" type="checkbox"><img :src="'/server/images/'+shop.img" alt="">
            <section>
                  <p style="height:40px;overflow:hidden;">{{shop.name}}</p>
                  <p style="color:rgb(223,44,88)"> ￥ {{ shop.price}}</p>
                  <p style="color:rgb(176,144,18)">总价：{{shop.price * shop.num}}</p>
            </section>
            <div class="zj">
                <button @click="zj(shop,'-1')">-</button><span>{{shop.num}}</span><button @click="zj(shop,'1')">+</button>
            </div>
           <div class="shan">
                <button @click="remove(shop.id)">删除</button>
           </div>
       </section>
    </div>
    <div class="foot">
     <section class="check">
        <input @click="allshow($event)" v-model="all" type="checkbox">
        <span v-if="!all">全选</span>
        <span v-else>全不选</span>
    </section>
        <section class="gou">
        <span>总价:{{zong}}</span>
            <button :disabled="!shop.length" :class="{'can':shop.length}" @click="show1 = true">立即付款</button>
            <actionsheet v-model="show1" :menus="menus1" :close-on-clicking-mask="false" @on-click-menu="goua" show-cancel ></actionsheet>
        </section>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { Actionsheet } from 'vux'
export default {
  components: {
      Actionsheet
  },
  data () {
    return {
      user:[],
      shopCart:[],
      shop:[],
      all:false,
      rshow:false,
      show1:false,
      menus1: {
        menu1: '支付宝支付',
        menu2: '微信支付',
        menu3: '余额支付',
      },
    }
  },
  methods:{
      tui:function(){
          window.history.back()
      },
      show:function(ev,id){
          if(ev.target.checked){
              this.shop.push(id)
              if(this.shop.length == this.shopCart.length){
                  this.all = true
              }
          }else{
              this.shop.splice(this.shop.indexOf(id),1)
              this.all = false
          }
      },
      allshow:function(ev){
         if(ev.target.checked){
             this.shop = []
             this.shopCart.forEach((item)=>{
                 this.shop.push(item)
             })
            for(let i=0;i<this.shopCart.length;i++){
              $('input[name=check]')[i].checked = true
            } 
         }else{
             this.shop = []
             for(let i=0;i<this.shopCart.length;i++){
              $('input[name=check]')[i].checked = false
            } 
         }
      },
      chushi:function(){
        let that = this
        this.$http({
        method: 'GET',
        url: '/server/users/session',
        data: '',
        }).then((data)=>{
            if(data.data.error == 0){ 
              that.user = data.data.data
              that.shopCart = data.data.data.shopCart
         }else{
             this.$router.push({path:'/login'})
            }
         })
     },
      goua:function(){
         let that = this
         this.$http({
              method:'Post',
              url:`/server/shop/shoping`,
              data:this.shop,
            }).then((data)=>{
                if(data.data.error == 0){
                    alert('支付成功')
                    this.chushi()
                    this.shop.forEach((item)=>{
                        that.$http.get(`server/shop/addread?id=${item.id}`).then((data)=>{

                        })
                    })
                    this.shop = []
                }
            })
      },
      remove:function(id){
         this.$http.get(`/server/users/shopremove?id=${id}`).then((data)=>{
            if(data.data.error == 0){
                this.chushi()
                alert('删除成功')
                this.shop.splice(this.shop.indexOf(id),1)
            }
         })
      },
      zj:function(ev,num){
          if(ev.num <= 1 && num == '-1'){
           return alert('不能再减少了')
          }else if(ev.num >= 10 && num == '1'){
            return  alert('该商品限购10本')
          }else{
            this.$http.get(`server/shop/zj?id=${ev.id}&num=${num}`).then((data)=>{
                if(data.data.error == 0){
                    this.shop.forEach((item)=>{
                        if(item.id == ev.id){
                            item.num += Number(num)
                        }
                    })
                   this.user = data.data.data
                   this.shopCart = data.data.data.shopCart
                }
            })
          }
      }
  },
  mounted:function(){
      this.chushi()
  },
  computed:{
      zong:function(){
         let a = 0
         this.shop.forEach((item)=>{
           a += Number(item.price * item.num)
         })
         return a.toFixed(2)
      } 
  },
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
    border-bottom:solid 1px rgb(200,200,200)
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
  .foot {
    line-height:30px;
    height:50px;
    background:#fff;
    overflow:hidden;
    position:fixed;
    width:100%;
    bottom:0;
    z-index:99999;
    box-sizing:border-box;
    border-top:solid 1px rgb(200,200,200);
    padding:10px;
}
.shop{
    padding:10px;
    background:#fff;
    margin:5px 0;
    overflow:hidden;
}
.shop>input{
    height:80px;
    margin:0 10px;
    float:left;
    
}
.shop img{
    width:60px;
    height:80px;
    float:left;
}
.shop>section{
    display:inline-block;
    width:30%;
    margin: 0 10px;
    font-size:12px;
    float:left;
    overflow:hidden;
}
.shop>section span{
    background:#fff;

}
.shop .zj{
    float:left;
    width:20%;
    border:none;
    padding-top:30px;
}
.shop .zj>span{
    display:inline-block;
    width:20px;
    text-align:center
}
.shop .zj button{
    width:22px;
}
.shop .shan{
    float:left;
    margin: 0 5px;
    padding-top:30px;
}
.shop>.shan>button{
    padding:2px 8px;
    border:none;
    background:rgb(170,170,150);
    color:#fff
}
.foot .check{
    float:left;
    font-size:14px;

}
.foot .check input{
    margin:0 10px;
}
.foot .gou{
    float:right;
}
.foot .gou button{
    border: none;
    background:#fff;
    padding:2px 8px;
    border:solid 1px rgb(160,160,160);
    border-radius:3px;
}
.foot .gou .can{
   border:solid 1px rgb(190,50,30);
    color:rgb(190,50,30);
}
</style> 
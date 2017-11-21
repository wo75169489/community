import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        mydata: '',
        data2: '第二个数据',
        data3: '第三个数据',
        articles:[[],[],[]],
    },
    mutations:{
        dongtai:function(state,data){
               state.articles[0] = data
        }
    },
    actions:{
        calc:function(state){
             axios.get('/server/article/show').then((data)=>{
             state.commit('dongtai',data.data)
         })
      }
   }
})
export default store
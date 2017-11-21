<template>
  <div class="homeheader">
    <div>
    <section>
    <search
     @on-change="getResult" placeholder="我叫MT" position="absolute" :results="results"   ref="search"
     style="width:100%;"
     >
     <span slot="right" style="padding:0 5px;color:#999" @click="show" > <i class="fa fa-book"></i> 提问</span>
     </search>
    </section>   
  </div>
  </div>
</template>

<script>
import bus from '../bus.js'
import { Search,Group, Cell } from 'vux'
export default {
  components: {
  Search,
  Group, 
  Cell
  },
  data () {
    return {
        results: [],
    }
  },
  methods:{
      getResult (val) {
            
    },
   show:function(){
      bus.$emit('isShow',true);
      }
  } 
}
</script>

<style>

</style>
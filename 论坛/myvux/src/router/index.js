
// 导入vue
import Vue from 'vue'

// 导入路由
import VueRouter from 'vue-router'

// 导入路径所对应的组件
import Home from '../pages/home'
import Login from '../pages/login.vue'
import User from '../pages/user.vue'
import Read from '../pages/read.vue'
import Anwser from '../pages/anwser.vue'
import Com from '../pages/comment.vue'
import Userbj from '../pages/userbj.vue'
import Addbook from '../pages/addbook.vue'
import Shopbook from '../pages/shopbook.vue'
import Message from '../pages/message.vue'
import All_book from '../pages/all_book.vue'
import userupdate from '../pages/userupdate.vue'
import Bookj from '../pages/bookj.vue'
import shopCart from '../pages/shopCart.vue'
import Shop from '../pages/shop.vue'
import Pay from '../pages/pay.vue'
import Pay_question from '../pages/pay_question.vue'
import Pay_answer from '../pages/pay_answer.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: Home
},
{
  path: '/login',
  component: Login
},
{
  path: '/pay',
  component: Pay
},
{
  path: '/pay/question',
  component: Pay_question
},
{
  path: '/pay/answer',
  component: Pay_answer
},
{
  path: '/user',
  component: User
},
{
  path: '/shopCart',
  component: shopCart
},
{
  path: '/userbj',
  component: Userbj
},
{
  path: '/bookj',
  component: Bookj
},
{
  path: '/all_book',
  component: All_book
},
{
  path: '/message',
  component: Message
},
{
  path: '/addbook',
  component: Addbook
},
{
  path: '/shop/book',
  component: Shopbook
},
{
  path: '/user/update',
  component: userupdate
},
{
  path: '/read',
  component: Read
},
{
  path: '/shop',
  component: Shop
},
{
  path: '/anwser',
  component: Anwser
},
{
  path: '/comment',
  component: Com
},
]

export default new VueRouter({
  routes
})
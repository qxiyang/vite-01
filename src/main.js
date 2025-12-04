import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//调用路由守卫
router.beforeEach((to,form)=>{
    const token = localStorage.getItem('pz_token')
    //非登录页面并且token不存在
    if(!token&&!to.path == '/login') return '/login'
    //token存在时访问login
    if(token&&to.path === '/login') return '/'
    return true

})
const app = createApp(App)
for(const [key,component] of Object.entries(ElementPlusIconsVue)){//vuex配置
    app.component(key,component)
}
  
app.use(router)//挂载路由-------11.29

app.use(store)//挂载变化实例------11.30   
app.mount('#app')

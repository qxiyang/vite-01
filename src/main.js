import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import api from './api'//引入api

const app = createApp(App)


//在实例上绑定属性
app.config.globalProperties.$api = api
//如果没有token就在登录页面
router.beforeEach((to,form) => {
    console.log('1')
    const token = localStorage.getItem('h5_token')
    if(to.path !== '/login'){
        console.log('3')
        if(!token){
            console.log('4')
            return '/login'
        }
    }else{
        console.log('2')
        return 
    }
})
//挂载路由
app.use(router)
app.mount('#app')

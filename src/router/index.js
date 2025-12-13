import {createRouter, createWebHashHistory,} from 'vue-router'
import Layout from '../views/Main.vue'
import Login from '../views/login/index.vue'
import Admin from '../views/auth/admin/index.vue'
import Group from '../views/auth/group/index.vue'
import Order from '../views/vppz/order/index.vue'
import Staff from '../views/vppz/staff/index.vue'
import Dashboard from '../views/dashboard/index.vue'
// import { isArray } from 'element-plus/es/utils/types.mjs'
// import { reactive } from 'vue'
// import { Children } from 'react'
// import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'

const routes = [
    {
        path : '/',//主菜单
        component : Layout,
        name : 'main',
        reactive:to => {
            if(localData){//有子菜单的情况
                const children = JSON.parse(localData).menu.routerList[0].children
                if(children){
                    return children.meta.path
                }else{//无子菜单的情况
                    return SON.parse(localData).menu.routerList[0].meta.path
                }
            }else{//无缓存的情况,跳转到登录
                return '/login'
            }   
        },
        //在完成动态路由后就不需要写死的
        children : [//children代表嵌套路由，用于实现跳转路由时，主菜单的东西不变
            // {
            //     path : 'dashboard',//二级菜单 1
            //     meta : {id : '1',name  :  '控制台',icon : 'Platform',path : '/dashboard',describe : '展示系统的统计数据、统计报表及实时数据'},
            //     component : Dashboard
            // },
            // {
            //     path : 'auth',//二级菜单 2
            //     meta : {id : '2',name : '权限管理',icon : 'Grid'},
            //     children : [
            //     {
            //         path : 'admin',//三级菜单 2_1
            //         meta : {id : '1',name  :  '账号管理',icon : 'Avatar',path : '/auth/admin',describe : '管理员可以进行bianji,权限修改后需要登出才会生效'},
            //         component : Admin
            //     },
            //     {
            //         path : 'group',//三级菜单 2_2
            //         meta : {id : '2',name  :  '菜单管理',icon : 'Menu',path : '/auth/group',describe : '菜单通常对应着一个控制器的方法,同时菜单栏数据也从规则中获取'},
            //         component : Group
            //     },
            //     ]
            // },
            // {
            //     path : 'vppz',//二级菜单 3
            //     meta : {id : '3',name : 'DIDI陪诊',icon : 'BellFilled'},
            //     children : [
            //     {
            //         path : '',//三级菜单 3_1
            //         alias : ['staff'],
            //         meta : {id : '1',name  :  '陪护管理',icon : 'Checked',path : '/vppz/staff',describe : '陪护师可以进行创建和修改,设置对应生效状态控制c端选择'},
            //         component : Staff
            //     },
            //     {
            //         path : 'order',//三级菜单 3_2
            //         meta : {id : '2',name  :  '订单管理',icon : 'List',path : '/vppz/order',describe : 'c端下单后可以查看所有订单状态,已支付的订单可以完成陪护状态修改'},
            //         component : Order
            //     },
            //     ]
            // },
        ]
    },
    {
        path : '/login',//登录页面
        component : Login,
    },
]

const router = createRouter({
    // 路由数据
    routes,
    //路由匹配模式
    history : createWebHashHistory()
})
// console.log(isArray(routes))//routes是数组类型
export default router
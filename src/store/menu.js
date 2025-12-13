const localData = localStorage.getItem('pz_pz')
//用于存储状态
const state = localData ? localData.menu :{
    isCollapse:false,//默认不收起
    selectMenu:[],
    routerList:[],
    menuActive:'1-1'
}
const mutations ={//更改 Vuex 的 store 中的状态的唯一方法是提交 mutation---11.30
    collapseMenu (state){
        state.isCollapse = !state.isCollapse
    },
    addMenu (state,payload){
        //去掉重复点击
        if(state.selectMenu.findIndex((item) => item.path === payload.path) === -1){ //如果获取到的数据不等于传入的数据（也就是上次点击所获取的数据）
            state.selectMenu.push(payload)//就添加进payload
        }
    },
    closeMenu (state,payload){
        //找到要删除菜单的索引
        const index = state.selectMenu.findIndex((item) => item.name === payload.name)
        // state.selectMenu.splice(state.selectMenu[index],1)
        // 当 index 有效时，state.selectMenu[index] 是数组元素（比如对象 {path: '/a', ...}），
        // 会被转为 NaN，splice(NaN, 1) 等价于 splice(0, 1)，直接删除第一个元素！
        state.selectMenu.splice(index,1)//删除对应数组的1个数据
    },
    dynamicMenu (state,payload){
        //通过glob导入文件
        const modules = import.meta.glob('../views/**/**/*.vue')//拿到views文件夹下面的所以二级目录的所有vue文件
        // console.log(modules)
        //用modules拼接成完整的路由
        function routerSet(router) {//定义函数，router只是形参
            router.forEach( route => {
                //如果没有子文件,也就是没有children属性,具体可以在控制台打印查看modules具体的属性有什么
                if( !route.children){
                    const url = `../views${route.meta.path}/index.vue`//拼接文件地址
                    //拿到获取的vue组件
                    route.component = modules[url]
                }else {//如果有子文件，就将当前文件的子文件作为遍历对象，递归调用
                    routerSet(route.children)
                }
            });
        }
        //payload才是实际参数
        routerSet(payload)
        //拿到完整的路由数据
        state.routerList = payload

    },
    updataMenuActive(state,payload){
        state.menuActive = payload
    }
}
//导出变化------11.30
export default {
    state,
    mutations
}
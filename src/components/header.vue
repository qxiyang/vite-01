<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"><!--通过conmmit方法触发mutation-->
        <Fold /></el-icon>
        <ul class="flex-box"><!--如果路由的路径（指的是网址栏的路径）与当前页面的路径相等就赋予selected标签-->
            <li v-for="(item,index) in selectMenu"
            :key="item.path"
            :class="{selected: route.path === item.path}"
            class="tab flex-box">
            <el-icon size="12"><component :is="item.icon" /></el-icon><!--通过is属性来指定到对应的icon，之前icon的值对用了Element的icon文件名-->
            <router-link class="text flex-box" :to="{path:item.path}">
              {{ item.name }}
            </router-link>
            <el-icon class="close" size="12" @click="closeTap(item,index)"><Close /></el-icon>
          </li>
        </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick"><!--在这里使用click不生效，所以采用@command-->
        <el-button class="el-dropdown-link flex-box">
            <el-avatar 
              :src="userInfo.avatar">
            </el-avatar>
            <p class="username">{{ userInfo.name }}</p>
        </el-button>
        <template #dropdown><!--更推荐使用这种写法,而不是官方文档的写法-->
          <el-dropdown-item command="cancel">退出</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRoute } from 'vue-router';//获取当前路由的实例
import { useRouter } from 'vue-router';//获取所有路由的实例
const store = useStore()//拿到store实例----11.30
const selectMenu = computed(()=>store.state.menu.selectMenu)//通过实例拿到数据
const route = useRoute()
const router = useRouter()
const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))
const closeTap = (item,index) => {
  store.commit('closeMenu',item)//关闭页面tap
  //如果是不是当前页面的tap
  if(route.path!==item.path) {return} //直接返回
  const selectMenuData = selectMenu.value//记录数据，防止删除时冲突
  
  console.log(selectMenuData.length)//控制台查询bug

  if(index===selectMenuData.length){  //如果当前页面是末尾tap

    console.log("selectMenuData.length等于index")//控制台查询bug
    if(!selectMenuData.length){   //如果当前是唯一tap

      console.log("回到主菜单")//控制台查询bug
      router.push('/')//回到主菜单


    }else{//如果不是,tap变成前面的菜单，路由也更新为前面的路由

      console.log("变成前面的菜单")//控制台查询bug
      console.log({path:selectMenuData[index-1].path})//控制台查询bug

      router.push({//参数为对象，所以用{}
      path:selectMenuData[index-1].path
      })
    }
  }else{//如果是中间的，tap为后面的菜单，路由为后面的路由

      console.log({path:selectMenuData[index].path})//控制台查询bug
      
      router.push({//参数为对象，所以用{}
      path:selectMenuData[index].path
  })
} 
}
// console.log(typeof(closeTap))//function
//退出
const handleClick = (command) => {
  if( command === 'cancel' ){//如果点击的是退出按钮
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userinfo')
    
    window.localStorage.href = window.localStorage.origin
  }
}
</script>

<style lang = 'less' scoped>
  .flex-box{
    display: flex;
    align-items: center;
    height: 100%;
  }
  .header-container{
    display: flex;
    width: 100%;
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding-right: 25px;
    .header-left{
      height: 100%;
      .icon{
        width: 45px;
        height: 100%;
      }
      .icon:hover{//(伪类)鼠标悬停触发-----11.30
        background:#f5f5f5;
        cursor: pointer;
      }
      .tab{
        padding: 0;
        height: 100%;
        .text{
        margin: 0 5px;
        }
        .close{
          visibility: hidden;
        }
        &.selected{//同级标签：如果存在同级的标签就有以下样式
          a {
              color: #409eff;
          }
          i {
              color: #409eff;
          }
          background-color: #f5f5f5;
        }
      }
      .tab:hover{
          background:#f5f5f5;
        .close{ 
          visibility: inherit;
          cursor: pointer;
          color: black;
        }
      }
    }
    .header-right{
      .username{
        margin-left: 10px;
      }
    }
    a{
      height: 100%;
      color: #333;
      font-size: 15px;
    }
  }
</style>

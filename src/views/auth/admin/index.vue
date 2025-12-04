<template>
      admin
      <RouterView />
</template>

<script setup>
import { authAdmin } from '../../../api';
import { reactive,onMounted } from 'vue';//onMounted钩子函数
const paginationData = reactive({//创建对象作为authAdmin参数，通过文档查看get的参数需要对象
      pageNum: 1,
      pageSize: 10
})
onMounted(()=>{
      authAdmin(paginationData).then((data)=>{
            console.log('data',data)
      })
})
</script>
<style lang = 'less' scoped>
</style>
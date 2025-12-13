<template>
    <h1 >{{ tap? '登录' : '注册' }}</h1>
    <van-button position="right" type="primary" @click="change">{{ !tap? '登录' : '注册' }}</van-button>
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field  
                v-model="form.userName"
                name="用户名"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
                v-model="form.passWord"
                type="password"
                name="密码"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
        </van-cell-group>
        <div class="bts">
        <van-button round block type="primary" native-type="submit"><!--submit点击时触发表单提交-->
            提交
        </van-button>
        </div>
    </van-form>
</template>
<script setup>
import { ref,reactive,onMounted, getCurrentInstance } from 'vue';//钩子函数
import { useRouter } from 'vue-router';
//获取vue实例
const {proxy} = getCurrentInstance()
onMounted(() => {//生命周期函数
});
const username = ref('');
const password = ref('');
const tap = ref(1);
const router = useRouter();
const form = reactive({
    userName: '',
    passWord: ''
});
const onSubmit = async() => { 
    const {data} = await proxy.$api.login(form)//不使用then的写法
    if(data.code === 10000){
        localStorage.setItem('h5_token',data.data.token)//将token存储在浏览器缓存
        localStorage.setItem('h5_userInfo',JSON.stringify(data.data.userInfo))
        router.push('/home')
    }
}
const change = () => {
    tap.value = !tap.value;
}
</script>
<style lang="less" scoped>
h1{
    text-align: center;//文本居中
}
.bts{
    margin: 15px;//15像素外边距
}
</style>
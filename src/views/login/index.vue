<template>
    <el-row  class="login-container" justify="center" :align="'middle'"><!--要求放在中间，选择row三格布局,后面两个是三格的属性-->
      <el-card style="max-width: 480px">
        <template #header>
          <div class="card-header">
            <img :src="imgUrl" alt=""></img>
          </div>
        </template>
        <div class="jump-link" >
          <el-link type="primary" @click="handleChange">{{ formType ? '登录' : '注册' }}</el-link><!--使用el-link组件完成超链接效果-->
        </div>
        <el-form 
        ref="loginFormRef" 
        :rules="rule"
        :model="loginForm" 
        class="demo-ruleForm"
        style="max-width: 600px;">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" placeholder="请输入手机号" :prefix-icon="UserFilled"><!--使用v-model进行数据的双向绑定--></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input v-model="loginForm.passWord" type="passWord" placeholder="请输入密码" :prefix-icon="Lock"><!--密码不可见，设置type为passWord--></el-input>
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input v-model="loginForm.validCode" placeholder="请输入验证码" :prefix-icon="UserFilled">
            <template #append >
              <span @click="countDownChange">{{countDown.text}}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{width:'100%'}" @click="submitForm(loginFormRef)">
            {{ formType ? '注册' : '登录' }}
          </el-button>
        </el-form-item>
        </el-form>
      </el-card>
    </el-row>
</template>

<script setup>
import { UserFilled, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref,reactive } from 'vue';
import { getCode,userAuthentication,login } from '../../api';
import { useRouter } from 'vue-router';

const imgUrl = new URL('../../public/login-head.png', import.meta.url).href
//0登录，1注册
const  formType = ref(0)
const handleChange = () => {
  formType.value = !formType.value// ? 0 : 1
}
const loginForm = reactive({
  userName: '',
  passWord: '',
  validCode: ''
})
const countDown = reactive({
  text :"验证码",
  time :60
})
//指定规则
const validateUser = (rule,value,callback)=>{
  if(value===''){
    callback(new Error("请输入账号"))
  }else{
    //账号正则 
    const userReg = /^1(3[0-9]|4[01456789]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    userReg.test(value) ? callback() : callback("手机号格式不对")
  }
}
const validatePass = (rule,value,callback)=>{
  if(value===''){
    callback(new Error("请输入密码"))
  }else{
    //密码正则 
    const passReg = /^[a-zA-Z0-9_-]{4,16}$/
    passReg.test(value) ? callback() : callback(new Error("请输入4到16位含字母及字符的密码"))
}
}
// const validateValid = (rule,value,callback)=>{
//   if(value===''){
//     callback(new Error("请输入密码"))
//   }else{
//     value===k ? callback() : callback(new Error("验证码错误"))
//   }
// }
const loginFormRef = ref()
const router = useRouter()
const submitForm = async(formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(loginFormRef,'submit!')
      if(formType.value){
        userAuthentication(loginForm).then(({data})=>{
          if(data.code === 10000){// code是后端约定的「业务状态码」
            ElMessage.success("注册成功,请登录")
            formType.value = 1
            router.push('/')
          }
        })
      }else{
        login(loginForm).then(({data})=>{
          if(data.code === 10000){
            ElMessage.success("登录成功")
            //将用户信息和token保存到浏览器缓存里
            localStorage.setItem('pz_token',data.data.token)
            localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
            router.push('/')
          }
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const rule = reactive({
  userName:[{validator:validateUser,trigger:'blur'}],
  passWord:[{validator:validatePass,trigger:'blur'}],
  // validCode:[{validator:validateValidcode,trigger:'blur'}]
})
let flag = false
const countDownChange = ()=>{
  //如果已经点击了发送验证码就不能再带点击
  if(flag)return
  //创建正则实例
  const phoneReg = /^1(3[0-9]|4[01456789]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/ 
  //用正则判断手机号是否正确
  if(!loginForm.userName||!phoneReg.test(loginForm.userName)){
    console.log("用户名或密码不正确,请确认后再输入")//控制台有输出但是页面没有弹窗
    return ElMessage({
      message:"用户名或密码不正确,请确认后再输入",
      type : "warning"
    })
  }
  //倒计时
  const timer = setInterval(()=>{
    if (countDown.time<=0){
        countDown.text = "请再次发送"
        countDown.time = 60
        flag = false
        clearInterval(timer)
  }else{
        countDown.time -=1
        countDown.text = `还有${countDown.time}s`//模板字符串
  }
  },1000)//1s执行一次
  flag = true
  getCode({tel:loginForm.userName}).then(({data})=>{
    if(data.code === 10000){
      ElMessage.success('发送成功')
    }
  })
}
</script>

<style scoped>
:deep(.el-card__header) {
    padding: 0
  }
  .login-container {
    height: 100%;
    .card-header{
      background-color: #899fe1;
      img {
        width: 430px;
      }
    }
    .jump-link {
      text-align: right;
      margin-bottom: 10px;
    }
  }
  .flex-box{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

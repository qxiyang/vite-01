import axios from "axios";
import { ElMessage } from "element-plus";

const http = axios.create({
  baseURL: 'https://v3pz.itndedu.com/v3pz',
  timeout: 10000,//10s
  // headers: {'X-Custom-Header': 'foobar'}
});

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('pz_token')
    //不需要添加token的白名单
    const white = ["/get/code","/user/authentication","/login"]
    if(!white.includes(config.url)&&token){//如果不是白名单发起了token
      config.headers['x-token'] = token//待修改,个人认为应该用()视频用的[]-----属性为对象，js中用.和[]访问对象属性
    }
    // isArray(config.headers) ? console.log("array"): console.log(typeof(config.headers))
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
  // 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    //异常数据回应
    if(response.data.code === -1){
      ElMessage.warning(response.data.message)
    }
    //token错误
    if(response.data.code === -2){
      ElMessage.warning(response.data.message)
      localStorage.removeItem('pz_useInfo')//清除用户信息
      localStorage.removeItem('pz_token')//清除token
      
      window.location.href = window.location.origin//回到原页面
  }
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });

export default http
import axios from "axios";

const http = axios.create({
    baseURL: 'https://v3pz.itndedu.com/v3pz', // 替换为你的API基础URL
    timeout: 1000, // 请求超时时间
    headers: { 'terminal': 'h5' },//与管理系统区分
});

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('h5_token')
    //不需要添加token的白名单
    const white = ["/login"]
    if(!white.includes(config.url)&&token){//如果不是白名单发起了token
      config.headers['h-token'] = token
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
    }
    //token错误
    if(response.data.code === -2){
      localStorage.removeItem('h5_useInfo')//清除用户信息
      localStorage.removeItem('h5_token')//清除token
      window.location.href = window.location.origin//回到原页面
  }
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });

export default http
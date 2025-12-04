import request from "../utils/request.js";

//发送验证码
export const getCode = (data) => {
    return request.post('/get/code',data)//发送请求，参数从文档获取
}

//注册
export const userAuthentication = (data) => {
    return request.post('/user/authentication',data)//发送请求，参数从文档获取
}
//登录
export const login = (data) => {
    return request.post('/login',data)//发送请求，参数从文档获取
}
//权限管理
export const authAdmin = (pramas) => {
    return request.get('/auth/admin',{pramas})
}
import request from "../utils/request.js";

//发送验证码
export const getCode = (data) => {
    return request.post('/get/code',data)//发送请求，参数从文档获取
}


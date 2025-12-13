import request from '../untils/request';

export default {//换种写法，可以不用每次从api调用，直接挂载在main.js上,用对象的方式返回
    login(data){
        return request.post('/login',data)
    },
    //首页数据
    index(){
        return request.get('/Index/index')
    },
    //陪护师数据
    h5Companion(){
        return request.get('/h5/companion')
    },
    //验证订单
    createOrder(data){
        return request.post('/createOrder',data)
    },
    //订单列表
    orderList(params){
        return request.get('/order/list',{params})
    },
    //订单详情页
    orderDetail(params){
        return request.get('/order/detail',{params})
    }
}
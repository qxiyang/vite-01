<template>
    <div class="container">
        <div class="header">
            <van-icon @click="goBack" name="arrow-left" class="header-left" size="30"/>
            <div>填写服务单</div>
        </div>
        <StatusBar :item="stateMap[detailData.trade_state]"/>
        <div class="tips">
            <div class="dzf" v-if="detailData.trade_state === '待支付'">
                <div class="text1">订单待支付</div>
                <div class="text2">
                    请在<counter :second="timer"
                    />内完成支付,超时订单将取消
                </div>
                <div class="text3"> 
                    <van-button type="success" @click="open">立即支付</van-button>
                </div>
            </div>
            <div class="dzf" v-if="detailData.trade_state === '待服务'">
                <div class="text1">正在为您安排服务专员...</div>
                <div class="text2">请保持手机畅通,稍后将有服务专员与您联系</div>
            </div>
            <div class="dzf" v-if="detailData.trade_state === '已完成'">
                <div class="text1">服务已完成</div>
                <div class="text2">感谢您的使用,有售后问题请联系客服</div>
            </div>
            <div class="dzf" v-if="detailData.trade_state === '已取消'">
                <div class="text1">订单已取消</div>
                <div class="text2">期待下次为您服务,如需帮助可咨询客服</div>
            </div>
        </div>
        <van-cell-group class="card">
            <div class="header-text">预约信息</div>
            <van-cell v-for="(value,key) in makeInfo"
                :key="key"
                :title="value"
                :value=formData(key)
            />
        </van-cell-group>
        <van-cell-group class="card">
            <div class="header-text">订单信息</div>
            <van-cell v-for="(value,key) in orderInfo"
                :key="key"
                :title="value"
                :value=formData(key)
            />
        </van-cell-group>
        <!--微信支付码弹窗-->
        <van-dialog v-model:show="showCode" :showConfirmButton="false">
          <van-icon name="cross" class="close" @click="closeCode"/>
          <div>微信支付</div>
          <van-image height="150" width="150" :src="codeImage"/> 
          <div>请使用本人微信扫码</div>
        </van-dialog>
    </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import StatusBar from '../../components/statusBar.vue';
import { ref,getCurrentInstance, onMounted, reactive, computed } from 'vue';
import counter from '../../components/counter.vue'
import Qrcode from 'qrcode'
 
onMounted( async () => {
    const {data} = await proxy.$api.orderDetail({oid : route.query.oid})
    // data.data.timer = data.data.order_start_time+9200000-Date.now()老师换了一种写法
    Object.assign(detailData,data.data)
    console.log(detailData)
})
//存储详情页数据
const detailData = reactive({})
//封装对象用于枚举表单状态
const stateMap = {
    //左边是键key，右边是值value
    '待支付':10,
    '待服务':20,
    '已完成':30,
    '已取消':40
}
//用键和值表示表单的信息和用户数据
const makeInfo = {
    //键可以随便写，但是初始化的值不能随便写
    //左边是键key，右边是值value
    service_name:'预约服务',
    hospital_name:'就诊医院',
    starttime:'期望就诊时间',
    'client.name':'就诊人',
    'client.mobile':'就诊人电话',
    receiveAddress:'接送地址',
    demand:'其他需求'
}
const orderInfo = {
    //左边是键key，右边是值value
    tel:'联系电话',
    order_start_time:'下单时间',
    price:'应付金额',
    out_trade_no:'订单编号',
    '疑问或投诉':''
}
//对表单的数据处理
const formData = (key) => {
    console.log(key)
    if(key.indexOf(".") === -1){
        //如果属性是时间，就执行该方法
        if(key === "order_start_time"){
            return formTimestamp(detailData[key])
        }
        return detailData[key]
    }
    let arr = key.split(".").reduce((o,p) => {
        return (o||[])[p];
    },detailData)
    return arr
}
//处理日期
function formTimestamp(timestamp){
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth()+1).padStart(2,"0");//月份从0开始,所以需要+1
    const day = String(date.getDate()).padStart(2,"0")

    return `${year}-${month}-${day}`;
}
const route = useRoute()
// console.log(route)
const {proxy} = getCurrentInstance()
const router = useRouter()
//返回上一页
const goBack = () => {
    router.go(-1)
}
//倒计时
const timer = computed(() => {
    return detailData.order_start_time+9200000-Date.now() ?
    detailData.order_start_time+9200000-Date.now() : 0
})
//打开弹窗
const open = () =>{
    showCode.value = true
    //将url转为二维码，老师是写在生命周期函数的，一条跳转到页面就会生成 
    Qrcode.toDataURL(detailData.code_url).then((url) => {
    codeImage.value = url
})
}
//弹窗开关属性
const showCode = ref(false)
//关闭弹窗
const closeCode = () => {
    showCode.value = false
}
//二维码
const codeImage = ref('')
//将url转为二维码
// console.log(codeImage)
</script>
<style lang="less" scoped>
    .container {
    background-color: #f0f0f0;
    height: 100vh;
  }
  .header {
    background-color: #fff;
    line-height: 40px;
    text-align: center;
    .header-left {
      float: left;
    }
  }
  .card {
    margin: 15px 0;
    padding: 10px;
    .header-text {
      padding-left: 5px;
      line-height: 30px;
      font-size: 16px;
      font-weight: bold;
      border-left: 4px solid red;
    }
  }
  .dzf {
    padding: 20px;
    .text1 {
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
      color: #666;
    }
    .text2 {
      font-size: 14px;
      color: #666;
    }
    .text3 {
      text-align: center;
      .van-button {
        margin-top: 10px;
        margin-left: 10px;
        width: 80%;
        font-weight: bold;
      }
    }
  }
  ::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;
    .close {
      position: absolute;
      left: 20px;
    }
  }
</style>
<template>
    <div class="container">
      <van-cell>
        <div class="header">我的订单</div>
          <van-tabs v-model:active="active" v-on:click-tab="clickTap">
            <van-tab title="全部" name=""/>
            <van-tab title="待支付" name="1"/>
            <van-tab title="待服务" name="2"/>
            <van-tab title="已完成" name="3"/>
            <van-tab title="已取消" name="4"/>
        </van-tabs>
      </van-cell>
      <van-row v-for="item in orderList"
          class="van-row"
          :key="item.id"
          v-model="orderList"
          @click="goDetail(item)"
        >
          <van-col span="5">
            <van-image :src="item.serviceImg" width="50" height="50" radius="5"/>
          </van-col>
          <van-col span="14">
            <div class="text1">{{item.service_name}}</div>
            <div class="text2">{{ item.hospital_name }}</div>
            <div class="text2">预约时间:{{ item.starttime }}</div>
          </van-col>
          <van-col  class="text2" span="5" :style="{color:colorMap[item.trade_state]}">
            <div >{{ item.trade_state}}</div>
            <counter :second="item.timer" v-if="item.trade_state === '待支付'"/>
          </van-col>
      </van-row>
      <div class="bottom-text">没有更多了</div>
    </div>  
</template>
<script setup>
import {ref,getCurrentInstance, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import counter from '../../components/counter.vue'

const router = useRouter()
onMounted((data) => {
    getOrderList({data})
})
const {proxy} = getCurrentInstance()
//tap栏
const active = ref("")
//订单数据
const orderList = ref([])
//跳转订单详情
const goDetail = (item) => {
  router.push(`/detail?oid=${item.out_trade_no}`)
}
//状态
const colorMap = {
  '待支付': '#ffa200',
  '待服务': '#1da6fd',
  '已完成': '#21c521'
}
//获取订单列表，因为要复用所以需要封装
const getOrderList = async(state) => {
    const {data} = await proxy.$api.orderList({state})
    data.data.forEach(item => {
      item.timer = item.order_start_time+7200000-Date.now()
    })
    orderList.value = data.data
    // console.log(orderList.value)
}
const clickTap = (item) => {
  getOrderList(item.name)
}
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
  }
  .van-row {
    background-color: #fff;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    .text1 {
      font-size: 16px;
      line-height: 25px;
      font-weight: bold;
    }
    .text2 {
      font-size: 14px;
      line-height: 20px;
      color: #999999;
    }
  }
  .bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
  }
</style>
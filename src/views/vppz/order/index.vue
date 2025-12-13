<template>
      <PanelHead />
      <div class="form">
            <el-form :inline="true" v-model="searchForm">
                  <el-form-item prop="out_trade_no">
                        <el-input :model="searchForm.out_trade_no" placeholder="搜索">
                        </el-input>
                  </el-form-item>
                  <el-form-item>
                        <el-icon @click="submit"><Search /></el-icon>
                  </el-form-item>
            </el-form>
      </div>
      <el-table :data="tableData.list">
            <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"></el-table-column>
            <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
            <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
            <el-table-column label="陪护师头像">
                  <template #default="scoped">
                        <el-image style="width: 40px;height: 40px;" :src="scoped.row.companion.avatar"/>
                  </template>
            </el-table-column>
            <el-table-column prop="tel" label="陪护师手机号" width="120"></el-table-column>
            <el-table-column prop="price" label="总价"></el-table-column>
            <el-table-column prop="paidPrice" label="已支付"></el-table-column>
            <el-table-column label="下单时间" width="120">
                  <template #default="scoped">
                        {{ scoped.row.starttime }}
                  </template>
            </el-table-column>
            <el-table-column label="订单状态" width="120">
                  <template #default="scoped">
                        <el-tag :type="statusMap(scoped.row.trade_state)">{{ scoped.row.trade_state }}</el-tag>
                  </template>
            </el-table-column>   
            <el-table-column prop="service_state" label="接单状态"></el-table-column>   
            <el-table-column prop="client.mobile" label="联系人手机号" width="120"></el-table-column>
            <el-table-column label="操作" fixed="right">
                  <template #default="scoped">
                        <el-popconfirm
                              v-if="scoped.row.trade_state === '待服务'"
                              cancel-button="否"
                              confrim-button="是"
                              :icon="InfoFilled"
                              @confirm="confirmEvent(scoped.row.out_trade_no)"
                        >
                              <template #reference>
                                    <el-button  type="primary" link>服务完成</el-button>
                              </template>
                        </el-popconfirm>
                        <el-button v-else type="primary" link disabled>暂无服务</el-button>
                  </template>
            </el-table-column>
      </el-table>
      <div class="pagination-info">
            <el-pagination
                  v-model:current-page="paginationData.pageNum"
                  :page-size="paginationData.pageSize"
                  size="small"
                  :background="background"
                  layout="total, prev, pager, next"
                  :total="tableData.total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
            />
      </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import { adminOrder,updateOrder } from '../../../api';
import { useRoute } from 'vue-router';
import { InfoFilled,Search } from '@element-plus/icons-vue';

onMounted(() => {
      //获取订单信息
      getListData()
})
const route = useRoute()
//分页数据
const paginationData = reactive({
      pageNum:1,
      pageSize:10
})
//列表数据
const tableData = reactive({
      list:[],
      total:0 
})
//搜索
const searchForm = ({
      out_trade_no:''
})
//搜索
const submit = (data) => {
      //将订单编号传入函数，使得列表只出现该订单，而不是使用定位
      getListData(data)
}
//将获取接口封装为函数
const getListData = (params = {}) => {
      adminOrder({...params,...paginationData}).then(({data}) => {
            console.log(data)
            const {list,total} = data.data
            tableData.list = list
            tableData.total = total
      })
}
//订单状态
const statusMap = (key) => {
    //左边是键key，右边是值value
    const obj = {
      '待支付':'warning',
      '已完成':'success',
      '已取消':'info'
    };
    return obj[key]
}
//弹窗确认
const confirmEvent = (id) => {
      updateOrder({id}).then(({data}) => {
            if(data.code === 10000){
                  getListData()
            }
      })
}
//点击页码回调
const handleSizeChange = (val) => {
      paginationData.pageSize = val
      getListData()
}
//点击当前分页回调
const handleCurrentChange = (val) => {
      paginationData.pageNum = val
      getListData()
}
</script>
<style lang = 'less' scoped>
      .form{
            display: flex;
            justify-content: end;
      }
</style>
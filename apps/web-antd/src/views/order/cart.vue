<script lang="ts" setup>
import  { ref, onMounted } from 'vue';
import { Row, Col, Descriptions, DescriptionsItem, Divider, Button } from 'ant-design-vue';

import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderCart } from '#/api';

import { Page,  } from '@vben/common-ui';
import { useRoute } from 'vue-router'

import type { Cart, CartSku } from './types';

const route = useRoute()
const loading = ref(false)
const info = ref<Cart|null>(null)
const fetchData = async() => {
    try {
      loading.value = true
      const addressId = route.query.address_id as string
      const orderId = route.query.address_id as string
      const response = await orderCart({address_id:addressId, order_id:orderId})

      info.value = response.data as Cart

    } finally {
       loading.value = false
    }
}
    
onMounted(() => {
  fetchData()
})


const gridOptions: VxeGridProps<CartSku> = {
  minHeight: 200,
  showOverflow: true,
  columns: [
    { field: 'name', title: '商品名称' },
    { field: 'format', title: '规格' },
    { field: 'book_num', title: '数量', width:50 },
    { field: 'unit', title: '单位', width:80 },
    { field: 'price', title: '单价(元)', width:100 },
    { field: 'total', title: '总价(元)', width:100 },
    { field: 'remark', title: '备注'},
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 240,
    },
  ],
  data: info.value?.sku || [],
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  },
  loading:loading.value,
};

const [Grid] = useVbenVxeGrid({ gridOptions });


const itemStyle = {
  fontSize:'16px',
  fontWeight:'400'
}

</script>

<template>
  <Page>
    <div class="button-container">
        <Button class="left-btn" style="margin-left:20px" type="primary" danger>清空货物</Button>
        <Button class="right-btn" style="margin-right:20px" type="primary" >添加商品</Button>
     </div>
    <Divider/>
    <Row>
      <Col :offset="1" :span="12" >
        <Descriptions size="middle">
          <DescriptionsItem label="联系方式" :label-style="itemStyle" :content-style="itemStyle" >  </DescriptionsItem>
        </Descriptions>
      </Col>
      <Col :span="6" >
        <Descriptions size="middle">
          <DescriptionsItem label="收货人" :label-style="itemStyle" :content-style="itemStyle" >  </DescriptionsItem>
        </Descriptions>
      </Col>
    </Row>
    <Row>
      <Col :offset="1" :span="12">
        <Descriptions>
          <DescriptionsItem label="收货地址" :label-style="itemStyle" :content-style="itemStyle" > </DescriptionsItem>
        </Descriptions>
      </Col>
       <Col :span="9">
        <Descriptions>
          <DescriptionsItem label="总金额（元）" :label-style="itemStyle" :content-style="itemStyle" >  </DescriptionsItem>
        </Descriptions>
      </Col>
    </Row>

    <Grid>
    </Grid>
  </Page> 
</template>

<style>
  .button-container {
    display: flex;
    justify-content: space-between; /* 关键属性 */
    width: 100%; /* 根据需要设置宽度 */
    padding: 10px; /* 可选内边距 */
  }
</style>
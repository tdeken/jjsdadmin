<template>
  <Drawer>
    <Row>
      <Col :offset="1" :span="6">
        <Descriptions size="middle">
          <DescriptionsItem label="收货人" :label-style="itemStyle" :content-style="itemStyle" > {{ orderRow.shop_name }} </DescriptionsItem>
        </Descriptions>
      </Col>
       <Col :span="8">
        <Descriptions>
          <DescriptionsItem label="收货地址" :label-style="itemStyle" :content-style="itemStyle" > {{ orderRow.address }} </DescriptionsItem>
        </Descriptions>
      </Col>
    </Row>
    <Row>
      <Col :offset="1" :span="6">
        <Descriptions size="middle">
          <DescriptionsItem label="总金额" :label-style="itemStyle" :content-style="itemStyle" > {{ orderRow.amount }}元 </DescriptionsItem>
        </Descriptions>
      </Col>
      <Col :span="12">
        <Descriptions>
          <DescriptionsItem label="实收金额" :label-style="itemStyle" :content-style="itemStyle" > {{ orderRow.real_amount }}元 </DescriptionsItem>
        </Descriptions>
      </Col>
    </Row>
    <Row>
      <Col :offset="1" :span="12">
        <Descriptions>
          <DescriptionsItem label="备注" :label-style="itemStyle" :content-style="itemStyle" > {{ orderRow.remark }} </DescriptionsItem>
        </Descriptions>
      </Col>
    </Row>

    <Grid>
    </Grid>
  </Drawer> 
</template>

<script lang="ts" setup>
import  { ref } from 'vue';
import { Row, Col, Descriptions, DescriptionsItem } from 'ant-design-vue';

import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderSkuList } from '#/api';

import { useVbenDrawer } from '@vben/common-ui';

import type { Order, OrderSku } from './types';


const orderRow = ref<Order>({
  id: "",
  order_no: "",
  address_id: "",
  shop_name: "",
  address: "",
  amount: "",
  real_amount: "",
  created_date: "",
  status: 0,
  print_status: 0,
  remark: "",
})

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onOpenChange(isOpen) {
    if(isOpen) {
      orderRow.value = drawerApi.getData() 
      gridApi.reload()
    }
  },
});

const gridOptions: VxeGridProps<OrderSku> = {
  minHeight: 0,
  showOverflow: true,
  columns: [
    { field: 'name', title: '销售商品名称' },
    { field: 'book_num', title: '数量', width:50 },
    { field: 'unit', title: '单位', width:80 },
    { field: 'price', title: '单价(元)', width:100 },
    { field: 'total', title: '总价(元)', width:100 },
    { field: 'remark', title: '备注'},
  ],
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        return await orderSkuList({
          order_id: orderRow.value.id ,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

const itemStyle = {
  fontSize:'16px',
  fontWeight:'400'
}

</script>
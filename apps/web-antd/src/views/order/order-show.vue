<script lang="ts" setup>
import  { computed } from 'vue';
import { Row, Col, Descriptions, DescriptionsItem, Divider } from 'ant-design-vue';

import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderSkuList } from '#/api';

import { useVbenDrawer } from '@vben/common-ui';

import type { Order, OrderSku } from './types';


const orderRow = computed(() => {
  return drawerApi.getData() as Order
})

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  }
});

const gridOptions: VxeGridProps<OrderSku> = {
  minHeight: 150,
  showOverflow: true,
  columns: [
    { field: 'name', title: '销售商品名称' },
    { field: 'book_num', title: '数量', width:50 },
    { field: 'format', title: '单位', width:80 },
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

const [Grid] = useVbenVxeGrid({ gridOptions });


const itemStyle = {
  fontSize:'16px',
  fontWeight:'400'
}

</script>

<template>
  <Drawer>
    <Row>
      <Col :offset="1" :span="12">
        <Descriptions size="middle">
          <DescriptionsItem label="收货人" :label-style="itemStyle" :content-style="itemStyle" > {{ orderRow.shop_name }} </DescriptionsItem>
        </Descriptions>
      </Col>
    </Row>
    <Row>
      <Col :offset="1" :span="12">
        <Descriptions>
          <DescriptionsItem label="收货地址" :label-style="itemStyle" :content-style="itemStyle" > {{ orderRow.address }} </DescriptionsItem>
        </Descriptions>
      </Col>
    </Row>
    <Row>
      <Col :offset="1" :span="9">
        <Descriptions>
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
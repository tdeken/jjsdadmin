<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderSkuList } from '#/api';

import type { Order, OrderSku } from './types';
import  { computed } from 'vue';

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
          order_id: orderRow.value?.id || '',
        });
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });

</script>

<template>
  <Drawer> 
    <Grid>
    </Grid>
  </Drawer> 
</template>
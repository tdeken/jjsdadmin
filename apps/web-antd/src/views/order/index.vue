<script lang="ts" setup>
import type { CudInterface } from '#/types/form';
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { orderList } from '#/api';
import { useRoute } from 'vue-router';
import { $t } from '#/locales';
import TagComponents from '#/components/tags/tag.vue';
import { ORDER_STATUS } from '#/constants';

import type { Order as RowType } from './types'

import OrderShow from './order-show.vue'

interface SkuPage {
  oderShow: (row: RowType) => void;
}

const cud: SkuPage = {
  oderShow:(row: RowType) => {
    orderShowModalApi.setState({footer: false, title: '订单详情'});
    orderShowModalApi.setData(row);
    orderShowModalApi.open();
  },
}

const [OrderSHow, orderShowModalApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: OrderShow,

});


const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
   fieldMappingTime: [['created_date', ['start', 'end'], ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59']]],

  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单号',
      },
      fieldName: 'order_no',
      label: '订单号',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入收货人或手机号',
      },
      fieldName: 'keyword',
      label: '关键词',
    },
    {
      component: 'RangePicker',
      fieldName: 'created_date',
      label: '下单时间',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { field:'order_no',title: '订单号', width: 200 },
    { field:'shop_name',title: '收货人', width: 300 },
    { field:'address',title: '收货地址' },
    { field:'amount',title: '订单金额（元）', width: 150 },
    { field:'real_amount',title: '实收金额（元）', width: 150 },
    {
      field: 'status',
      slots: { default: 'status' },
      title: '状态',
      width: 100,
    },
    { field:'remark',title: '备注', width:200 },
    { field:'created_date',title: '下单时间' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 240,
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await orderList({
          page: page.currentPage,
          page_size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

function refresh() {
  GridApi.reload()
}


const useRouteStore = useRoute()

const [Grid, GridApi] = useVbenVxeGrid({tableTitle: $t(useRouteStore.meta.title), formOptions, gridOptions });


</script>

<template>
  <Page auto-content-height>
    <OrderSHow class="w-[45%]" />
    <Grid>
      <template #status="{ row }">
        <TagComponents :status="row.status" :status-map="ORDER_STATUS"/>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="cud.oderShow(row)" >订单详情</Button>
      </template>
    </Grid>
  </Page>
</template>
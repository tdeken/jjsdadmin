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
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入客户名称',
      },
      fieldName: 'name',
      label: '客户名称',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系方式',
      },
      fieldName: 'phone',
      label: '联系方式',
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
    { field:'real_amount',title: '实际金额（元）', width: 150 },
    {
      field: 'status',
      slots: { default: 'status' },
      title: '状态',
      width: 150,
    },
    { field:'remark',title: '备注' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 300,
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
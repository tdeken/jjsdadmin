<script lang="ts" setup>
import type { CudInterface } from '#/types/form';
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { Button, Popconfirm, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { list, customerDestroy } from '#/api';
import { useRoute } from 'vue-router';
import { $t } from '#/locales';

import StoreCustomerComponent from './customer-store.vue';
import UpdateCustomerComponent from './customer-update.vue';

const [UpdateCustomer, updateApi] = useVbenDrawer({
  connectedComponent: UpdateCustomerComponent,
})

const [StoreCustomer, storeApi] = useVbenDrawer({
  connectedComponent: StoreCustomerComponent,
})

const cud: CudInterface = {
  delete: async(row: RowType) => {
    await customerDestroy({id: row.id})
    message.success('操作成功')
    refresh()
  },
  update: (row: RowType) => {
    updateApi.setState({title: '更新客户'});
    updateApi.setData({row: row})
    updateApi.open();
  },
  create:()=> {
    storeApi.setState({title: '新增客户'});
    storeApi.open();
  },
}

interface RowType {
  id: string;
  name: string;
  phone: string;
  created_date: string;
}

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
    { field:'name',title: '商铺', align: 'left', width: 500 },
    { field:'phone',title: '联系方式', align: 'left' },
    { field:'created_date',title: '添加日期', align: 'left' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 200,
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await list({
          page: page.currentPage,
          page_size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const refresh = () => {
  GridApi.reload()
}

const useRouteStore = useRoute()

const [Grid, GridApi] = useVbenVxeGrid({tableTitle: $t(useRouteStore.meta.title), formOptions, gridOptions });

</script>

<template>
  <Page auto-content-height>
    <StoreCustomer :refresh="refresh" />
    <UpdateCustomer :refresh="refresh" />
    <Grid>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click=cud.create >
          新增客户
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="cud.update(row)" >编辑</Button>
        <Popconfirm
          title = "删除后该客户下的收货地址也会删除，你确定要删除吗？"
          ok-text = "确定"
          cancel-text = "取消"
          @confirm="cud.delete(row)"
        >
          <Button danger type="link" >删除</Button>
        </Popconfirm>
      </template>
    </Grid>
  </Page>
</template>
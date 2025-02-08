<script lang="ts" setup>
import type { CudInterface } from '#/types/form';
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { list } from '#/api';
import { useRoute } from 'vue-router';
import { $t } from '#/locales';

import FormCustomerComponent from './customer-form.vue';
import DelCustomerComponent from './customer-del.vue';

const [DelCustomer, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: DelCustomerComponent,
});


const cud: CudInterface = {
  openForm:(state :any, data: any) => {
    drawerApi.setState(state);
    drawerApi.setData(data)
    drawerApi.open();
  },
  delete: (row: RowType) => {
    modalApi.setState({ title: '确定要删除客户吗？', fullscreenButton: false });
    modalApi.setData({row: row})
    modalApi.open();
  },
  update: (row: RowType) => {
    const state = {title: '更新客户'}
    const data = {row: row}
    cud.openForm(state, data)
  },
  create:()=> {
    const state = {title: '新增客户'}
    const data = {row: undefined}
    cud.openForm(state, data)
  },
}

const [CreateCustomer, drawerApi] = useVbenDrawer({
  connectedComponent: FormCustomerComponent,
})


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

function refresh() {
  GridApi.reload()
}

const useRouteStore = useRoute()

const [Grid, GridApi] = useVbenVxeGrid({tableTitle: $t(useRouteStore.meta.title), formOptions, gridOptions });

</script>

<template>
  <Page auto-content-height>
    <CreateCustomer :refresh="refresh" />
    <DelCustomer :refresh="refresh" />
    <Grid>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click=cud.create >
          新增客户
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="cud.update(row)" >编辑</Button>
        <Button danger type="link" @click="cud.delete(row)" >删除</Button>
      </template>
    </Grid>
  </Page>
</template>
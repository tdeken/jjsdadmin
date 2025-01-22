<script lang="ts" setup>
import type { CudInterface } from '#/types/form';
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { Button } from 'ant-design-vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { goodsList } from '#/api';
import { useRoute } from 'vue-router';
import { $t } from '#/locales';

import SkuListComponent from './sku-list.vue';
import SpuFormComponent from './spu-form.vue';
import SpuDelComponent from './spu-del.vue';


const cud: CudInterface = {
  openForm:(state :any, data: any) => {
    drawerApi.setState(state);
    drawerApi.setData(data)
    drawerApi.open();
  },
  delete: (row: RowType) => {
    modalApi.setState({ title: '确定要删除地址吗？', fullscreenButton: false });
    modalApi.setData({row: row})
    modalApi.open();
  },
  update: (row: RowType) => {
    const state = {title: '更新商品', footer: false}
    const data = {row: row}
    cud.openForm(state, data)
  },
  create:()=> {
    const state = {title: '新增商品', footer: false}
    const data = {}
    cud.openForm(state, data)
  },
}

const [SkuList, skuModelApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SkuListComponent,
});

const [Delete, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SpuDelComponent,
});

const [Form, drawerApi] = useVbenDrawer({
  connectedComponent: SpuFormComponent,
})


interface RowType {
  id: string;
  title: string;
  sku_num: number;
  as_title: string;
  code: string;
  created_date: string;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['created_at', ['start', 'end'], ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59']]],
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入商品全称、简称或编号',
      },
      fieldName: 'keywork',
      label: '关键字',
    },
    {
      component: 'RangePicker',
      fieldName: 'created_at',
      label: '创建时间',
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
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { field:'title', title: '商品名称', width: 500 },
    { 
      field:'sku_num', 
      title: '可售商品数',
      cellRender: { name: 'CellLink' }
    },
    { field:'as_title', title: '商品别名' },
    { field:'code', title: '商品编码', width: 300 },
    { field:'created_date', title: '添加日期' },
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
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await goodsList({
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
    <Form :refresh="refresh" />
    <Delete :refresh="refresh" />
    <Grid>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="cud.create" >
          新增商品
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="cud.update(row)" >编辑</Button>
        <Button danger type="link" @click="cud.delete(row)" >删除</Button>
      </template>
    </Grid>
  </Page>
</template>
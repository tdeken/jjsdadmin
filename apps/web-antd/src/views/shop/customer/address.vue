<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { Button } from 'ant-design-vue';

import { Page, useVbenDrawer } from '@vben/common-ui';


import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { addressList } from '#/api';
import { useRoute } from 'vue-router';
import { $t } from '#/locales';
import { customerSelector } from '#/utils';

import { onMounted, ref } from 'vue';

import CreateAddressComponent from './create-address.vue';

const customers = ref() 
const loadCustomers = async () => {
  try {
    customers.value = await customerSelector()
  }catch(error){
    console.error('加载用户失败:', error);
  }
}

onMounted(()=>{
  loadCustomers()
})

const [CreateAddress, drawerApi] = useVbenDrawer({
  connectedComponent: CreateAddressComponent,
})

function openCreateAddress () {
  drawerApi.setState({ title: '新增收货地址' });
  drawerApi.setData({customers: customers.value})
  drawerApi.open();
}

interface RowType {
  id: string;
  title: string;
  address: string;
  tel: string;
  created_date: string;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入商铺名称',
      },
      fieldName: 'title',
      label: '商铺',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系方式',
      },
      fieldName: 'tel',
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
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { field:'title', title: '商铺', width: 500 },
    { field:'address', title: '地址' },
    { field:'tel', title: '联系方式', width: 300 },
    { field:'created_date', title: '添加日期' },
  ],
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await addressList({
          page: page.currentPage,
          page_size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

function refreshAddress() {
  GridApi.reload()
}

const useRouteStore = useRoute()

const [Grid, GridApi] = useVbenVxeGrid({tableTitle: $t(useRouteStore.meta.title), formOptions, gridOptions });

</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <CreateAddress :refreshAddress="refreshAddress" />
        <Button class="mr-2" type="primary" @click=openCreateAddress >
          新增收货地址
        </Button>
      </template>
    </Grid>
  </Page>
</template>
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
import AddressCustomerComponent from './customer-address.vue';
import StoreAddressComponent from "./address-store.vue";

import { onMounted, ref } from 'vue';
import { customerSelector } from '#/utils';

const customers = ref();
const loadCustomers = async () => {
  try {
    customers.value = await customerSelector();
  } catch (error) {
    console.error("加载用户失败:", error);
  }
};

onMounted(() => {
  loadCustomers();
});

const [UpdateCustomer, updateApi] = useVbenDrawer({
  connectedComponent: UpdateCustomerComponent,
})

const [StoreCustomer, storeApi] = useVbenDrawer({
  connectedComponent: StoreCustomerComponent,
})

const [StoreAddress, storeAddressApi] = useVbenDrawer({
  connectedComponent: StoreAddressComponent,
});

interface CustomerPage extends CudInterface {
 createAddress:(row: RowType) => void
}

const cud: CustomerPage = {
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
   createAddress:(row: RowType) => {
    storeAddressApi.setState({title: '新增客户地址'});
    storeAddressApi.setData({customers: customers.value, customer_id: row.id})
    storeAddressApi.open();
  }
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
    { type: 'expand', field:'name',title: '商铺', align: 'left', minWidth: 300, slots: { content: 'expand_content' } },
    { field:'phone',title: '联系方式', align: 'left' },
    { field:'num',title: '地址数量', align: 'left' },
    { field:'created_date',title: '添加日期', align: 'left' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      minWidth: 200,
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
  rowConfig: {
    keyField: 'id'
  },
  expandConfig: {
    labelField:"name",
    trigger: 'cell',
    accordion: true,
    reserve: true,
    expandRowKeys: []
  }
};

const refreshList = () => {
  GridApi.reload();
}

const refresh = () => {
  loadCustomers();  
  refreshList();
}


const useRouteStore = useRoute()

const [Grid, GridApi] = useVbenVxeGrid({tableTitle: $t(useRouteStore.meta.title), formOptions, gridOptions });

</script>

<template>
  <Page auto-content-height>
    <StoreCustomer :refresh="refresh" />
    <UpdateCustomer :refresh="refresh" />
    <StoreAddress :refresh="refreshList" />
    <Grid>
      <template #expand_content="{ row }">
          <AddressCustomerComponent 
            :data="row.address_list"
            :customerId="row.id"
            :customers="customers"
            :refresh="refreshList"
          />
      </template>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click=cud.create >
          新增客户
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="cud.createAddress(row)" >新增地址</Button>
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
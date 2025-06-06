<script lang="ts" setup>
import type { Address } from "./types";

import type { VbenFormProps } from "#/adapter/form";
import type { VxeGridProps } from "#/adapter/vxe-table";
import type { CudInterface } from "#/types/form";

import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { Page, useVbenDrawer, useVbenModal } from "@vben/common-ui";

import { Button } from "ant-design-vue";

import { useVbenVxeGrid } from "#/adapter/vxe-table";
import { addressList } from "#/api";
import { CART_PATH } from "#/constants";
import { $t } from "#/locales";
import { customerSelector } from "#/utils";

import DelAddressComponent from "./address-del.vue";
import FormAddressComponent from "./address-form.vue";

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

const cud: CudInterface = {
  openForm: (state: any, data: any) => {
    drawerApi.setState(state);
    drawerApi.setData(data);
    drawerApi.open();
  },
  delete: (row: Address) => {
    modalApi.setState({ title: "确定要删除地址吗？", fullscreenButton: false });
    modalApi.setData({ row });
    modalApi.open();
  },
  update: (row: Address) => {
    const state = { title: "更新收货地址" };
    const data = { customers: customers.value, row };
    cud.openForm(state, data);
  },
  create: () => {
    const state = { title: "新增收货地址" };
    const data = { customers: customers.value, row: undefined };
    cud.openForm(state, data);
  },
};

const [DelAddress, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: DelAddressComponent,
});

const [CreateAddress, drawerApi] = useVbenDrawer({
  connectedComponent: FormAddressComponent,
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: "Input",
      componentProps: {
        placeholder: "请输入商铺名称",
      },
      fieldName: "shop_name",
      label: "商铺",
    },
    {
      component: "Input",
      componentProps: {
        placeholder: "请输入联系方式",
      },
      fieldName: "tel",
      label: "联系方式",
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  submitButtonOptions: {
    content: "查询",
  },
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<Address> = {
  checkboxConfig: {
    highlight: true,
    labelField: "name",
  },
  columns: [
    { field: "shop_name", title: "商铺", width: 500 },
    { field: "address", title: "地址" },
    { field: "tel", title: "联系方式", width: 300 },
    { field: "created_date", title: "添加日期" },
    {
      field: "action",
      fixed: "right",
      slots: { default: "action" },
      title: "操作",
      width: 250,
    },
  ],
  height: "auto",
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

function refresh() {
  GridApi.reload();
}

const useRouteStore = useRoute();

const [Grid, GridApi] = useVbenVxeGrid({
  tableTitle: $t(useRouteStore.meta.title),
  formOptions,
  gridOptions,
});

const router = useRouter();
function toCart(addressId: any) {
  router.push({
    path: CART_PATH,
    query: { address_id: addressId, order_id: "" }, // URL查询参数
  });
}
</script>

<template>
  <Page auto-content-height>
    <CreateAddress :refresh="refresh" />
    <DelAddress :refresh="refresh" />
    <Grid>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="cud.create">
          新增收货地址
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="text" @click="toCart(row.id)">订货</Button>
        <Button type="link" @click="cud.update(row)">编辑</Button>
        <Button danger type="link" @click="cud.delete(row)">删除</Button>
      </template>
    </Grid>
  </Page>
</template>

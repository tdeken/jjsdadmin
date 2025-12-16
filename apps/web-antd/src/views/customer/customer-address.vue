<script lang="ts" setup>
import type { Address } from "./types";

import type { VxeGridProps } from "#/adapter/vxe-table";
import type { CudInterface } from "#/types/form";

import { useRouter } from "vue-router";

import { Page, useVbenDrawer } from "@vben/common-ui";

import { Button, Popconfirm, message } from "ant-design-vue";

import { useVbenVxeGrid } from "#/adapter/vxe-table";
import { orderCartStore, addressDestroy } from "#/api";
import { CART_PATH } from "#/constants";

import UpdateAddressComponent from "./address-update.vue";
import StoreAddressComponent from "./address-store.vue";


interface Props {
  data?: Address[];
  customers: any;
  customerId: any;
  refresh:()=>void;
}

const props = defineProps<Props>();

const cud: CudInterface = {
  delete: async (row: Address) => {
    await addressDestroy({id: row.id})
    message.success('操作成功')
    props.refresh()
  },
  update: (row: Address) => {
    updateApi.setState({ title: "更新收货地址" });
    updateApi.setData({ customers: props.customers, customer_id: props.customerId, row: row });
    updateApi.open();
  },
  create: () => {
    storeApi.setState({ title: "新增收货地址" });
    storeApi.setData({ customers: props.customers, customer_id: props.customerId });
    storeApi.open();
  },
};

const [UpdateAddress, updateApi] = useVbenDrawer({
  connectedComponent: UpdateAddressComponent,
});

const [StoreAddress, storeApi] = useVbenDrawer({
  connectedComponent: StoreAddressComponent,
});

const gridOptions: VxeGridProps<Address> = {
  minHeight: 200,
  maxHeight: 700,
  showOverflow: true,
  columns: [
    { field: "shop_name", title: "商铺", width: 200 },
    { field: "address", title: "地址", minWidth: 200 },
    { field: "tel", title: "联系方式", width: 200 },
    { field: "created_date", title: "添加日期", width: 200  },
    {
      field: "action",
      fixed: "right",
      slots: { default: "action" },
      title: "操作",
      width: 200,
    },
  ],
  data: props.data,
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });

const router = useRouter();
const toCart = async (addressId:any) =>  {
  await orderCartStore({address_id: addressId, order_id: ""})
  router.push({
    path: CART_PATH,
    query: { address_id: addressId, order_id: "" }, // URL查询参数
  });
}
</script>

<template>
  <Page>
    <StoreAddress :refresh="refresh" />
    <UpdateAddress :refresh="refresh" />
    <Grid>
      <template #action="{ row }">
        <Button type="text" @click="toCart(row.id)">订货</Button>
        <Button type="link" @click="cud.update(row)">编辑</Button>
        <Popconfirm
          title = "你确定要删除当前的配送地址吗？"
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

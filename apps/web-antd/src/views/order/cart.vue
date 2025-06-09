<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  Button,
  Col,
  Descriptions,
  DescriptionsItem,
  Divider,
  Row,
} from "ant-design-vue";

import { Page, useVbenModal } from "@vben/common-ui";
import { useRefresh } from '@vben/hooks';

import type { VxeGridProps } from "#/adapter/vxe-table";
import type { CudInterface } from '#/types/form';
import { useVbenVxeGrid } from "#/adapter/vxe-table";
import { orderCart } from "#/api";


import type { Cart, CartSku } from "./types";
import CartDelComponent from './cart-del.vue';
import CartClearComponent from './cart-clear.vue';
import CartFormComponent  from "./cart-form.vue";


const [CartDelete, cartDelModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: CartDelComponent,
});

const [CartClear, cartClearModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: CartClearComponent,
});

const [CartForm, cartFormModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: CartFormComponent,
});

const gridOptions: VxeGridProps<CartSku> = {
  minHeight: 200,
  showOverflow: true,
  columns: [
    { field: "name", title: "商品名称" },
    { field: "format", title: "规格" },
    { field: "book_num", title: "数量", width: 50 },
    { field: "unit", title: "单位", width: 80 },
    { field: "price", title: "单价(元)", width: 100 },
    { field: "total", title: "总价(元)", width: 100 },
    { field: "remark", title: "备注" },
    { field: "number", title: "商品编号" },
    {
      field: "action",
      fixed: "right",
      slots: { default: "action" },
      title: "操作",
      width: 240,
    },
  ],
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  },
  data: [],
};

const addressId = ref("")
const orderId = ref("")
const route = useRoute();
const loading = ref(false);
const info = ref<Cart | null>(null);
const fetchData = async () => {
  try {
    loading.value = true;
     addressId.value = route.query.address_id as string;
     orderId.value = route.query.order_id as string;
    const response = await orderCart({
      address_id: addressId.value,
      order_id: orderId.value,
    });

    info.value = response as Cart;
    gridApi.setGridOptions({data:response.sku})
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

const itemStyle = {
  fontSize: "16px",
  fontWeight: "400",
};

interface CartPage extends CudInterface {
   clear:()=>void;
}

const cud: CartPage = {
  openForm: (state: any, data: any) => {
    
  },
  update: async (row: CartSku) => {
     
  },
  create: () => {
    cartFormModalApi.setState({ title: '添加商品', fullscreenButton: false });
    cartFormModalApi.setData({address_id: addressId.value, order_id: orderId.value})
    cartFormModalApi.open();
  },
  clear: () => {
    cartClearModalApi.setState({ title: '确定要清空商品吗？', fullscreenButton: false });
    cartClearModalApi.setData({address_id: addressId.value, order_id: orderId.value})
    cartClearModalApi.open();
  },
  delete(row: CartSku) {
    cartDelModalApi.setState({ title: '确定要删除商品吗？', fullscreenButton: false });
    cartDelModalApi.setData({row: row, address_id: addressId.value, order_id: orderId.value})
    cartDelModalApi.open();
  },
}

const { refresh } = useRefresh();

</script>

<template>
  <Page>
    <CartForm :refresh="refresh"/>
    <CartDelete :refresh="refresh"/>
    <CartClear :refresh="refresh"/>
    <div class="button-container">
      <Button class="left-btn" @click="cud.clear" style="margin-left: 20px" type="primary" danger>
        清空货物
      </Button>
      <Button class="right-btn" @click="cud.create" style="margin-right: 20px" type="primary">
        添加商品
      </Button>
    </div>
    <Divider />
    <Row>
      <Col :offset="1" :span="12">
        <Descriptions size="middle">
          <DescriptionsItem
            label="收货人"
            :label-style="itemStyle"
            :content-style="itemStyle"
          >
          {{ info?.shop_name }}
          </DescriptionsItem>
        </Descriptions>
      </Col>
      <Col :span="6" >
        <Descriptions size="middle">
          <DescriptionsItem
            label="联系方式"
            :label-style="itemStyle"
            :content-style="itemStyle"
          >
            {{ info?.tel }}
          </DescriptionsItem>
        </Descriptions>
      </Col>
      
    </Row>
    <Row>
      <Col :offset="1" :span="12">
        <Descriptions>
          <DescriptionsItem
            label="收货地址"
            :label-style="itemStyle"
            :content-style="itemStyle"
          >
          {{ info?.address }}
          </DescriptionsItem>
        </Descriptions>
      </Col>
      <Col :span="9">
        <Descriptions>
          <DescriptionsItem
            label="总金额"
            :label-style="itemStyle"
            :content-style="itemStyle"
          >
          {{ info?.amount }} 元
          </DescriptionsItem>
        </Descriptions>
      </Col>
    </Row>

    <Grid>
      <template #action="{ row }">
        <Button type="link" @click="">编辑</Button>
        <Button type="link" @click="cud.delete(row)" danger>删除</Button>
      </template>
    </Grid>
  </Page>
</template>

<style>
.button-container {
  display: flex;
  justify-content: space-between; /* 关键属性 */
  width: 100%; /* 根据需要设置宽度 */
  padding: 10px; /* 可选内边距 */
}
</style>

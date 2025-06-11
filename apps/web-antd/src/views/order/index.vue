
<template>
  <Page auto-content-height>
    <Print class="w-[60%]" />
    <OrderDelete :refresh="refresh" />
    <OrderSHow class="w-[45%]" />
    <Grid>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="cud.create" >
          创建订单
        </Button>
      </template>
      
      <template #status="{ row }">
        <TagComponents :status="row.status" :status-map="ORDER_STATUS" />
      </template>

      <template #action="{ row }">
        <Space>
          <Button size='small' @click="cud.oderShow(row)">详情</Button>
          <Button size='small' type="primary" @click="cud.print(row)">打印</Button>
          <Dropdown>
            <template #overlay>
              <Menu>
                 <MenuItem @click="cud.update(row)">
                  修改订单
                </MenuItem>
                <MenuItem @click="cud.update(row)">
                  修改订单状态
                </MenuItem>
                <MenuItem @click="cud.delete(row)">
                  删除订单
                </MenuItem>
              </Menu>
            </template>
            <DropdownButton size='small' type="link">更多</DropdownButton>
          </Dropdown>
        </Space>
      </template>
    </Grid>
  </Page>
</template>

<script lang="ts" setup>
import type { Order as RowType } from "./types";

import type { VbenFormProps } from "#/adapter/form";
import type { VxeGridProps } from "#/adapter/vxe-table";

import { useRoute, useRouter } from "vue-router";

import { Page, useVbenDrawer, useVbenModal } from "@vben/common-ui";

import { Button, Space, Dropdown, DropdownButton, Menu, MenuItem } from "ant-design-vue";


import { useVbenVxeGrid } from "#/adapter/vxe-table";
import { orderList, orderCartStore, orderPrintData } from "#/api";
import TagComponents from "#/components/tags/tag.vue";
import { ORDER_STATUS } from "#/constants";
import { $t } from "#/locales";
import type { CudInterface } from '#/types/form';
import { CART_PATH } from "#/constants";


import OrderShow from "./order-show.vue";
import OrderDelComponent from './order-del.vue';
import PrintComponent from './print.vue';

const router = useRouter();

interface SkuPage extends CudInterface {
  oderShow: (row: RowType) => void;
  print: (row: RowType) => void;
}

const cud: SkuPage = {
  oderShow: (row: RowType) => {
    orderShowModalApi.setState({ footer: false, title: "订单详情" });
    orderShowModalApi.setData(row);
    orderShowModalApi.open();
  },
  openForm: (state: any, data: any) => {
    
  },
  update: async (row: RowType) => {
      await orderCartStore({address_id: row.address_id, order_id: row.id})
      router.push({
          path: CART_PATH,
          query: { address_id: row.address_id, order_id: row.id }, // URL查询参数
        });
  },
  create: () => {
    
  },
  delete: (row: RowType) => {
    orderModalApi.setState({ title: '确定要删除订单吗？', fullscreenButton: false });
    orderModalApi.setData({row: row})
    orderModalApi.open();
  },
  print: async (row: RowType) => {
    const res = await orderPrintData({order_id: row.id})
    printModalApi.setState({ title: "订单打印", confirmText: '打印' });
    printModalApi.setData(res);
    printModalApi.open();
  }
};

const [Print, printModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: PrintComponent,
});

const [OrderDelete, orderModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: OrderDelComponent,
});

const [OrderSHow, orderShowModalApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: OrderShow,
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [
    [
      "created_date",
      ["start", "end"],
      ["YYYY-MM-DD 00:00:00", "YYYY-MM-DD 23:59:59"],
    ],
  ],
  schema: [
    {
      component: "Input",
      componentProps: {
        placeholder: "请输入订单号",
      },
      fieldName: "order_no",
      label: "订单号",
    },
    {
      component: "Input",
      componentProps: {
        placeholder: "请输入收货人或手机号",
      },
      fieldName: "keyword",
      label: "关键词",
    },
    {
      component: "RangePicker",
      fieldName: "created_date",
      label: "下单时间",
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

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { field: "order_no", title: "订单号", minWidth: 150 },
    { field: "shop_name", title: "收货人", minWidth: 150 },
    { field: "address", title: "收货地址", minWidth: 200 },
    { field: "amount", title: "总金额（元）", minWidth: 100 },
    { field: "real_amount", title: "实收（元）", minWidth: 100 },
    {
      field: "status",
      slots: { default: "status" },
      title: "状态",
      width: 100,
    },
    { field: "remark", title: "备注", width: 200 },
    { field: "created_date", title: "下单时间" },
    {
      field: "action",
      fixed: "right",
      slots: { default: "action" },
      title: "操作",
      minWidth: 200,
    },
  ],
  height: "auto",
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
  GridApi.reload();
}

const useRouteStore = useRoute();

const [Grid, GridApi] = useVbenVxeGrid({
  tableTitle: $t(useRouteStore.meta.title),
  formOptions,
  gridOptions,
});

</script>
<template>
  <Modal>
    <div ref="topElRef">
      <div>
        <Row class="label-row">
          <Col :span="6">
            <p class="p-row">购货者：{{ orderRow.address }}</p>
          </Col>
          <Col :span="10">
            <p class="p-row">地址：{{ orderRow.address }}</p>
          </Col>
          <Col :span="6">
            <p class="p-row">联系电话：{{ orderRow.address }}</p>
          </Col>
        </Row>
        <Row class="label-row">
          <Col :span="6">
            <p class="p-row">供货者：{{ orderRow.address }}</p>
          </Col>
          <Col :span="10">
            <p class="p-row">地址：{{ orderRow.address }}</p>
          </Col>
          <Col :span="6">
            <p class="p-row">联系电话：{{ orderRow.address }}</p>
          </Col>
        </Row>
        <Row class="label-row">
          <Col :span="6">
            <p class="p-row">订单编号：{{ orderRow.address }}</p>
          </Col>
          <Col :span="10">
            <p class="p-row">订单日期：{{ orderRow.address }}</p>
          </Col>
          <Col :span="6">
            <p class="p-row">订单总金额：{{ orderRow.address }} 元</p>
          </Col>
        </Row>
      </div>
    </div>
  

    <Grid />

    <div ref="bottomElRef">
      <div style="margin-top: 2px">
        <Row class="label-row">
          <Col :span="9">
            <p class="p-row">开票人：{{ orderRow.address }}</p>
          </Col>
          <Col :span="9">
            <p class="p-row">配送员：{{ orderRow.address }}</p>
          </Col>
          <Col :span="6">
            <p class="p-row">共 {{orderRow.address}} 样商品</p>
          </Col>
        </Row>
        <Row class="label-row">
          <Col :span="24">
            <p class="p-row">特别提示：尊敬的客户，请与配送员当面点清货物，如有错误，请及时来电，多谢惠顾</p>
          </Col>
        </Row>
      </div>
    </div>
    
  </Modal> 
</template>

<script lang="ts" setup>
import  { computed, ref } from 'vue';
import { Row, Col } from 'ant-design-vue';

import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderSkuList } from '#/api';

import { useVbenModal } from '@vben/common-ui';

import type { Order, OrderSku } from './types';

const orderRow = computed(() => {
  return modalApi.getData() as Order
})

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm(){
    printEvent()
  }
});


const gridOptions: VxeGridProps<OrderSku> = {
  minHeight: 0,
  showOverflow: true,
  columns: [
    { field: 'name', title: '销售商品名称' },
    { field: 'book_num', title: '数量', width:50 },
    { field: 'format', title: '单位', width:80 },
    { field: 'price', title: '单价(元)', width:100 },
    { field: 'total', title: '总价(元)', width:100 },
    { field: 'remark', title: '备注'},
  ],
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        return await orderSkuList({
          order_id: orderRow.value.id ,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

const topElRef = ref<HTMLDivElement>()
const bottomElRef = ref<HTMLDivElement>()

const printEvent = async () => {
  const $grid = gridApi.grid
  if ($grid) {
    const printRest = await $grid.getPrintHtml()
    const topEl = topElRef.value
    const bottomEl = bottomElRef.value
    const topHtml = topEl ? topEl.innerHTML : ''
    const bottomHtml = bottomEl ? bottomEl.innerHTML : ''
    VxeUI.print({
      title: '出货单据',
      pageBreaks: [
        // 第一页
        {
          bodyHtml: topHtml + printRest.html + bottomHtml
        }
      ]
    })
  }
}

</script>

<style lang="less" scoped>
.label-row {
  margin-bottom: 5px;
  margin-left: 10px
}
.p-row {
  margin: 0;
}
</style>
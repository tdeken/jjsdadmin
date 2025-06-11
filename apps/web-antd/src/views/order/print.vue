<template>
  <Modal>
    <div ref="topElRef">
      <div style="margin-bottom: 8px;">
        <div style="display: inline-block; width: 100%;">
          <div style="float: left; width: 30%;height: 18px;line-height: 20px;">购货者：{{ data.customer.shop_name }}</div>
          <div style="float: left; width: 40%;height: 18px;line-height: 20px;">地址：{{ data.customer.address }}</div>
          <div style="float: left; width: 30%;height: 18px;line-height: 20px;">联系电话：{{ data.customer.tel }}</div>
        </div>
        <div style="display: inline-block;width: 100%;">
          <div style="float: left; width: 30%;height: 18px;line-height: 20px;">供货者：{{ data.owner.shop_name }}</div>
          <div style="float: left; width: 40%;height: 18px;line-height: 20px;">地址：{{ data.owner.address }}</div>
          <div style="float: left; width: 30%;height: 18px;line-height: 20px;">联系电话：{{ data.owner.tel }}</div>
        </div>
        <div style="display: inline-block;width: 100%;">
          <div style="float: left; width: 30%;height: 18px;line-height: 20px;">订单编号：{{ data.order_no }}</div>
          <div style="float: left; width: 40%;height: 18px;line-height: 20px;">订单日期：{{ data.created_date }}</div>
          <div style="float: left; width: 30%;height: 18px;line-height: 20px;">订单总金额：{{ data.amount }} 元</div>
        </div>
      </div>
    </div>
  
    <Grid />

    <div ref="bottomElRef">
      <div>
        <div style="display: inline-block;width: 100%;">
          <div style="float: left; width: 30%;height: 18px;line-height: 20px;">开票人：{{ data.operator }}</div>
          <div style="float: left; width: 30%;height: 18px;line-height: 20px;">配送员：{{ data.deliver }}</div>
          <div style="float: left; width: 40%;height: 18px;line-height: 20px;">共 {{ data.total }} 样商品</div>
        </div>
        <div style="display: inline-block;width: 100%;height: 18px;line-height: 20px;">
          特别提示：尊敬的客户，请与配送员当面点清货物，如有错误，请及时来电，多谢惠顾；
        </div>
      </div>
    </div>
    
  </Modal> 
</template>

<script lang="ts" setup>
import  { ref } from 'vue';
import { VxeUI } from 'vxe-pc-ui'

import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useVbenModal } from '@vben/common-ui';

import type { PrintData, PrintSku } from './types';

const data = ref<PrintData>()

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm(){
    printEvent()
  },
  onOpenChange(isOpen: boolean){
    if (!isOpen) return
    data.value = modalApi.getData() as PrintData

    gridApi.setGridOptions({data:data.value.list})
  }
});

const gridOptions: VxeGridProps<PrintSku> = {
  minHeight: 0,
  border: "full",
  showOverflow: true,
  columns: [
    { field: 'number', title: '商品条码', width:200 },
    { field: 'name', title: '商品名称' },
    { field: 'book_num', title: '数量', width:50 },
    { field: 'unit', title: '单位', width:80 },
    { field: 'format', title: '规格', width:80 },
    { field: 'price', title: '单价(元)', width:100 },
    { field: 'total', title: '总价(元)', width:100 },
    { field: 'remark', title: '备注'},
  ],
  data: [],
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  }
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
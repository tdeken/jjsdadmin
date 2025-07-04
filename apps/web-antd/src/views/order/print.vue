<template>
  <Modal class="w-[60%]">
    <div ref="topElRef">
      <div>
        <div class="p-label-g p-title">
          <div class="p-label" style="width: 100%;font-weight: bold; font-size: 20px;text-align: center;">
            健健综合店 (批 发/进 货 台 账)
          </div>
        </div>
        <div class="p-label-g">
          <div class="p-label p-label-30">购货者：{{ data?.customer.shop_name }}</div>
          <div class="p-label p-label-40">地址：{{ data?.customer.address }}</div>
          <div class="p-label p-label-30">联系电话：{{ data?.customer.tel }}</div>
        </div>
        <div class="p-label-g">
          <div class="p-label p-label-30">供货者：{{ data?.owner.shop_name }}</div>
          <div class="p-label p-label-40">地址：{{ data?.owner.address }}</div>
          <div class="p-label p-label-30">联系电话：{{ data?.owner.tel }}</div>
        </div>
        <div class="p-label-g">
          <div class="p-label p-label-30">订单编号：{{ data?.order_no }}</div>
          <div class="p-label p-label-40">订单日期：{{ data?.created_date }}</div>
          <div class="p-label p-label-30">订单总金额：{{ data?.amount }} 元</div>
        </div>
      </div>
    </div>
  
    <Grid />

    <div ref="bottomElRef">
      <div style="margin-top: 5px;">
        <div class="p-label-g" style="font-size: 14px;">
          <div class="p-label p-label-30">开票人：{{ data?.operator }}</div>
          <div class="p-label p-label-30">配送员：{{ data?.deliver }}</div>
          <div class="p-label p-label-40">共 {{ data?.total }} 样商品</div>
        </div>
        <div class="p-label-g" style="font-size: 14px;">
          特别提示：尊敬的客户，请与配送员当面点清货物，如有错误，请及时来电，多谢惠顾
        </div>
      </div>
    </div>
  </Modal> 
  <PrintConfirm :refresh="refresh" />
</template>

<script lang="ts" setup>
import  { ref } from 'vue';
import { VxeUI } from 'vxe-pc-ui'

import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useVbenModal } from '@vben/common-ui';

import type { PrintData, PrintSku } from './types';

import PrintConfirmComponent from './print-confirm.vue';


interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const [PrintConfirm, printConfirmApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: PrintConfirmComponent,
});

const data = ref<PrintData>()
const orderId = ref<string>('')
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm(){
    printEvent()
    printConfirmApi.setData({order_id: orderId.value});
    printConfirmApi.open()
  },
  onOpenChange(isOpen: boolean){
    if (!isOpen) return
    data.value = modalApi.getData().print_data as PrintData
    orderId.value = modalApi.getData().order_id

    gridApi.setGridOptions({data:data.value.list})
  }
});

const gridOptions: VxeGridProps<PrintSku> = {
  minHeight: 0,
  border: "full",
  showOverflow: true,
  columns: [
    { field: 'number', title: '商品条码', width: 110 },
    { field: 'name', title: '商品名称', minWidth: 150 },
    { field: 'book_num', title: '数量', width:50, align: 'center' },
    { field: 'unit', title: '单位', width:50, align: 'center' },
    { field: 'format', title: '规格', width:50, align: 'center' },
    { field: 'price', title: '单价(元)', width:80, align: 'center' },
    { field: 'total', title: '总价(元)', width:80, align: 'center' },
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


const customStyle = `
  @page { 
    size: auto;
    margin: 0 !important; 
  }
    
  body {
    width: 100%;
    height: 100%;
  }
  .vxe-table {
    width: 100% !important;
    border: none !important;
  }
  .vxe-table th,
  .vxe-table td {
    border: 1px solid #000 !important;
    font-size: ` + '14' + `px;
  }
  .p-label {
    float: left;
  }

  .p-label-30 {
    width: 30%;
  }

  .p-label-40 {
    width: 40%;
  }

  .p-label-g {
    display: inline-block; 
    width: 100%;
    height: 18px;
    line-height: 20px;
    font-size: ` + '16' + `px;
  }
  
  .p-title {
    margin-bottom: 8px;
    margin-top: 14px;
  }

`

const printEvent = async () => {
  const $grid = gridApi.grid
  if ($grid) {
    const printRest = await $grid.getPrintHtml()
    const topEl = topElRef.value
    const bottomEl = bottomElRef.value
    const topHtml = topEl ? topEl.innerHTML : ''
    const bottomHtml = bottomEl ? bottomEl.innerHTML : ''
    VxeUI.print({
      customStyle: customStyle
    ,
    html: topHtml + printRest.html + bottomHtml,
    })
  }
}

const refresh = () => {
  if (props.refresh) {
    props.refresh()
  }
}

</script>

<style lang="less" scoped>
.p-label-g {
  display: inline-block; 
  width: 100%;
  height: 16px;
  line-height: 16px;
  font-size: 14px;
}

.p-label {
  float: left;
}

.p-label-30 {
   width: 30%;
}

.p-label-40 {
   width: 40%;
}

.label-row {
  margin-bottom: 5px;
  margin-left: 10px
}
.p-title {
  margin-bottom: 8px;
}


</style>
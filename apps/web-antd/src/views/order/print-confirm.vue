<template>
  <ConfirmPrint>
      已经打印完成了吗？
  </ConfirmPrint>
</template>


<script lang="ts" setup>

import { useVbenModal } from '@vben/common-ui';

import { orderConfirmPrint } from "#/api";

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const [ConfirmPrint, confirmPrintApi] = useVbenModal({
  title: "打印确认",
  confirmText: "打印完成",
  cancelText: "等一下再来",
  onCancel() {
    confirmPrintApi.close();
  },
  onConfirm(){
    confirmPrint()
    confirmPrintApi.close();
  }
});

const confirmPrint = async () => {
  try {
    await orderConfirmPrint({order_id: confirmPrintApi.getData().order_id})

    if (props.refresh) {
      props.refresh()
    }
  } catch (err) {
    console.log(err)
  }
}


</script>
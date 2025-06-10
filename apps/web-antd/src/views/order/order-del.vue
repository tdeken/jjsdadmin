<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { orderDestroy } from '#/api';
import { message } from 'ant-design-vue';

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const row = ref()

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    del();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      row.value = modalApi.getData()?.row
    }
  },
});

async function del(){
  await orderDestroy({id: row.value.id})

  if (props.refresh) {
    props.refresh()
  }
  
  modalApi.close();
  message.success('操作成功')
}

</script>
<template>
  <Modal>
    <div class="flex-col-left">你确定要删除 {{ row.shop_name }} 的 {{ row.order_no }} 订单吗？</div>
  </Modal>
</template>
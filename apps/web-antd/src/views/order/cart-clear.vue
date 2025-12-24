<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { orderCartClear } from '#/api';
import { message } from 'ant-design-vue';

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const form = ref()

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    del();
  },
  onOpenChange(isOpen) {
    if (isOpen) {

      const data = modalApi.getData()
      if (data) {
        form.value = {address_id:data.address_id, order_id: data.order_id}
      }
    }
  },
});

const del = async () => {
  await orderCartClear(form.value)
  if (props.refresh) {
    props.refresh()
  }
  modalApi.close();
  message.success('操作成功')
}

</script>
<template>
  <Modal>
    <div class="flex-col-left">你确定要清空当前订单吗？</div>
  </Modal>
</template>
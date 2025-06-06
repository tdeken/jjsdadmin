<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { orderCartDestroy } from '#/api';
import { message } from 'ant-design-vue';

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const form = ref()
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

      const data = modalApi.getData()
      if (data) {
        row.value = data.row
        form.value = {address_id:data.address_id, order_id:data.order_id, id: data.row.id}
      }
    }
  },
});

async function del(){
  await orderCartDestroy(form.value)
  if (props.refresh) {
    props.refresh()
  }
  modalApi.close();
  message.success('操作成功')
}

</script>
<template>
  <Modal>
    <div class="flex-col-left">你确定要删除 {{ row.name }} 吗？</div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { customerDestroy } from '#/api';
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
  await customerDestroy({id: row.value.id})
  if (props.refresh) {
    props.refresh()
  }
  modalApi.close();
  message.success('操作成功')
}

</script>
<template>
  <Modal>
    <div class="flex-col-left">删除后该客户下的收货地址也会删除，你确定要删除客户 {{ row.name }} 吗？</div>
  </Modal>
</template>
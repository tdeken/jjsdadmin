<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { addressDestroy } from '#/api';
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
    delAddress();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      row.value = modalApi.getData()?.row
    }
  },
});

async function delAddress(){
  await addressDestroy({id: row.value.id})
  if (props.refresh) {
    props.refresh()
  }
  modalApi.close();
  message.success('操作成功')
}

</script>
<template>
  <Modal>
    <div class="flex-col-left">你确定要删除商铺 {{ row.title }} 的配送地址吗？</div>
  </Modal>
</template>
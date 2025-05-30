<template>
    <Tag :color="tagInfo.color">{{ tagInfo.text }}</Tag>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { Tag } from 'ant-design-vue';

const props = defineProps({
  status: {
    type: Number,
    required: true
  },
  // 可选的自定义状态映射
  statusMap: {
    type: Object,
    required: true,
  }
})

const tagInfo = computed(() => {
  return props.statusMap[props.status] || { color: 'default', text: '未知状态' }
})
</script>



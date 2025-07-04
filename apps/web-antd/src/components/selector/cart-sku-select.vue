<template>
  <Select
    v-model:value="innerValue"
    :style="style"
    placeholder="输入关键词搜索"
    :options="options"
    :loading="loading"
    :allowClear=true
    :showSearch=true
    @search="handleSearch"
    @change="handleChange"
    :filterOption="false"
  >

  </Select>
</template>

<script setup lang="ts">
import { ref, watch, toRefs, type PropType} from 'vue';
import { Select } from 'ant-design-vue';
import { debounce } from 'lodash-es';

import { orderCartSku } from '#/api';
import type { SelectOption } from '#/types'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array] as PropType<string | number | Array<string | number>>,
    default: undefined
  },
  addressId : { 
    type: String, 
    required: true
  },
  options: {
    type: Array<SelectOption>,
    default: [],
    required: true
  },
  style: {
    type: [String, Object],
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any, option: any): void
}>()

const { modelValue } = toRefs(props)
const options = ref<SelectOption[]>(props.options)
const loading = ref(false)
const searchText = ref('')
const innerValue = ref(props.modelValue)

// 同步外部值变化
watch(modelValue, (val: any) => {
  innerValue.value = val
})


// 防抖函数（500ms 延迟）
const debouncedSearch = debounce(async (keyword = '') => {
  try {
    loading.value = true;
    const params = { address_id: props.addressId , keyword}
    const data = await orderCartSku(params);
    options.value = data.list.map((item : any) => ({
      label: item.name + "/" + item.unit,
      value: item.id,
    }));
  } catch (error) {
    console.error('搜索失败:', error);
    options.value = []
  } finally {
    loading.value = false;
  }
}, 300);

// 处理搜索
const handleSearch = (value: string) => {
  console.log("search:", value)
  searchText.value = value
  debouncedSearch(value)
}

// 处理选择变化
const handleChange = (value: any, option: any) => {
  emit('update:modelValue', value)
  emit('change', value, option)
}


</script>
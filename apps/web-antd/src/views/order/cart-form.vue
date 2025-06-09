<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';
import { vbenForm, priceFloat } from '#/utils';
import { orderCartSku, orderCartAdd, orderCartUpdate } from '#/api';
import { message } from 'ant-design-vue';

import { ref, computed } from 'vue';


const row = ref()
const addressId = ref()
const searchKeyword = ref()

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const [Modal, drawerApi] = useVbenModal({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    formApi.validateAndSubmitForm();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      updateRow()
    }
  },
});

function updateRow(){
  const data = drawerApi.getData()
  row.value = data.row
  addressId.value = data.address_id
}

// 搜索参数
const searchParams = computed(() => ({
  address_id: addressId.value,
}));

const searchCartSku = async (params: any) => {
  try {
     const res = await orderCartSku({...params})
      return res
  } catch (error) {

  }
};

const search = (val: string) => {
  searchKeyword.value = val
  formApi.resetForm()
  console.log(val)
}

const change = (row: any) =>{
  console.log(row)
}

const cus = {
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'ApiSelect',
      // 对应组件的参数
      componentProps: {
          api: searchCartSku,
          params: searchParams,
          showSearch: true,
          filterOption: false,
          resultField: 'list',
          labelField: 'name',
          valueField: 'id',
          // 使搜索时按标题搜索
          optionFilterProp: 'label',
          onSearch: search,
          onChange: change,
          alwaysLoad: true,
      },
      // 字段名
      fieldName: 'id',
      // 界面显示的label
      label: '下订商品',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入商品别名，方便搜索',
        step:"0.01",
        min:"0",
        defaultValue:"0"
      },
      // 字段名
      fieldName: 'price',
      // 界面显示的label
      label: '商品价格',
    },
    {
      component: 'InputNumber',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入商品别名，方便搜索',
        step:"0.5",
        min:"0",
        defaultValue:"1"
      },
      // 字段名
      fieldName: 'book_num',
      // 界面显示的label
      label: '下订数量',
    }
  ],
}

const [Form, formApi] = vbenForm(cus, onSubmit);

async function onSubmit(values: Record<string, any>) {
  drawerApi.close();
    
  if (props.refresh) {
    props.refresh()
  }
    
}

</script>

<template>
  <Modal> 
    <Form >

    </Form>
  </Modal>
</template>

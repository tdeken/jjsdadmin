<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { vbenForm } from '#/utils';
import { addressUpdate } from '#/api';
import { message } from 'ant-design-vue';

import { ref } from 'vue';


const row = ref()

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
   
    drawerApi.close();
  },
  onConfirm() {
    formApi.validateAndSubmitForm();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      fullCustomers()
      updateRow()
    }
  },
});

const fullCustomers = () => {
  formApi.updateSchema([
    {
      componentProps: {
        options: drawerApi.getData()?.customers,
      },
      fieldName: 'customer_id',
    }
  ])
}

const updateRow = () => {
  const data = drawerApi.getData()?.row
  row.value = data

  if (!data?.customer_id) {
    formApi.setFieldValue('customer_id', undefined)
  } else {
    formApi.setFieldValue('customer_id', data.customer_id)
  }
  
  formApi.setFieldValue('shop_name', data?.shop_name || '')
  formApi.setFieldValue('address', data?.address || '')
  formApi.setFieldValue('tel', data?.tel || '')
}

const cus = {
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入商铺名称',
      },
      // 字段名
      fieldName: 'shop_name',
      // 界面显示的label
      label: '商铺名称',
      rules: 'required',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入收货地址',
      },
      // 字段名
      fieldName: 'address',
      // 界面显示的label
      label: '收货地址',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: [],
        allowClear: true,
        filterOption: true,
        immediate: false,
        optionFilterProp: "label",
        placeholder: '请选择',
        showSearch: true,
      },
      defaultValue: undefined,
      fieldName: 'customer_id',
      label: '关联客户',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入联系方式',
      },
      // 字段名
      fieldName: 'tel',
      // 界面显示的label
      label: '联系方式',
    },
  ],
}

const [Form, formApi] = vbenForm(cus, onSubmit);


async function onSubmit(values: Record<string, any>) {
  drawerApi.close();

  await addressUpdate({
    id: row.value.id,
    shop_name: values.shop_name, 
    address: values.address, 
    tel: values.tel, 
    customer_id: values.customer_id,
  })
  message.success('更新客户地址成功')
  
    
  if (props.refresh) {
    props.refresh()
  }
  
}

</script>

<template>
  <Drawer> 
    <Form />
  </Drawer>
</template>

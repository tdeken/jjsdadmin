<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { addressCreate, addressUpdate } from '#/api';

import { ref } from 'vue';


const row = ref()

interface Props {
  refreshAddress?:()=>void, 
}

const props = defineProps<Props>()

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    formApi.submitForm();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      fullCustomers()
      updateRow()
    }
  },
});

function fullCustomers(){
  formApi.updateSchema([
    {
      componentProps: {
        options: drawerApi.getData()?.customers,
      },
      fieldName: 'customer_id',
    }
  ])
}

function updateRow(){
  if (!drawerApi.getData()?.row) return

  const data = drawerApi.getData()?.row
  row.value = data

  formApi.updateSchema([
    {
      fieldName: 'customer_id',
      defaultValue: data.customer_id
    },
    {
      fieldName: 'title',
      defaultValue: data.title
    },
    {
      fieldName: 'address',
      defaultValue: data.address
    },
    {
      fieldName: 'tel',
      defaultValue: data.tel
    }
  ])
}



const [Form, formApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入商铺名称',
      },
      // 字段名
      fieldName: 'title',
      // 界面显示的label
      label: '商铺名称',
      rules: 'required',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入收获地址',
      },
      // 字段名
      fieldName: 'address',
      // 界面显示的label
      label: '收获地址',
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
  wrapperClass: 'grid-cols-1',
});


async function onSubmit(values: Record<string, any>) {

  if (row.value) {
    await addressUpdate({
      id: row.value.id,
      title: values.title, 
      address: values.address, 
      tel: values.tel, 
      customer_id: values.customer_id,
    })
  } else {
    await addressCreate({
      title: values.title, 
      address: values.address, 
      tel: values.tel, 
      customer_id: values.customer_id,
    })
  }
  
    
  if (props.refreshAddress) {
    props.refreshAddress()
  }
    
  drawerApi.close();
}

</script>

<template>
  <Drawer> 
    <Form />
  </Drawer>
</template>

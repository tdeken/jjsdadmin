<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { customerCreate, customerUpdate } from '#/api';
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
      fieldName: 'name',
      defaultValue: data.name
    },
    {
      fieldName: 'phone',
      defaultValue: data.phone
    },
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
      fieldName: 'name',
      // 界面显示的label
      label: '商铺名称',
      rules: 'required',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入联系方式',
      },
      // 字段名
      fieldName: 'phone',
      // 界面显示的label
      label: '联系方式',
    },
  ],
  wrapperClass: 'grid-cols-1',
});


async function onSubmit(values: Record<string, any>) {
  drawerApi.close();

  if (row.value) {
    await customerUpdate({
      id: row.value.id,
      name: values.name, 
      phone: values.phone,
    })
    message.success('更新客户成功')
  } else {
    await customerCreate({
      name: values.name, 
      phone: values.phone,
    })
    message.success('新增客户成功')
  }
    
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

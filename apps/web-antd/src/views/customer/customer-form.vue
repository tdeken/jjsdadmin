<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { vbenForm } from '#/utils';
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
    formApi.validateAndSubmitForm();
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
  const data = drawerApi.getData()?.row
  row.value = data

  formApi.updateSchema([
    {
      fieldName: 'name',
      defaultValue: data?.name || ''
    },
    {
      fieldName: 'phone',
      defaultValue: data?.phone || ''
    },
  ])
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
}

const [Form, formApi] = vbenForm(cus, onSubmit);

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

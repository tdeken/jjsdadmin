<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { goodsCreate, addressUpdate } from '#/api';
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
      updateRow()
    }
  },
});

function updateRow(){
  if (!drawerApi.getData()?.row) return

  const data = drawerApi.getData()?.row
  row.value = data

  formApi.updateSchema([
    {
      fieldName: 'title',
      defaultValue: data.title
    },
    {
      fieldName: 'as_title',
      defaultValue: data.as_title
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
        placeholder: '请输入商品名称',
      },
      // 字段名
      fieldName: 'title',
      // 界面显示的label
      label: '商品名称',
      rules: 'required',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入商品别名，方便搜索',
      },
      // 字段名
      fieldName: 'address',
      // 界面显示的label
      label: '商品别名',
    }
  ],
  wrapperClass: 'grid-cols-1',
});


async function onSubmit(values: Record<string, any>) {
  drawerApi.close();

  if (row.value) {
    await addressUpdate({
      id: row.value.id,
      title: values.title, 
      address: values.address, 
      tel: values.tel, 
      customer_id: values.customer_id,
    })
    message.success('更新商品成功')
  } else {
    await goodsCreate({
      title: values.title, 
      as_title: values.as_title,
    })
    message.success('新增商品成功')
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

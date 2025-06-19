<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { vbenForm } from '#/utils';
import { goodsCreate } from '#/api';
import { message } from 'ant-design-vue';

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
    }
  },
});

const cus = {
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
      fieldName: 'as_title',
      // 界面显示的label
      label: '商品别名',
    }
  ],
}

const [Form, formApi] = vbenForm(cus, onSubmit);

async function onSubmit(values: Record<string, any>) {
  drawerApi.close();

  await goodsCreate({
    title: values.title, 
    as_title: values.as_title,
  })
  message.success('新增商品成功')
    
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

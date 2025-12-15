<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { vbenForm } from '#/utils';
import { goodsCreate } from '#/api';
import { message } from 'ant-design-vue';
import { GoodsFormSchema, GoodsInitForm } from './form';
import { STORE } from '#/constants';

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const onSubmit = async (values: Record<string, any>) => {
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

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel: () => {
    drawerApi.close();
  },
  onConfirm: () => {
    formApi.validateAndSubmitForm();
  },
  onOpenChange: (isOpen) => {
    if (isOpen) {
      GoodsInitForm(STORE, drawerApi, formApi)
    }
  },
});


const [Form, formApi] = vbenForm(GoodsFormSchema(STORE), onSubmit);



</script>

<template>
  <Drawer> 
    <Form />
  </Drawer>
</template>

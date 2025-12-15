<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { vbenForm } from '#/utils';
import { goodsUpdate } from '#/api';
import { message } from 'ant-design-vue';

import { UPDATE } from '#/constants';
import { GoodsFormSchema, GoodsInitForm } from './form';

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const onSubmit = async (values: Record<string, any>) => {
  drawerApi.close();

  await goodsUpdate({
    id: drawerApi.getData().row.id,
    title: values.title, 
    as_title: values.as_title,
  })
  message.success('更新商品成功')
    
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
      GoodsInitForm(UPDATE, drawerApi, formApi)
    }
  },
});

const [Form, formApi] = vbenForm(GoodsFormSchema(UPDATE), onSubmit);

</script>

<template>
  <Drawer> 
    <Form />
  </Drawer>
</template>

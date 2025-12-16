<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { vbenForm } from '#/utils';
import { addressCreate } from '#/api';
import { message } from 'ant-design-vue';
import { AddressFormSchema, AddressInitForm } from './form';
import { STORE, UPDATE } from '#/constants';

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel: () => {
    drawerApi.close();
  },
  onConfirm: () => {
    formApi.validateAndSubmitForm();
  },
  onOpenChange: (isOpen) => {
    if (isOpen) {
      AddressInitForm(STORE, drawerApi, formApi)
    }
  },
});

const onSubmit = async (values: Record<string, any>) => {
  drawerApi.close();

  await addressCreate({
    shop_name: values.shop_name, 
    address: values.address, 
    tel: values.tel, 
    customer_id: values.customer_id,
  })
  message.success('新增客户地址成功')
    
  if (props.refresh) {
    props.refresh()
  }

  formApi.resetForm();
}

const [Form, formApi] = vbenForm(AddressFormSchema(UPDATE), onSubmit);

</script>

<template>
  <Drawer> 
    <Form />
  </Drawer>
</template>

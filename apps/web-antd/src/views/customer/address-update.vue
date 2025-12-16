<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { vbenForm } from '#/utils';
import { addressUpdate } from '#/api';
import { message } from 'ant-design-vue';

import { AddressFormSchema, AddressInitForm } from './form';
import { UPDATE } from '#/constants';

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel:() => {
    drawerApi.close();
  },
  onConfirm: () => {
    formApi.validateAndSubmitForm();
  },
  onOpenChange: (isOpen) => {
    if (isOpen) {
      AddressInitForm(UPDATE, drawerApi, formApi)
    }
  },
});

const onSubmit = async (values: Record<string, any>) => {
  drawerApi.close();

  await addressUpdate({
    id: drawerApi.getData().row.id,
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

const [Form, formApi] = vbenForm(AddressFormSchema(UPDATE), onSubmit);

</script>

<template>
  <Drawer> 
    <Form />
  </Drawer>
</template>

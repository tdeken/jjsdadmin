<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { vbenForm } from '#/utils';
import { customerUpdate } from '#/api';
import { message } from 'ant-design-vue';

import { CustomerFormSchema, CustomerInitForm } from './form';
import { UPDATE } from '#/constants';

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
      CustomerInitForm(UPDATE, drawerApi, formApi)
    }
  },
});

const onSubmit = async (values: Record<string, any>) => {
  drawerApi.close();

  await customerUpdate({
    id: drawerApi.getData().row.id,
    name: values.name, 
    phone: values.phone,
  })
  message.success('更新客户成功')
    
  if (props.refresh) {
    props.refresh()
  }

}

const [Form, formApi] = vbenForm(CustomerFormSchema(UPDATE), onSubmit);

</script>

<template>
  <Drawer> 
    <Form />
  </Drawer>
</template>

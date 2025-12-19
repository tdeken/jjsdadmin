<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { goodsSkuCreate } from '#/api';
import { message } from 'ant-design-vue';

import { vbenForm, priceFloat } from '#/utils';
import { InitForm, FormSchema } from './form';
import { STORE } from '#/constants';

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel: () => {
    drawerApi.close();
  },
  onConfirm: () => {
    formApi.submitForm();
  },
  onOpenChange: (isOpen) => {
    if (isOpen) {
      InitForm(STORE, drawerApi, formApi)
    }
  },
});

const onSubmit =  async (values: Record<string, any>) => {
  drawerApi.close();

  let stock:number =  parseInt(values.stock)
  let stockTip:number =  parseInt(values.stock_tip)
  let pp:string = priceFloat(values.pp)
  let wp:string = priceFloat(values.wp)
  let rp:string = priceFloat(values.rp)
  
  await goodsSkuCreate({
    goods_id: values.goods_id,
    remark: values.remark,
    format: values.format,
    unit: values.unit,
    pp: pp,
    wp: wp,
    rp: rp,
    stock: stock,
    stock_tip: stockTip,
    number: values.number,
    capacity: values.capacity,
    short_name: values.short_name,
  })
  message.success('新增销售品成功')

  if (props.refresh) {
    props.refresh()
  }
}

const [Form, formApi] = vbenForm(FormSchema(STORE), onSubmit);

</script>

<template>
  <Drawer> 
    <Form />
  </Drawer>
</template>

<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { ref, h } from 'vue';

import { vbenForm, priceFloat } from '#/utils';
import {  orderCartAdd, orderCartUpdate } from '#/api';

import type { CartSku, CartSelect } from './types';

const row = ref<CartSku>() 
const dataMap = ref<Map<string, CartSelect>>(new Map());
const findById = (id: string): CartSelect | undefined => {
  return dataMap.value.get(id)
}

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()
const addressId = ref<string>('')
const orderId = ref<string>('')

const [Modal, drawerApi] = useVbenModal({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    formApi.validateAndSubmitForm();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      updateRow()
    }
  },
});

function updateRow(){
  const data = drawerApi.getData()

  addressId.value = data.address_id
  orderId.value = data.order_id

  const options: any[] = []
  data.cart_select.forEach((row: CartSelect) => {
    dataMap.value.set(row.id, row)
    options.push({
      value: row.id,
      label: row.name
    })
  });


  if (!data.row) {
    formApi.updateSchema([
      {
        fieldName: 'id',
        componentProps: {
          options: options,
        }
      }
    ])
    return
  }

  row.value = data.row as CartSku;

  const option = findById(row.value.id)
  var price =  {
      fieldName: 'price',
      defaultValue: row.value.price || '0',
      description: () => h('span', ''),
    }
  if (option?.last_price !== '0.00') {
    price = {
      fieldName: 'price',
      defaultValue: row.value.price || '0',
      description: () => h('p', { class: 'text-red-600' }, '最近购买 '+ option?.last_price +' 元'),
    }
  }

  formApi.resetForm()
  formApi.updateSchema([
    {
      fieldName: 'id',
      componentProps: {
        options: options,
      },
      defaultValue: row.value.sku_id || ''
    },
    {
      fieldName: 'book_num',
      defaultValue: row.value.book_num || '1'
    },
    {
      fieldName: 'remark',
      defaultValue: row.value.remark || ''
    },
    price,
  ])
}

const cus = {
  schema: [
    {
      component: 'Select',
      componentProps: {
        options: [],
        allowClear: true,
        filterOption: true,
        immediate: false,
        optionFilterProp: "label",
        placeholder: '请选择',
        showSearch: true,
      },
      defaultValue: undefined,
      fieldName: 'id',
      label: '下订商品',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入商品别名，方便搜索',
        step:"0.01",
        min:"0",
        defaultValue:0,
        style: { width: '25%' }
      },
      dependencies: {
        triggerFields: ['id'],
        trigger(values: any) {
          if (!values.id) return
          const row = findById(values.id)
          if (!row) return 

          formApi.setFieldValue("price", row.price)
          if (row.last_price !== '0.00')
          {
            formApi.updateSchema([
              {
                fieldName: 'price',
                description: () => h('span', { class: 'text-red-600' }, '最近售价 '+row.last_price+' 元')
              }
            ])
          } else {
            formApi.updateSchema([
              {
                fieldName: 'price',
                description: ''
              }
            ])
          }
        }
      },
      // 字段名
      fieldName: 'price',
      // 界面显示的label
      label: '商品价格',
    },
    {
      component: 'InputNumber',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入下订数量',
        step:"0.5",
        min:"0.5",
        defaultValue: "1",
        style: {width: '15%'}
      },
      // 字段名
      fieldName: 'book_num',
      // 界面显示的label
      label: '下订数量',
    },
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Textarea',
      // 对应组件的参数
      componentProps: {
        placeholder: '选填',
        rows: 4,
      },
      // 字段名
      fieldName: 'remark',
      // 界面显示的label
      label: '备注',
    },
  ],
}

const [Form, formApi] = vbenForm(cus, onSubmit);

async function onSubmit(values: Record<string, any>) {
  drawerApi.close();
  
  console.log(values)

  const price = priceFloat(values.price)
  var bookNum = priceFloat(values.book_num)
  if (!values.book_num) {
    bookNum = "1"
  }

  if (!row.value) {
    await orderCartAdd({
      address_id: addressId.value,
      order_id: orderId.value,
      sku_id: values.id,
      book_num: bookNum,
      price: price,
      remark: values.remark,
    })
  } else {
    await orderCartUpdate({
      id: row.value.id,
      address_id: addressId.value,
      order_id: orderId.value,
      sku_id: values.id,
      book_num: bookNum,
      price: price,
      remark: values.remark,
    })
  }
  
   if (props.refresh) {
    props.refresh()
  }
}

</script>

<template>
  <Modal> 
    <Form >

    </Form>
  </Modal>
</template>

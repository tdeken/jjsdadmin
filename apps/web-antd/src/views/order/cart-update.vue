<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { ref, h } from 'vue';
import { debounce } from 'lodash-es';

import { vbenForm, priceFloat } from '#/utils';
import { orderCartUpdate, orderCartSku } from '#/api';

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
const searchText = ref<string>('')

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
      label: row.name + " / " + row.unit
    })
  });

  row.value = data.row as CartSku;

  const sku = findById(row.value.sku_id)
  var price =  {
      fieldName: 'price',
      defaultValue: row.value.price || '0',
      description: () => h('span', ''),
    }
  if (sku && sku.last_price !== '0.00') {
    price = {
      fieldName: 'price',
      defaultValue: row.value.price || '0',
      description: () => h('p', { class: 'text-red-600' }, '最近购买 '+ sku.last_price +' 元'),
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

  formApi.setFieldValue('id', row.value?.id || undefined)
  formApi.setFieldValue('book_num', row.value?.book_num || '1')
  formApi.setFieldValue('remark', row.value?.remark || '')
}

const cus = {
  schema: [
    {
      component: 'Select',
      componentProps: {
        options: [],
        allowClear: true,
        filterOption: false,
        immediate: false,
        optionFilterProp: "label",
        placeholder: '请选择',
        showSearch: true,
        onSearch: (keyword: string) => {
          if (searchText.value === keyword) return
          searchText.value = keyword
          handleSearch(keyword)
        },
        onChange: (val: string) => {
          handleChange(val)
        }
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

  const price = priceFloat(values.price)
  var bookNum = priceFloat(values.book_num)
  if (!values.book_num) {
    bookNum = "1"
  }
 
  await orderCartUpdate({
    id: row.value?.id as string,
    address_id: addressId.value,
    order_id: orderId.value,
    sku_id: values.id,
    book_num: bookNum,
    price: price,
    remark: values.remark,
  })
  
  if (props.refresh) {
    props.refresh()
  }
}

// 防抖函数（500ms 延迟）
const handleSearch = debounce(async (keyword = '') => {
  try {
    const params = { address_id: addressId.value , keyword}
    const data = await orderCartSku(params);
    formApi.updateSchema([
    {
      fieldName: 'id',
      componentProps: {
        options: data.list.map((item : CartSelect) => ({
          label: item.name + "/" + item.unit,
          value: item.id,
        })),
      }
    }
  ])


  } catch (error) {
    console.error('搜索失败:', error);
  }
}, 300);

const handleChange = (id: string) => {
  const row = findById(id)
  if (!row) return 

  formApi.setFieldValue("price", row.price)

  if (row.last_price !== '0.00') {
    formApi.updateSchema([
      {
        fieldName: 'price',
        description: () => h('span', { class: 'text-red-600' }, '最近售价 '+row.last_price+' 元')
      }
    ])
    return
  }

  formApi.updateSchema([
    {
      fieldName: 'price',
      description: ''
    }
  ])
}


</script>

<template>
  <Modal> 
    <Form >

    </Form>
  </Modal>
</template>

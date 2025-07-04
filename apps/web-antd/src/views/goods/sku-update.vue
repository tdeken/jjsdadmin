<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { goodsSkuUpdate } from '#/api';
import { message } from 'ant-design-vue';

import { vbenForm, priceFloat } from '#/utils';
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

  const format = drawerApi.getData()?.format
  const unit = drawerApi.getData()?.unit
  const data = drawerApi.getData()?.row
  row.value = data

  formApi.setFieldValue('capacity', data?.capacity || '')
  formApi.setFieldValue('short_name', data?.short_name || '')
  formApi.setFieldValue('remark', data?.remark || '')
  formApi.setFieldValue('format', data?.format || '')
  formApi.setFieldValue('unit', data?.unit || '')
  formApi.setFieldValue('pp', data?.pp || '0')
  formApi.setFieldValue('wp', data?.wp || '0')
  formApi.setFieldValue('rp', data?.rp || '0')
  formApi.setFieldValue('stock', data?.stock || '-1')
  formApi.setFieldValue('number', data?.number || '-1')

  formApi.updateSchema([
    {
      componentProps: {
        options: format,
      },
      fieldName: 'format',
    },
    {
      componentProps: {
        options: unit,
      },
      fieldName: 'unit',
    },
  ])
}

const cus = {
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '选填，请输入商品重量，如200g，250ml',
      },
      // 字段名
      fieldName: 'capacity',
      // 界面显示的label
      label: '商品重量',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '选填，请输入商品备注，如：原味，蓝莓味',
      },
      // 字段名
      fieldName: 'remark',
      // 界面显示的label
      label: '商品备注',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '选填，请输入一些关键词',
      },
      // 字段名
      fieldName: 'short_name',
      // 界面显示的label
      label: '简称',
    },
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
      fieldName: 'format',
      label: '商品规格',
      rules: 'required',
    },
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
      fieldName: 'unit',
      label: '商品单位',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
        step: '0.01',
        min: "0",
        style: "width: 100px",
      },
      fieldName: 'pp',
      label: '采购价',
      suffix: () => '（元）',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
        step: '0.01',
        min: "0",
        style: "width: 100px",
      },
      fieldName: 'wp',
      label: '批发价',
      suffix: () => '（元）',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
        step: '0.01',
        min: "0",
        style: "width: 100px",
      },
      fieldName: 'rp',
      label: '零售价',
      suffix: () => '（元）',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
        min: "-1",
        style: "width: 100px",
      },
      fieldName: 'stock',
      label: '库存',
      suffix: () => '（-1表示不限制）',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '选填，请输入商品备注，如：原味，蓝莓味',
      },
      // 字段名
      fieldName: 'number',
      // 界面显示的label
      label: '商品编码',
    },
  ],
}

const [Form, formApi] = vbenForm(cus, onSubmit);

async function onSubmit(values: Record<string, any>) {
  drawerApi.close();

  let stock:number =  parseInt(values.stock)
  let pp:string = priceFloat(values.pp)
  let wp:string = priceFloat(values.wp)
  let rp:string = priceFloat(values.rp)

  await goodsSkuUpdate({
    id: row.value.id,
    goods_id: row.value.goods_id,
    remark: values.remark,
    format: values.format,
    unit: values.unit,
    pp: pp,
    wp: wp,
    rp: rp,
    stock: stock,
    number: values.number,
    capacity: values.capacity,
    short_name: values.short_name,
  })
  message.success('更新商品成功')
  
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

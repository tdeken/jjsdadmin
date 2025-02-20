<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { goodsSkuCreate, goodsSkuUpdate } from '#/api';
import { message } from 'ant-design-vue';

import { vbenForm, priceFloat } from '#/utils';
import { ref } from 'vue';

const row = ref()
let goodsId = ""

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

  goodsId = drawerApi.getData()?.goods_id

  formApi.updateSchema([
    {
      fieldName: 'capacity',
      defaultValue: data?.capacity || ''
    },
    {
      fieldName: 'remark',
      defaultValue: data?.remark || ''
    },
    {
      componentProps: {
        options: drawerApi.getData()?.format,
      },
      fieldName: 'format',
      defaultValue: data?.format || format.value?.[0].value,
    },
    {
      componentProps: {
        options: drawerApi.getData()?.unit,
      },
      fieldName: 'unit',
      defaultValue: data?.unit || unit.value?.[0].value,
    },
    {
      fieldName: 'pp',
      defaultValue: data?.pp || '0',
    },
    {
      fieldName: 'wp',
      defaultValue: data?.wp || '0',
    },
    {
      fieldName: 'rp',
      defaultValue: data?.rp || '0',
    },
    {
      fieldName: 'stock',
      defaultValue: data?.stock || '-1',
    },
    {
      fieldName: 'number',
      defaultValue: data?.number || ''
    }
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


  if (!row.value || drawerApi.getData()?.copy) {
    await goodsSkuCreate({
      goods_id: goodsId,
      remark: values.remark,
      format: values.format,
      unit: values.unit,
      pp: pp,
      wp: wp,
      rp: rp,
      stock: stock,
      number: values.number,
      capacity: values.capacity,
    })
    message.success('新增销售品成功')

  } else {
    await goodsSkuUpdate({
      id: row.value.id,
      goods_id: goodsId,
      remark: values.remark,
      format: values.format,
      unit: values.unit,
      pp: pp,
      wp: wp,
      rp: rp,
      stock: stock,
      number: values.number,
      capacity: values.capacity,
    })
    message.success('更新商品成功')
  
  }

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

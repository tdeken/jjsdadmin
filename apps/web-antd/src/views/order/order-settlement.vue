<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { vbenForm, priceFloat } from '#/utils';
import { orderSettlement } from '#/api';

import dayjs from 'dayjs';
import { message } from 'ant-design-vue';

interface Props {
  refresh?:()=>void, 
}

const props = defineProps<Props>()

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

const updateRow = () => {
  const data = drawerApi.getData()
  
  formApi.updateSchema([
    {
      fieldName: 'amount',
      defaultValue: data?.amount || '',
    },
    {
      fieldName: 'real_amount',
      defaultValue: data?.real_amount == "0.00" ? data?.amount : data?.real_amount,
    },
    {
      fieldName: 'remark',
      defaultValue: data?.remark || '',
    },
    {
      fieldName: 'next_date',
      defaultValue: data?.next_date == '' ? dayjs().add(7, 'day') : dayjs(data?.next_date),
    },
  ])

  formApi.setFieldValue('amount', data?.amount || '')
  formApi.setFieldValue('real_amount', data?.real_amount == "0.00" ? data?.amount : data?.real_amount)
  formApi.setFieldValue('remark', data?.remark || '')
  formApi.setFieldValue('next_date', data?.next_date == '' ? dayjs().add(7, 'day') : dayjs(data?.next_date))
}

const cus = {
  schema: [
    {
      component: 'InputNumber',
      // 对应组件的参数
      componentProps: {
         style: { width: '25%' }
      },
      // 字段名
      fieldName: 'amount',
      // 界面显示的label
      label: '订单金额',
      disabled: true,
      suffix: '元',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: '立即清算',
            value: 1,
          },
          {
            label: '延期清算',
            value: 2,
          },
        ],
      },
      defaultValue: 1,
      fieldName: 'source',
      label: '结算方式',
      rules: 'selectRequired',
    },
    {
      component: 'InputNumber',
      // 对应组件的参数
      componentProps: {
        step:"0.01",
        min:"0",
        defaultValue: 0,
        style: { width: '25%' }
      },
      // 字段名
      fieldName: 'real_amount',
      // 界面显示的label
      label: '实收金额',
      suffix: '元',
      rules: 'required',
    },
    {
      component: 'DatePicker',
      componentProps: {
        valueformat:"YYYY-MM-DD",
        format:"YYYY-MM-DD",
      },
      fieldName: 'next_date',
      label: '下次结算日期',
      dependencies: {
        show(values: any) {
          return values.source === 2;
        },
        
        required(values: any) {
           return values.source === 2;
        },

        // 随意一个字段改变时，都会触发
        triggerFields: ['source'],
      },
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

const onSubmit = async (values: Record<string, any>) => {
  drawerApi.close();

  await orderSettlement({
    order_id: drawerApi.getData().id,
    real_amount: priceFloat(values.real_amount),
    source: values.source,
    next_date: values.next_date.format("YYYY-MM-DD"),
    remark: values.remark,
  })

  message.success('结算处理成功')
  
   if (props.refresh) {
    props.refresh()
  }
}

const [Form, formApi] = vbenForm(cus, onSubmit);

</script>

<template>
  <Modal> 
    <Form >
    </Form>
  </Modal>
</template>

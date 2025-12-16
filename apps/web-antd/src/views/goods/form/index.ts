import { STORE } from "#/constants"
import type { BaseFormComponentType, ExtendedDrawerApi, ExtendedFormApi, VbenFormProps } from "@vben/common-ui"

const copyField = (mark: string, formApi: ExtendedFormApi, unit: any, format : any, goods: any, data: any) => {

  if (mark === STORE) {
    formApi.updateSchema([
      {
        componentProps: {
          options:  goods.value.map((row: any) => {
            return {
                value: row.id,
                label: row.title,
            }
          }),
        },
        fieldName: 'goods_id',
      },
      {
        componentProps: {
          options: format,
        },
        fieldName: 'format',
        defaultValue: format.value?.[0].value ,
      },
      {
        componentProps: {
          options: unit,
        },
        fieldName: 'unit',
        defaultValue:  unit.value?.[0].value,
      }
    ])
    
    return
  }


  formApi.updateSchema([
    {
      fieldName: 'capacity',
      defaultValue: data?.capacity || ''
    },
    {
      fieldName: 'short_name',
      defaultValue: data?.short_name || ''
    },
    {
      fieldName: 'remark',
      defaultValue: data?.remark || ''
    },
    {
      componentProps: {
        options: format,
      },
      fieldName: 'format',
      defaultValue: data?.format || format.value?.[0].value,
    },
    {
      componentProps: {
        options: unit,
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

  formApi.setFieldValue('capacity', data?.capacity || '')
  formApi.setFieldValue('short_name', data?.short_name || '')
  formApi.setFieldValue('remark', data?.remark || '')
  formApi.setFieldValue('format', data?.format || format.value?.[0].value)
  formApi.setFieldValue('unit', data?.unit || unit.value?.[0].value)
  formApi.setFieldValue('pp', data?.pp || '0')
  formApi.setFieldValue('wp', data?.wp || '0')
  formApi.setFieldValue('rp', data?.rp || '0')
  formApi.setFieldValue('stock', data?.stock || '-1')
  formApi.setFieldValue('number', data?.number || '')

}

const FormSchema = (mark: string) => {
  var vfp: VbenFormProps<BaseFormComponentType> = {
      schema: []
  }

  const fixedSchema = [
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
      defaultValue: '0',
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
      defaultValue: '0',
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
      defaultValue: '0',
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
      defaultValue: '-1',
      fieldName: 'stock',
      label: '库存',
      suffix: () => '（-1表示不限制）',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '选填，请输入商品商品编码',
      },
      // 字段名
      fieldName: 'number',
      // 界面显示的label
      label: '商品编码',
    },
  ]

  if (mark === STORE) {
    vfp.schema?.push({
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
      fieldName: 'goods_id',
      label: '绑定商品',
      rules: 'required',
    })
  }

  vfp.schema?.push(...fixedSchema)
  
  return vfp
}

const InitForm = (mark: string, drawerApi: ExtendedDrawerApi, formApi: ExtendedFormApi) => {
    const format = drawerApi.getData()?.format
    const unit = drawerApi.getData()?.unit

    if (mark === STORE) {
      const goods = drawerApi.getData()?.goods
      formApi.resetForm()
      copyField(STORE, formApi, unit, format, goods, null)
      return
    }
    
    const data = drawerApi.getData()?.row
    formApi.resetForm()
    copyField(mark, formApi, unit, format, null, data)
}


const goodsCopyField = (mark: string, formApi: ExtendedFormApi, data: any) => {

  if (mark === STORE) {  
    return
  }


  formApi.updateSchema([
    {
      fieldName: 'title',
      defaultValue: data?.title || '',
    },
    {
      fieldName: 'as_title',
      defaultValue: data?.as_title || '',
    }
  ])

  formApi.setFieldValue('title', data?.title || '')
  formApi.setFieldValue('as_title', data?.as_title || '')

}

const GoodsFormSchema = (mark: string) => {
  var vfp: VbenFormProps<BaseFormComponentType> = {
      schema: []
  }

  if (mark === "") {
    return vfp
  }

  const fixedSchema = [
   {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入商品名称',
      },
      // 字段名
      fieldName: 'title',
      // 界面显示的label
      label: '商品名称',
      rules: 'required',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入商品别名，方便搜索',
      },
      // 字段名
      fieldName: 'as_title',
      // 界面显示的label
      label: '商品别名',
    }
  ]

  vfp.schema?.push(...fixedSchema)
  
  return vfp
}

const GoodsInitForm = (mark: string, drawerApi: ExtendedDrawerApi, formApi: ExtendedFormApi) => {
    if (mark === STORE) {
      formApi.resetForm()
      goodsCopyField(STORE, formApi, null)
      return
    }
    
    const data = drawerApi.getData()?.row
    formApi.resetForm()
    goodsCopyField(mark, formApi, data)
}


export { FormSchema, InitForm, GoodsFormSchema, GoodsInitForm }
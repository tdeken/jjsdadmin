import { STORE } from "#/constants"
import type { BaseFormComponentType, ExtendedDrawerApi, ExtendedFormApi, VbenFormProps } from "@vben/common-ui"

const customerCopyField = (mark: string, formApi: ExtendedFormApi, data: any) => {

  if (mark === STORE) {  
    return
  }

  formApi.updateSchema([
    {
      fieldName: 'name',
      defaultValue: data?.name || '',
    },
    {
      fieldName: 'phone',
      defaultValue: data?.phone || '',
    },
  ])

  formApi.setFieldValue('name', data?.name || '')
  formApi.setFieldValue('phone', data?.phone || '')

}

const CustomerFormSchema = (mark: string) => {
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
        placeholder: '请输入商铺名称',
      },
      // 字段名
      fieldName: 'name',
      // 界面显示的label
      label: '商铺名称',
      rules: 'required',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入联系方式',
      },
      // 字段名
      fieldName: 'phone',
      // 界面显示的label
      label: '联系方式',
    },
  ]

  vfp.schema?.push(...fixedSchema)
  
  return vfp
}

const CustomerInitForm = (mark: string, drawerApi: ExtendedDrawerApi, formApi: ExtendedFormApi) => {
    if (mark === STORE) {
      formApi.resetForm()
      customerCopyField(STORE, formApi, null)
      return
    }
    
    const data = drawerApi.getData()?.row
    formApi.resetForm()
    customerCopyField(mark, formApi, data)
}

const addressCopyField = (mark: string, formApi: ExtendedFormApi, customers: any, customerId: any, data: any) => {

  if (mark === STORE) {  
    formApi.updateSchema([
    {
      componentProps: {
        options: customers,
      },
      fieldName: 'customer_id',
      defaultValue: customerId,
    }
  ])
    return
  }

  formApi.updateSchema([
    {
      componentProps: {
        options: customers,
      },
      fieldName: 'customer_id',
      defaultValue: data?.customer_id || customerId,
    },
    {
      fieldName: 'shop_name',
      defaultValue: data?.shop_name || '',
    },
    {
      fieldName: 'address',
      defaultValue: data?.address || '',
    },
    {
      fieldName: 'tel',
      defaultValue: data?.tel || '',
    }
  ])

  if (!data?.customer_id) {
    formApi.setFieldValue('customer_id', undefined)
  } else {
    formApi.setFieldValue('customer_id', data.customer_id)
  }
  
  formApi.setFieldValue('shop_name', data?.shop_name || '')
  formApi.setFieldValue('address', data?.address || '')
  formApi.setFieldValue('tel', data?.tel || '')

}

const AddressFormSchema = (mark: string) => {
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
        placeholder: '请输入商铺名称',
      },
      // 字段名
      fieldName: 'shop_name',
      // 界面显示的label
      label: '商铺名称',
      rules: 'required',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入收货地址',
      },
      // 字段名
      fieldName: 'address',
      // 界面显示的label
      label: '收货地址',
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
      fieldName: 'customer_id',
      label: '关联客户',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入联系方式',
      },
      // 字段名
      fieldName: 'tel',
      // 界面显示的label
      label: '联系方式',
    },
  ]

  vfp.schema?.push(...fixedSchema)
  
  return vfp
}

const AddressInitForm = (mark: string, drawerApi: ExtendedDrawerApi, formApi: ExtendedFormApi) => {
  const customers = drawerApi.getData()?.customers
  const customerId = drawerApi.getData()?.customer_id
  if (mark === STORE) {
    formApi.resetForm()
    addressCopyField(STORE, formApi, customers, customerId, null)
    return
  }
  
  const data = drawerApi.getData()?.row
  formApi.resetForm()
  addressCopyField(mark, formApi, customers, customerId, data)
}



export { CustomerFormSchema, CustomerInitForm, AddressFormSchema, AddressInitForm }
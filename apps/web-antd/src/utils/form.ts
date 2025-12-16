import { customerSelect } from "#/api"
import { useVbenForm } from '#/adapter/form';
import type { VbenFormProps } from '#/adapter/form';
import { useVbenDrawer, type ExtendedDrawerApi, type ExtendedFormApi } from "@vben/common-ui";


 async function customerSelector(){
  const data = await customerSelect()
  return data.list.map(item=>{
    return {
      label: item.name,
      value: item.id,
    }
  })
}

function vbenForm (cus: VbenFormProps, onSubmit: any)  {
  const conf:VbenFormProps  = {
      // 所有表单项共用，可单独在表单内覆盖
    commonConfig: {
      // 所有表单项
      componentProps: {
        class: 'w-full',
      },
    },
    // 提交函数
    handleSubmit: onSubmit,
    // 垂直布局，label和input在不同行，值为vertical
    // 水平布局，label和input在同一行
    layout: 'horizontal',
    resetButtonOptions: {
      show: false,
    },
    submitButtonOptions: {
      show: false,
    },
    wrapperClass: 'grid-cols-1',
  }
  return useVbenForm({...cus, ...conf})
}

export { customerSelector, vbenForm }
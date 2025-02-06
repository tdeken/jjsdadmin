<template>
  <Drawer> 
      <Form 
        ref="formRef"
        name="spu_form"
        :model="dataForm"
      >
      <FormItem name="title" label="商品名称" :rules="[{ required: true, message: '商品名称必填' }]" >
        <Input v-model:value="dataForm.title" placeholder="请输入商品名称"  />
      </FormItem>
      
      <FormItem name="as_title" label="商品别名" >
        <Input v-model:value="dataForm.as_title" placeholder="请输入商品别名"  />
      </FormItem>

      <FormItem name="code" label="商品编码" >
        <Input v-model:value="dataForm.code" placeholder="请输入商品编码"  />
      </FormItem>
      <FormItem
        v-for="(attrs, idx) in dataForm.sku_attrs"
        :name="['sku_attrs', idx]"
      >
        <div style="padding-bottom: 5px;">
          {{ attrGroupLabel(idx) }} 
          <Button style="margin-left: 20px;">添加属性组</Button>
        </div>
        
        <Space
          v-for="(attr) in attrs"
          style="display: block; margin-bottom: 8px; padding: 0px;; border: 1px solid #444; position: relative;"
        >
          
          <FormItem label="展示类型" :label-col="{ offset: 1}" style="padding-top: 10px;" >
            <RadioGroup 
              v-model:value="attr.show_type" 
              name="show_type"
              :options="showRadio"
            >
            </RadioGroup>
          </FormItem>

          <CloseCircleOutlined style=" position: absolute; right:10px; top: 5px; " @click="removeAttr(idx, attr)" /> 
        </Space>
      </FormItem>
    </Form>
  </Drawer>
</template>

<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { message, FormItem, Input, Form, RadioGroup, Space, Button } from 'ant-design-vue';

import { ref, reactive, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';
import type { FormInstance, RadioGroupProps } from 'ant-design-vue';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';

interface SpuForm {
  id: string; 
  title: string; 
  as_title: string; 
  code: string; 
  sku_attrs: GoodsAttrs[][]
}

interface GoodsAttrs {
  mark: string;
  show_type: number;
}

const formRef = ref<FormInstance>();
const dataForm: UnwrapRef<SpuForm> = reactive({
  id: "",
  title: "",
  as_title: "",
  code: "",
  sku_attrs: []
});

interface Props {
  refresh:()=>void, 
}

const props = defineProps<Props>()

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    formRef.value?.validate()
      .then(()=>{
        console.log('values', dataForm, toRaw(dataForm))

        // drawerApi.close();
        // props.refresh()
      })
      .catch((_error) => {
      
      })
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      updateRow()
    }
  },
});

const removeAttr = (idx: number, item: GoodsAttrs) => {
  if (!dataForm.sku_attrs[idx]) {
    return
  }

  const index = dataForm.sku_attrs[idx].indexOf(item)
  if (index !== -1 && dataForm.sku_attrs[idx] ) {
    dataForm.sku_attrs[idx].splice(index, 1)
  }
}

function updateRow(){
  if (!drawerApi.getData()?.row) {
    dataForm.title = ""
    dataForm.as_title = ""
    dataForm.code = ""
    dataForm.sku_attrs = []


    console.log('row1', JSON.stringify(dataForm))
    return
  }

  const data = drawerApi.getData()?.row

  console.log('row', JSON.stringify(data))

  dataForm.title = data.title
  dataForm.as_title = data.as_title
  dataForm.code = data.code
  dataForm.sku_attrs = JSON.parse(JSON.stringify(data.sku_attrs))
}

const attrGroupLabel = (idx: number) => {
  return '属性组' + (idx + 1)
}

const showRadio: RadioGroupProps['options'] = [
  { label: '不展示', value: 1 },
  { label: '展示', value: 2 },
  { label: '带括号展示展示', value: 3},
]

</script>
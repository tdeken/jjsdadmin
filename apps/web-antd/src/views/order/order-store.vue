<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { useRouter } from "vue-router";
import { useQuery } from '@tanstack/vue-query';

import { vbenForm } from '#/utils';
import {  addressSelect, orderCartStore } from '#/api';

import type { AddressSelect } from './types';
import { CART_PATH } from "#/constants";

const router = useRouter();

const [Modal, drawerApi] = useVbenModal({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    formApi.validateAndSubmitForm();
  }
});


const queryKey = ['options'];

const { promise: fetchDataFn } = useQuery({
  // 在组件渲染期间预取数据
  experimental_prefetchInRender: true,
  // 获取接口数据的函数
  queryFn: addressSelect,
  queryKey,
  // 每次组件挂载时都重新获取数据。如果不需要每次都重新获取就不要设置为always
  refetchOnMount: 'always',
  // 缓存时间
  staleTime: 1000 * 60 * 5,
});

const fetchOptions = async () => {
  const res = await fetchDataFn.value

  return res.list.map((item:AddressSelect)=> {
    return {
      name: item.shop_name + "/" + item.address ,
      id: item.id,
    }
  });
}

const cus = {
  schema: [
    {
      component: 'ApiSelect',
      componentProps: {
        api: fetchOptions,
        class: 'w-full',
        labelField: 'name',
        showSearch: true,
        valueField: 'id',
      },
      defaultValue: undefined,
      fieldName: 'id',
      label: '选择客户',
      rules: 'required',
    },
  ],
}

const onSubmit = async (values: Record<string, any>) => {
  drawerApi.close();
  await orderCartStore({address_id: values.id, order_id: ''})
  router.push({
    path: CART_PATH,
    query: {address_id: values.id, order_id: ''}, // URL查询参数
  });
}

const [Form, formApi] = vbenForm(cus, onSubmit);

</script>

<template>
  <Modal> 
    <Form></Form>
  </Modal>
</template>

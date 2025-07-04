<script lang="ts" setup>
import { ref, onMounted } from 'vue';

import type { CudInterface } from '#/types/form';
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { Button, Popconfirm, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { Page, useVbenDrawer } from '@vben/common-ui';

import type { GoodsSku } from './types';
import { goodsSkuList, goodsSelectInfo, goodsSelect, goodsSkuDestroy } from '#/api';
import { useRoute } from 'vue-router';
import { $t } from '#/locales';

import UpdateComponent from './sku-update.vue';
import StoreComponent from './sku-store.vue';
import CopyComponent from './sku-copy.vue';

const unit = ref() 
const format = ref() 
const goods = ref() 
const loadSelectInfo = async () => {
  try {
    const data = await goodsSelectInfo()
    unit.value = data.unit
    format.value = data.format

    const goodsData = await goodsSelect()
    goods.value = goodsData.goods

  }catch(error){
    console.error('加载选择数据失败:', error);
  }
}

onMounted(()=>{
  loadSelectInfo()
})

const [UpdateSku, updateApi] = useVbenDrawer({
  connectedComponent: UpdateComponent,
})

const [StoreSku, storeApi] = useVbenDrawer({
  connectedComponent: StoreComponent,
})

const [CopySku, copyApi] = useVbenDrawer({
  connectedComponent: CopyComponent,
})


interface SkuPage extends CudInterface {
  copySku: (row: GoodsSku) => void;
}

const cud: SkuPage = {
  delete: async (row: GoodsSku) => {
    await goodsSkuDestroy({id: row.id})
    message.success('操作成功')
    refresh()
  },
  update: (row: GoodsSku) => {
    updateApi.setState({title: '更新可售商品'})
    updateApi.setData({goods_id: row.goods_id, row: row, unit: unit, format: format})
    updateApi.open()
  },
  create:()=> {
    storeApi.setState({title: '新增可售商品'})
    storeApi.setData({unit: unit, format: format, goods: goods})
    storeApi.open()
  },
  copySku: (row: GoodsSku) => {
    copyApi.setState({title: '新增可售商品'})
    copyApi.setData({row: row, unit: unit, format: format, copy: true, goods_id: row.goods_id})
    copyApi.open()
  },
}

interface RowType {
  id: string;
  name: string;
  phone: string;
  created_date: string;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入商品全称、简称或编号',
      },
      fieldName: 'keyword',
      label: '关键字',
    },
    {
      component: 'RangePicker',
      fieldName: 'created_date',
      label: '创建时间',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
   { field: 'name', title: '销售商品名称', minWidth: 200 },
    { field: 'short_name', title: '简称', minWidth: 150 },
    { field: 'unit', title: '单位', width:50 },
    { field: 'format', title: '规格', width:100 },
    { field: 'wp', title: '批发价(元)', width:100 },
    { field: 'rp', title: '零售价(元)', width:100 },
    { field: 'stock', title: '库存', width:100 },
    { field: 'number', title: '商品编号', width:200 },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      minWidth: 200,
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await goodsSkuList({
          page: page.currentPage,
          page_size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

function refresh() {
  GridApi.reload()
}

const useRouteStore = useRoute()

const [Grid, GridApi] = useVbenVxeGrid({tableTitle: $t(useRouteStore.meta.title), formOptions, gridOptions });

</script>

<template>
  <Page auto-content-height>
    <UpdateSku class="w-[33%]" :refresh="refresh" />
    <StoreSku class="w-[33%]" :refresh="refresh" />
    <CopySku class="w-[33%]" :refresh="refresh" />
    <Grid>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click=cud.create >
          新增销售商品
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="cud.copySku(row)" >复制</Button>
        <Button type="link" @click="cud.update(row)" >编辑</Button>
        <Popconfirm
          title = "你确定要删除吗？"
          ok-text = "确定"
          cancel-text = "取消"
          @confirm="cud.delete(row)"
        >
          <Button danger type="link" >删除</Button>
        </Popconfirm>
      </template>
    </Grid>
  </Page>
</template>
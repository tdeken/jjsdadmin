<script lang="ts" setup>
import { ref, onMounted } from 'vue';

import type { CudInterface } from '#/types/form';
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps, VxeGridListeners } from '#/adapter/vxe-table';

import { Button } from 'ant-design-vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { goodsList,goodsSelectInfo } from '#/api';
import { useRoute } from 'vue-router';
import { $t } from '#/locales';

import type { Goods, GoodsSku } from './types';
import SpuFormComponent from './goods-form.vue';
import SpuDelComponent from './goods-del.vue';
import SkuFormComponent from './sku-form.vue';
import GoodsSkuComponent from './goods-sku.vue';
import SkuDelComponent from './sku-del.vue';

const unit = ref() 
const format = ref() 
const loadSelectInfo = async () => {
  try {
    const data = await goodsSelectInfo()
    unit.value = data.unit
    format.value = data.format
  }catch(error){
    console.error('加载选择数据失败:', error);
  }
}

onMounted(()=>{
  loadSelectInfo()
})

interface SkuPage extends CudInterface {
  createSku: (row: Goods) => void;
  openSkuForm: (state :any, data: any) => void;
  updateSku: (row: GoodsSku) => void;
  copySku: (row: GoodsSku) => void;
  deleteSku: (row: GoodsSku) => void;
}

const cud: SkuPage = {
  openForm:(state :any, data: any) => {
    drawerApi.setState(state);
    drawerApi.setData(data)
    drawerApi.open();
  },
  delete: (row: Goods) => {
    modalApi.setState({ title: '确定要删除商品吗？', fullscreenButton: false });
    modalApi.setData({row: row})
    modalApi.open();
  },
  update: (row: Goods) => {
    const state = {title: '更新商品'}
    const data = {row: row}
    cud.openForm(state, data)
  },
  create:()=> {
    const state = {title: '新增商品'}
    const data = {}
    cud.openForm(state, data)
  },
  openSkuForm:(state :any, data: any) => {
    skuDrawerApi.setState(state);
    skuDrawerApi.setData(data)
    skuDrawerApi.open();
  },
  createSku: (row: Goods) => {
    const state = {title: '新增可售商品'}
    const data = {goods_id: row.id, unit: unit, format: format}
    cud.openSkuForm(state, data)
  },
  updateSku: (row: GoodsSku) => {
    const state = {title: '更新可售商品'}
    const data = {goods_id: row.goods_id, row: row, unit: unit, format: format}
    cud.openSkuForm(state, data)
  },
  copySku: (row: GoodsSku) => {
    const state = {title: '新增可售商品'}
    const data = {row: row, unit: unit, format: format, copy: true, goods_id: row.goods_id}
    cud.openSkuForm(state, data)
  },
  deleteSku: (row: GoodsSku) => {
    skuModalApi.setState({ title: '确定要销售品吗？', fullscreenButton: false });
    skuModalApi.setData({row: row})
    skuModalApi.open();
  },
}

const [SkuDelete, skuModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SkuDelComponent,
});

const [SkuForm, skuDrawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: SkuFormComponent,
});


const [Delete, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SpuDelComponent,
});

const [Form, drawerApi] = useVbenDrawer({
  connectedComponent: SpuFormComponent,
})


const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['updated_date', ['start', 'end'], ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59']]],
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
      fieldName: 'updated_date',
      label: '最后修改日期',
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

const gridOptions: VxeGridProps<Goods> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { type: 'expand', width: 60, slots: { content: 'expand_content' } },
    { field:'title', title: '商品名称', width: 300 },
    { 
      field:'sku_num', 
      title: '可售商品数'
    },
    { field:'as_title', title: '商品别名' },
    { field:'updated_date', title: '最后修改日期' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      maxWidth: 300,
    },
  ],
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await goodsList({
          page: page.currentPage,
          page_size: page.pageSize,
          ...formValues,
        });
      },
    },
  }
};

function refresh() {
  GridApi.reload()
}

const useRouteStore = useRoute()

const [Grid, GridApi] = useVbenVxeGrid({tableTitle: $t(useRouteStore.meta.title), formOptions, gridOptions });


const gridEvents: VxeGridListeners<Goods> = {
  cellClick ({ row, column }) {
    console.log(`单击行：${row.id} 单击列：${column.title}`)
  },
  cellDblclick ({ row, column }) {
    console.log(`双击行：${row.id} 双击列：${column.title}`)
  }
}

</script>

<template>
  <Page auto-content-height>
    <Form :refresh="refresh" />
    <SkuForm :refresh="refresh" />
    <SkuDelete :refresh="refresh" />
    <Delete :refresh="refresh" />
    <Grid v-on="gridEvents">
      <template #expand_content="{ row }">
          <GoodsSkuComponent 
            :data="row.goods_skus" 
            :copySku="cud.copySku"
            :updateSku="cud.updateSku"
            :deleteSku="cud.deleteSku"
          />
      </template>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="cud.create" >
          新增商品
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="cud.createSku(row)" >+销售品</Button>
        <Button type="link" @click="cud.update(row)" >编辑</Button>
        <Button danger type="link" @click="cud.delete(row)" >删除</Button>
      </template>
    </Grid>
  </Page>
</template>

<style lang="scss" scoped>
.expand-wrapper {
  padding: 16px;
}
</style>
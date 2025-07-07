<script lang="ts" setup>
import { ref, onMounted } from 'vue';

import type { CudInterface } from '#/types/form';
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Button, Popconfirm, message } from 'ant-design-vue';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { goodsList, goodsSelectInfo, goodsDestroy, goodsSkuDestroy } from '#/api';
import { useRoute } from 'vue-router';
import { $t } from '#/locales';

import type { Goods, GoodsSku } from './types';
import SpuStoreComponent from './goods-store.vue';
import SpuUpdateComponent from './goods-update.vue';

import SkuStoreComponent from './goods-sku-store.vue';
import SkuCopyComponent from './sku-copy.vue';
import SkuUpdateComponent from './sku-update.vue';

import GoodsSkuComponent from './goods-sku.vue';

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

const [SkuUpdate, skuUpdateApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: SkuUpdateComponent,
});

const [SkuStore, skuStoreApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: SkuStoreComponent,
});

const [SkuCopy, skuCopyApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: SkuCopyComponent,
});

const [Update, updateApi] = useVbenDrawer({
  connectedComponent: SpuUpdateComponent,
})

const [Store, storeApi] = useVbenDrawer({
  connectedComponent: SpuStoreComponent,
})


interface SkuPage extends CudInterface {
  createSku: (row: Goods) => void;
  updateSku: (row: GoodsSku) => void;
  copySku: (row: GoodsSku) => void;
  deleteSku: (row: GoodsSku) => void;
}

const cud: SkuPage = {
  delete: async (row: Goods) => {
    await goodsDestroy({id: row.id})
    message.success('操作成功')
    refresh()
  },
  update: (row: Goods) => {
    updateApi.setState({title: '更新商品'});
    updateApi.setData({row: row})
    updateApi.open();
  },
  create:()=> {
    storeApi.setState({title: '新增商品'});
    storeApi.open();
  },
  createSku: (row: Goods) => {
    skuStoreApi.setState({title: '新增可售商品'});
    skuStoreApi.setData({goods_id: row.id, unit: unit, format: format})
    skuStoreApi.open();
  },
  updateSku: (row: GoodsSku) => {
    skuUpdateApi.setState({title: '更新可售商品'});
    skuUpdateApi.setData({goods_id: row.goods_id, row: row, unit: unit, format: format})
    skuUpdateApi.open();
  },
  copySku: (row: GoodsSku) => {
    skuCopyApi.setState({title: '新增可售商品'});
    skuCopyApi.setData({goods_id: row.goods_id, unit: unit, format: format})
    skuCopyApi.open();
  },
  deleteSku: async (row: GoodsSku) => {
    await goodsSkuDestroy({id: row.id})
    message.success('操作成功')
    refresh()
  },
}


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
    { field:'title', title: '商品名称', minWidth: 200 },
    { 
      field:'sku_num', 
      title: '销售品数',
      width: 80,
    },
    { field:'as_title', title: '商品别名', minWidth: 200 },
    { field:'updated_date', title: '最后修改日期', minWidth: 200 },
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
  },
  rowConfig: {
    keyField: 'id'
  },
  expandConfig: {
    trigger: 'row',
    accordion: true,
    reserve: true,
  }
};

const refresh = () => {
  GridApi.reload()
}

const useRouteStore = useRoute()

const [Grid, GridApi] = useVbenVxeGrid({tableTitle: $t(useRouteStore.meta.title), formOptions, gridOptions });

</script>

<template>
  <Page auto-content-height>
    <Store class="w-[33%]" :refresh="refresh" />
    <Update class="w-[33%]" :refresh="refresh" />
    <SkuUpdate class="w-[33%]" :refresh="refresh" />
    <SkuStore class="w-[33%]" :refresh="refresh" />
    <SkuCopy class="w-[33%]" :refresh="refresh" />
    <Grid>
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
        <Popconfirm
          title = "删除后该商品下的销售商品也会删除，你确定要删除吗？"
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

<style lang="scss" scoped>
.expand-wrapper {
  padding: 16px;
}
</style>
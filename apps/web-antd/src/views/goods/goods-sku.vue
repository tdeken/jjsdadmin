<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';
import { Button, Popconfirm } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import type { GoodsSku } from './types';


interface Props {
  data?: GoodsSku[];
  copySku?: (row :GoodsSku)=>void;
  updateSku?: (row :GoodsSku)=>void;
  deleteSku?: (row :GoodsSku)=>void;
}

const props = defineProps<Props>();

const gridOptions: VxeGridProps<GoodsSku> = {
  minHeight: 150,
  maxHeight: 700,
  showOverflow: true,
  columns: [
    { field: 'name', title: '销售商品名称', width: 200 },
    { field: 'short_name', title: '简称', width: 150 },
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
  data: props.data,
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });

function copySku (row : GoodsSku){
  if (props.copySku){
    props.copySku(row)
  }
}

function updateSku (row : GoodsSku){
  if (props.updateSku){
    props.updateSku(row)
  }
}

function deleteSku (row : GoodsSku){
  if (props.deleteSku){
    props.deleteSku(row)
  }
}

</script>

<template>
  <Page>
    <Grid>
      <template #action="{ row }">
        <Button type="link" @click="copySku(row)" >复制</Button>
        <Button type="link" @click="updateSku(row)" >编辑</Button>
        <Popconfirm
          title = "你确定要删除吗？"
          ok-text = "确定"
          cancel-text = "取消"
          @confirm="deleteSku(row)"
        >
          <Button danger type="link" >删除</Button>
        </Popconfirm>
      </template>
    </Grid>
  </Page>
</template>
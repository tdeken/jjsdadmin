<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface Props {
  data?:GoodsSku[],
}

const props = defineProps<Props>();

interface GoodsSku {
  id: string;
  name: string;
  capacity: string;
  remark: string;
  format: string;
  unit: string;
  pp: string;
  wp: string;
  rp: string;
  stock: number;
  number: string;
}

const gridOptions: VxeGridProps<GoodsSku> = {
  minHeight: 150,
  maxHeight: 700,
  columns: [
    { field: 'name', title: '销售商品名称' },
    { field: 'unit', title: '单位' },
    { field: 'format', title: '规格' },
    { field: 'wp', title: '批发价' },
    { field: 'rp', title: '零售价' },
    { field: 'stock', title: '库存' },
    { field: 'number', title: '商品编号' },
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

</script>

<template>
  <Page auto-content-height>
    <Grid>
      
    </Grid>
  </Page>
</template>
import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:store',
      order: 0,
      title: $t('goods.title'),
    },
    name: 'Goods Manage',
    path: '/goods/address',
    children: [
      {
        name: 'Goods',
        path: '/goods/list',
        component: () => import('#/views/goods/index.vue'),
        meta: {
          title: $t('goods.goods'),
        },
      }
    ],
  },
];

export default routes;

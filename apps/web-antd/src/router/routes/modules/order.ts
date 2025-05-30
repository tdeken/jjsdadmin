import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:book-user',
      order: -1,
      title: $t('order.title'),
    },
    name: 'Order Manage',
    path: '/order/address',
    children: [
      {
        name: 'Order',
        path: '/order/list',
        component: () => import('#/views/order/index.vue'),
        meta: {
          title: $t('order.order'),
        },
      }
    ],
  },
];

export default routes;

import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:shopping-bag',
      order: 0,
      title: $t('shop.title'),
    },
    name: 'Shop',
    path: '/customer',
    children: [
      {
        name: 'Customer',
        path: '/customer',
        component: () => import('#/views/shop/customer/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:book-user',
          title: $t('shop.customer.customerList'),
        },
      }
    ],
  },
];

export default routes;

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
    path: '/shop/customer/address',
    children: [
      {
        name: 'CustomerAddress',
        path: '/shop/customer/address',
        component: () => import('#/views/shop/customer/address.vue'),
        meta: {
          icon: 'lucide:book-user',
          title: $t('shop.customer.address'),
        },
      },
      {
        name: 'Customer',
        path: '/shop/customer/list',
        component: () => import('#/views/shop/customer/index.vue'),
        meta: {
          icon: 'lucide:book-user',
          title: $t('shop.customer.customer'),
        },
      }
    ],
  },
];

export default routes;

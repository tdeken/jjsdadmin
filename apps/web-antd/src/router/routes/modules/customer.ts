import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:book-user',
      order: 1,
      title: $t('customer.title'),
    },
    name: 'Customer Manage',
    path: '/customer/address',
    children: [
      {
        name: 'CustomerAddress',
        path: '/customer/address',
        component: () => import('#/views/customer/address.vue'),
        meta: {
          title: $t('customer.address'),
        },
      },
      {
        name: 'Customer',
        path: '/customer/list',
        component: () => import('#/views/customer/index.vue'),
        meta: {
          title: $t('customer.customer'),
        },
      }
    ],
  },
];

export default routes;

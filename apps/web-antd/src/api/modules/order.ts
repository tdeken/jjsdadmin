import type { PageQueryParams } from '#/types'

import { requestClient } from '#/api/request';

export namespace OrderApi {

   /** 地址列表请求参数 */
  export interface ListQuery extends PageQueryParams {
    keyword: string;
    order_no: string;
    start: string;
    end: string;
    status: number;
  }
  
  /** 地址列表请求参数 */
  export interface SkuListQuery {
    order_id: string;
  }

  export interface Destroy {
    id: string;
  }

  export interface CartQuery {
    address_id: string;
    order_id: string;
  }

  export interface CartStore {
    address_id: string;
    order_id: string;
  }

  export interface CartDestroy {
    address_id: string;
    order_id: string;
    id: string;
  }

  export interface CartUpdate {
    address_id: string;
    order_id: string;
    sku_id: string;
    id: string;
    book_num: string;
    price: string;
    remark: string;
  }
  
  export interface CartAdd {
    address_id: string;
    order_id: string;
    sku_id: string;
    book_num: string;
    price: string;
    remark: string;
  }

  export interface CartClear {
    address_id: string;
    order_id: string;
  }

  export interface CartSku {
    address_id: string;
  }

  export interface CartClose {
    address_id: string;
    order_id: string;
  }

  export interface Store {
    address_id: string;
    order_id: string;
  }

   export interface PrintData {
    order_id: string;
  }
}

/**
 * 订单列表
 */
export async function orderList(params: OrderApi.ListQuery) {
  return requestClient.get('admin/order/list', { params });
}

/**
 * 订单列表
 */
export async function orderSkuList(params: OrderApi.SkuListQuery) {
  return requestClient.get('admin/order/sku-list', { params });
}

/**
 * 删除订单
 */
export async function orderDestroy(data: OrderApi.Destroy) {
  return requestClient.post('admin/order/destroy', data);
}

/**
 * 订单列表
 */
export async function orderCart(params: OrderApi.CartQuery) {
  return requestClient.get('admin/order/cart', { params });
}

/**
 * 创建购物车
 */
export async function orderCartStore(data: OrderApi.CartStore) {
  return requestClient.post('admin/order/cart-store', data);
}

/**
 * 删除购物车商品
 */
export async function orderCartDestroy(data: OrderApi.CartDestroy) {
  return requestClient.post('admin/order/cart-destroy', data);
}

/**
 * 更新购物车商品
 */
export async function orderCartUpdate(data: OrderApi.CartUpdate) {
  return requestClient.post('admin/order/cart-update', data);
}

/**
 * 添加购物车商品
 */
export async function orderCartAdd(data: OrderApi.CartAdd) {
  return requestClient.post('admin/order/cart-add', data);
}

/**
 * 清空购物车
 */
export async function orderCartClear(data: OrderApi.CartClear) {
  return requestClient.post('admin/order/cart-clear', data);
}

/**
 * 购物车商品
 */
export async function orderCartSku(params: OrderApi.CartSku) {
  return requestClient.get('admin/order/cart-sku', { params });
}

/**
 * 保存购物车
 */
export async function orderStore(data: OrderApi.Store) {
  return requestClient.post('admin/order/store', data);
}

/**
 * 购物车商品
 */
export async function orderPrintData(params: OrderApi.PrintData) {
  return requestClient.get('admin/order/print-data', { params });
}
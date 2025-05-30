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
import type { PageQueryParams } from '#/types'

import { requestClient } from '#/api/request';

export namespace GoodsApi {

   /** 商品列表请求参数 */
  export interface ListQuery extends PageQueryParams {
    keyword: string;
    start: string;
    end: string;
  }

  /** 地址创建 */
  export interface GoodsCreate {
    title: string;
    as_title: string;
    code: string;
    customer_id: string;
    sku_attrs: GoodsAttrs[][]
  }

  /** 地址创建 */
  export interface GoodsAttrs{
    mark: string;
    show_type: number;
  }

  
}

/**
 * 客户列表
 */
export async function goodsList(params: GoodsApi.ListQuery) {
  return requestClient.get('admin/goods/list', { params });
}

/**
 * 创建客户
 */
export async function goodsCreate(data: GoodsApi.GoodsCreate) {
  return requestClient.post('admin/goods/store', data);
}

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
  }
  
  /** 地址删除*/
  export interface GoodsDestroy {
    id: string;
  }

  /** 地址创建 */
  export interface GoodsUpdate extends GoodsCreate, GoodsDestroy {
  }

}

/**
 * 商品列表
 */
export async function goodsList(params: GoodsApi.ListQuery) {
  return requestClient.get('admin/goods/list', { params });
}

/**
 * 创建商品
 */
export async function goodsCreate(data: GoodsApi.GoodsCreate) {
  return requestClient.post('admin/goods/store', data);
}

/**
 * 创建商品
 */
export async function goodsUpdate(data: GoodsApi.GoodsUpdate) {
  return requestClient.post('admin/goods/update', data);
}

/**
 * 删除商品
 */
export async function goodsDestroy(data: GoodsApi.GoodsDestroy) {
  return requestClient.post('admin/goods/destroy', data);
}
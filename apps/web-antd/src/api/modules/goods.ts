import type { PageQueryParams } from '#/types'

import { requestClient } from '#/api/request';

export namespace GoodsApi {

   /** 商品列表请求参数 */
  export interface ListQuery extends PageQueryParams {
    keyword: string;
    start: string;
    end: string;
  }

  /** 商品创建 */
  export interface GoodsCreate {
    title: string;
    as_title: string;
  }
  
  /** 商品删除*/
  export interface GoodsDestroy {
    id: string;
  }

  /** 商品更新 */
  export interface GoodsUpdate extends GoodsCreate, GoodsDestroy {
  }

  /** 创建销售品 */
  export interface SkuCreate {
    goods_id: string;
    capacity: string;
    remark: string;
    format: string;
    unit: string;
    pp: string;
    wp: string;
    rp: string;
    stock: number;
    stock_tip: number;
    number: number;
    short_name: string;
  }

  /** 删除销售品 */
  export interface SkuDestroy {
    id: string;
  }

  /** 商品更新 */
  export interface SkuUpdate {
    id: string;
    capacity: string;
    remark: string;
    format: string;
    unit: string;
    pp: string;
    wp: string;
    rp: string;
    stock: number;
    stock_tip: number;
    number: number;
    short_name: string;
  }


  /** 可销售商品列表请求参数 */
  export interface SkuListQuery extends PageQueryParams {
    keyword: string;
    start: string;
    end: string;
  }

}

/**
 * 商品列表
 */
export async function goodsList(params: GoodsApi.ListQuery) {
  return requestClient.get('admin/goods/list', { params });
}

/**
 * 商品选择
 */
export async function goodsSelect() {
  return requestClient.get('admin/goods/select');
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

/**
 * sku选择数据
 */
export async function goodsSelectInfo() {
  return requestClient.get('admin/goods/select-info');
}

/**
 * sku创建
 */
export async function goodsSkuCreate(data: GoodsApi.SkuCreate) {
  return requestClient.post('admin/goods/sku-store', data);
}

/**
 * sku更新
 */
export async function goodsSkuUpdate(data: GoodsApi.SkuUpdate) {
  return requestClient.post('admin/goods/sku-update', data);
}

/**
 * sku删除
 */
export async function goodsSkuDestroy(data: GoodsApi.SkuDestroy) {
  return requestClient.post('admin/goods/sku-destroy', data);
}

/**
 * 可销售商品列表
 */
export async function goodsSkuList(params: GoodsApi.SkuListQuery) {
  return requestClient.get('admin/goods/sku-list', { params });
}
import type { PageQueryParams } from '#/types'

import { requestClient } from '#/api/request';

export namespace CustomerApi {
  
  /** 客户选择接口接口返回值 */
  export interface SelectResult {
    list: SelectOne[];
  }

  /** 客户选择接口查询结果单条记录 */
  export interface SelectOne {
    id: string;
    name: string;
  }

   /** 地址列表请求参数 */
  export interface AddressListQuery extends PageQueryParams {
    title: string;
    tel: string;
  }

   /** 客户列表列表请求参数 */
   export interface ListQuery extends PageQueryParams {
    name: string;
    phone: string;
  }

  /** 地址创建 */
  export interface AddressCreate {
    title: string;
    address: string;
    tel: string;
    customer_id: string;
  }


  /** 地址创建 */
  export interface AddressDestroy {
    id: string;
  }
  
  export interface AddressUpdate extends AddressDestroy, AddressCreate {
  }
  
}

/**
 * 客户列表
 */
export async function list(params: CustomerApi.ListQuery) {
  return requestClient.get('admin/customer/list', { params });
}

/**
 * 客户选择
 */
export async function customerSelect() {
  return requestClient.get<CustomerApi.SelectResult>('admin/customer/select');
}

/**
 * 地址列表
 */
export async function addressList(params: CustomerApi.AddressListQuery) {
  return requestClient.get('admin/customer/address-list', { params });
}

/**
 * 创建地址
 */
export async function addressCreate(data: CustomerApi.AddressCreate) {
  return requestClient.post('admin/customer/address-create', data);
}

/**
 * 更新地址
 */
export async function addressUpdate(data: CustomerApi.AddressUpdate) {
  return requestClient.post('admin/customer/address-update', data);
}

/**
 * 删除地址
 */
export async function addressDestroy(data: CustomerApi.AddressDestroy) {
  return requestClient.post('admin/customer/address-destroy', data);
}
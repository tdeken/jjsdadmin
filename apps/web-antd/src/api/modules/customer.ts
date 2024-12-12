import type { PaginationQuery } from '@vben/types';


import { requestClient } from '#/api/request';

export namespace CustomerApi {
  /** 登录接口参数 */
  export interface AddressListParams extends PaginationQuery  {
    
  }

  /** 登录接口返回值 */
  export interface AddressListOne {
    id: string;
    title: string;
    address: string;
    tel: string;
    created_date: string;
  }

  /** 登录接口返回值 */
  export interface AddressListResult {
    total: number;
    list: AddressListOne[];
  }

}

/**
 * 登录
 */
export async function addressList(data: CustomerApi.AddressListParams) {
  return requestClient.get<CustomerApi.AddressListResult>('admin/customer/address-list', data);
}
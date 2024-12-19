
import { requestClient } from '#/api/request';

export namespace CustomerApi {

}

/**
 * 客户列表
 */
export async function list(data: any) {
  return requestClient.get('admin/customer/list', data);
}

/**
 * 地址列表
 */
export async function addressList(data: any) {
  return requestClient.get('admin/customer/address-list', data);
}
import request from '@/utils/request'

export function getAddressList(params) {
  return request({
    url: '/admin/customer/address-list',
    method: 'get',
    params
  })
}

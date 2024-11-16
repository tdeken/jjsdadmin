import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/admin-user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/admin-user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/admin-user/logout',
    method: 'get'
  })
}

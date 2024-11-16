import Cookies from 'js-cookie'

const TokenKey = 'jjsd_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const AdminUser = 'jjsd_admin_user'

export function getAdminUser() {
  const user = Cookies.get(AdminUser) || {}
  return JSON.parse(user)
}

export function setAdminUser(name) {
  const user = { name: name }
  return Cookies.set(AdminUser, JSON.stringify(user))
}

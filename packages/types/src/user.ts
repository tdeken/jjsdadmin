/** 用户信息 */
interface UserInfo {
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户昵称
   */
  name: string;
  /**
   * 用户角色
   */
  roles?: string[];
  /**
   * 用户id
   */
  user_id: string;
  /**
   * 用户名
   */
  username: string;

  /**
   * 用户描述
   */
  desc: string;
  /**
   * 首页地址
   */
  homePath: string;

  /**
   * accessToken
   */
  token: string;
}

export type { UserInfo };

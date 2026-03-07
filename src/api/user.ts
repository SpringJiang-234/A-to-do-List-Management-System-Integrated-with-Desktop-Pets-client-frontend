import { http } from "@/utils/http";

export type UserResult = {
  code: number;
  msg: string;
  data: {
    /** 用户ID */
    id: number;
    /** 用户名 */
    username: string;
    /** 账号 */
    account: string;
    /** 角色 */
    role: string;
    /** 头像 */
    avatar: string;
    /** `token` */
    token: string;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/api/security/login", { data });
};

/** 登出 */
export const getLogout = () => {
  return http.request("get", "/api/security/logout");
};

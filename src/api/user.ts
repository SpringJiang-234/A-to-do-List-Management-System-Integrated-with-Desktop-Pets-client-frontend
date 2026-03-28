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
    /** 性别 */
    gender: number;
    /** 生日 */
    birth: string;
  };
};

export type UpdateUserResult = {
  code: number;
  msg: string;
  data: null;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/api/security/login", { data });
};

/** 登出 */
export const getLogout = () => {
  return http.request("get", "/api/security/logout");
};

/** 获取用户信息 */
export const getUserInfo = () => {
  return http.request<UserResult>("get", "/api/user/info");
};

/** 更新用户信息 */
export const updateUser = (data?: object) => {
  return http.request<UpdateUserResult>("post", "/api/user/update", { data });
};

/** 上传用户头像 */
export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.request<{ code: number; msg: string; data: string }>(
    "post",
    "/api/user/uploadAvatar",
    { data: formData }
  );
};

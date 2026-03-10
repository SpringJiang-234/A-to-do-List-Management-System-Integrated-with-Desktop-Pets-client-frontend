import Cookies from "js-cookie";
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal, isString, isIncludeAllChildren } from "@pureadmin/utils";

export interface DataInfo<T> {
  /** 用户ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 账号 */
  account: string;
  /** 角色 */
  roles: Array<string>;
  /** 头像 */
  avatar: string;
  /** token */
  token: string;
}

export const userKey = "user-info";
export const TokenKey = "authorized-token";
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = "multiple-tabs";

/** 获取`token` */
export function getToken(): DataInfo<number> {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageLocal().getItem(userKey);
}

/**
 * @description 设置`token`以及一些必要信息
 * 将token信息放在key值为authorized-token的cookie里
 * 将用户信息放在key值为`user-info`的localStorage里
 */
export function setToken(data: DataInfo<number>) {
  const { token, username, account, roles } = data;
  const { isRemembered, loginDay } = useUserStoreHook();
  
  // 设置token到cookie，过期时间为1天（86400秒）
  Cookies.set(TokenKey, JSON.stringify(data), {
    expires: 1
  });

  // 设置multipleTabsKey
  Cookies.set(
    multipleTabsKey,
    "true",
    isRemembered
      ? {
          expires: loginDay
        }
      : {}
  );

  // 存储用户信息到localStorage
  storageLocal().setItem(userKey, {
    ...data
  });
}

/**
 * @description 设置`token`以及一些必要信息
 * 将token信息放在key值为authorized-token的cookie里
 * 将用户信息放在key值为`user-info`的localStorage里
 */
export function setTokenFromLogin(data: any) {
  const { token, username, account, role } = data;
  const { isRemembered, loginDay } = useUserStoreHook();
  
  // 先清除旧的 localStorage 和 cookie
  removeToken();
  
  const dataWithRoles = {
    ...data,
    roles: [role],
    avatar: data.avatar ? data.avatar.split('?')[0] : ''
  };
  
  // 设置token到cookie，过期时间为1天（86400秒）
  Cookies.set(TokenKey, JSON.stringify(dataWithRoles), {
    expires: 1
  });

  // 设置multipleTabsKey
  Cookies.set(
    multipleTabsKey,
    "true",
    isRemembered
      ? {
          expires: loginDay
        }
      : {}
  );

  // 存储用户信息到localStorage
  storageLocal().setItem(userKey, dataWithRoles);
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};

/** 是否有按钮级别的权限 */
export const hasPerms = (value: string | Array<string>): boolean => {
  if (!value) return false;
  const allPerms = "*:*:*";
  const { roles } = useUserStoreHook();
  if (!roles) return false;
  if (roles.includes("admin")) return true;
  return false;
};
